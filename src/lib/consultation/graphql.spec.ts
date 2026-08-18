import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
    BackendGraphqlError, BackendUnavailableError,
    confirmProjectRequirements, fetchConsultation, generateProjectProposal, qualifyConsultationLead,
    toBackendErrorResponse,
} from "./graphql"

const jsonResponse = (body: unknown, status = 200): Response =>
    new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } })

interface CapturedRequest { url: string; query: string; variables: Record<string, unknown> }

const stubGraphqlFetch = (response: Response): { fetchMock: ReturnType<typeof vi.fn>; captured: () => CapturedRequest } => {
    const fetchMock = vi.fn().mockResolvedValue(response)
    vi.stubGlobal("fetch", fetchMock)
    const captured = (): CapturedRequest => {
        const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
        const body = JSON.parse(init.body as string) as { query: string; variables: Record<string, unknown> }
        return { url, query: body.query, variables: body.variables }
    }
    return { fetchMock, captured }
}

describe("consultation graphql client", () => {
    beforeEach(() => {
        vi.stubEnv("TEDO_BACKEND_URL", "http://backend.test")
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.unstubAllEnvs()
    })

    it("sends the consultation query against the backend's /graphql endpoint with the conversationId variable", async () => {
        const { captured } = stubGraphqlFetch(jsonResponse({
            data: {
                consultation: {
                    conversationId: "abc", channel: "web", status: "open",
                    lastMessageAt: "2026-01-01T00:00:00.000Z", messages: [],
                },
            },
        }))

        const result = await fetchConsultation("abc")

        const request = captured()
        expect(request.url).toBe("http://backend.test/graphql")
        expect(request.query).toContain("query Consultation($conversationId: ID!)")
        expect(request.query).toContain("consultation(conversationId: $conversationId)")
        expect(request.variables).toEqual({ conversationId: "abc" })
        expect(result.conversationId).toBe("abc")
    })

    it("sends the qualifyConsultationLead mutation with conversationId and input variables", async () => {
        const input = { name: "An", phone: "0900000000", preferredChannel: "phone" as const, consent: true as const }
        const { captured } = stubGraphqlFetch(jsonResponse({
            data: { qualifyConsultationLead: { leadId: "lead-1", status: "qualified" } },
        }))

        const result = await qualifyConsultationLead("abc", input)

        const request = captured()
        expect(request.query).toContain("mutation QualifyConsultationLead($conversationId: ID!, $input: QualifyConsultationLeadInput!)")
        expect(request.query).toContain("qualifyConsultationLead(conversationId: $conversationId, input: $input)")
        expect(request.variables).toEqual({ conversationId: "abc", input })
        expect(result).toEqual({ leadId: "lead-1", status: "qualified" })
    })

    it("sends the confirmProjectRequirements mutation with the projectId variable", async () => {
        const { captured } = stubGraphqlFetch(jsonResponse({
            data: {
                confirmProjectRequirements: {
                    projectId: "p1", revisionId: "r1", version: 2, requirements: {},
                    discovery: { completeness: 100, missingFields: [], nextQuestions: [], readyForProposal: true },
                },
            },
        }))

        const result = await confirmProjectRequirements("p1")

        const request = captured()
        expect(request.query).toContain("mutation ConfirmProjectRequirements($projectId: String!)")
        expect(request.query).toContain("confirmProjectRequirements(projectId: $projectId)")
        expect(request.variables).toEqual({ projectId: "p1" })
        expect(result.projectId).toBe("p1")
    })

    it("sends the generateProjectProposal mutation with the projectId variable", async () => {
        const { captured } = stubGraphqlFetch(jsonResponse({
            data: {
                generateProjectProposal: {
                    id: "prop-1", projectId: "p1", version: 1, status: "draft",
                    estimate: { status: "proposal-ready", currency: "VND", lines: [], missingFields: [], reviewReasons: [], requirements: {} },
                    lines: [], documents: [],
                },
            },
        }))

        const result = await generateProjectProposal("p1")

        const request = captured()
        expect(request.query).toContain("mutation GenerateProjectProposal($projectId: String!)")
        expect(request.query).toContain("generateProjectProposal(projectId: $projectId)")
        expect(request.variables).toEqual({ projectId: "p1" })
        expect(result.id).toBe("prop-1")
    })

    it("maps a GraphQL domain error to a typed BackendGraphqlError carrying code, status, and metadata", async () => {
        stubGraphqlFetch(jsonResponse({
            data: null,
            errors: [{
                message: "Consultation not found",
                extensions: { code: "CONSULTATION_NOT_FOUND_EXCEPTION", status: 404, metadata: { conversationId: "missing" } },
            }],
        }))

        await expect(fetchConsultation("missing")).rejects.toMatchObject({
            code: "CONSULTATION_NOT_FOUND_EXCEPTION", status: 404, metadata: { conversationId: "missing" }, message: "Consultation not found",
        })
    })

    it("falls back to code BACKEND_GRAPHQL_ERROR and status 500 when a GraphQL error carries no extensions", async () => {
        stubGraphqlFetch(jsonResponse({ errors: [{ message: "boom" }] }))

        const error = await fetchConsultation("abc").catch((caught: unknown) => caught)

        expect(error).toBeInstanceOf(BackendGraphqlError)
        expect((error as BackendGraphqlError).code).toBe("BACKEND_GRAPHQL_ERROR")
        expect((error as BackendGraphqlError).status).toBe(500)
        expect((error as BackendGraphqlError).message).toBe("boom")
    })

    it("throws BackendUnavailableError when the backend cannot be reached", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("fetch failed")))

        await expect(fetchConsultation("abc")).rejects.toBeInstanceOf(BackendUnavailableError)
    })

    it("throws BackendUnavailableError when the response body is not valid JSON", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not json", { status: 200 })))

        await expect(fetchConsultation("abc")).rejects.toBeInstanceOf(BackendUnavailableError)
    })

    it("throws BackendUnavailableError when the GraphQL response has neither data nor errors", async () => {
        stubGraphqlFetch(jsonResponse({}))

        await expect(fetchConsultation("abc")).rejects.toBeInstanceOf(BackendUnavailableError)
    })
})

describe("toBackendErrorResponse", () => {
    it("maps a BackendGraphqlError to the domain error envelope at its mapped status", async () => {
        const response = toBackendErrorResponse(new BackendGraphqlError({
            code: "PROJECT_NOT_FOUND_EXCEPTION", message: "not found", status: 404, metadata: { projectId: "p1" },
        }))

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({ code: "PROJECT_NOT_FOUND_EXCEPTION", message: "not found", metadata: { projectId: "p1" } })
    })

    it("maps any other error to the backend-unavailable envelope at 503", async () => {
        const response = toBackendErrorResponse(new Error("network down"))

        expect(response.status).toBe(503)
        await expect(response.json()).resolves.toEqual({ error: "backend-unavailable" })
    })
})
