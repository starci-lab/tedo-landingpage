import { beforeEach, describe, expect, it, vi, type Mock } from "vitest"
import { BackendGraphqlError, BackendUnavailableError, fetchConsultation } from "@/lib/consultation/graphql"
import { GET } from "./route"

vi.mock("@/lib/consultation/graphql", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/consultation/graphql")>()
    return { ...actual, fetchConsultation: vi.fn() }
})

const mockedFetchConsultation = fetchConsultation as Mock
const conversationId = "11111111-1111-1111-1111-111111111111"

describe("GET /api/consultations/[conversationId]", () => {
    beforeEach(() => {
        mockedFetchConsultation.mockReset()
    })

    it("rejects a non-UUID conversationId without reaching the backend", async () => {
        const response = await GET(new Request("http://test/api/consultations/not-a-uuid"), {
            params: Promise.resolve({ conversationId: "not-a-uuid" }),
        })

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: "invalid-conversation" })
        expect(mockedFetchConsultation).not.toHaveBeenCalled()
    })

    it("returns the session fetched over GraphQL unchanged, in the same shape the REST forwarder returned", async () => {
        const session = {
            conversationId, channel: "web", status: "open",
            lastMessageAt: "2026-01-01T00:00:00.000Z", messages: [],
            project: { projectId: "p1", revisionId: "r1", version: 1, requirements: {}, discovery: { completeness: 10, missingFields: [], nextQuestions: [], readyForProposal: false } },
        }
        mockedFetchConsultation.mockResolvedValue(session)

        const response = await GET(new Request(`http://test/api/consultations/${conversationId}`), {
            params: Promise.resolve({ conversationId }),
        })

        expect(mockedFetchConsultation).toHaveBeenCalledWith(conversationId)
        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual(session)
    })

    it("maps a backend domain error to the same code/message/metadata envelope and status the REST forwarder relayed", async () => {
        mockedFetchConsultation.mockRejectedValue(new BackendGraphqlError({
            code: "CONSULTATION_NOT_FOUND_EXCEPTION", message: "Consultation not found", status: 404, metadata: {},
        }))

        const response = await GET(new Request(`http://test/api/consultations/${conversationId}`), {
            params: Promise.resolve({ conversationId }),
        })

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({ code: "CONSULTATION_NOT_FOUND_EXCEPTION", message: "Consultation not found", metadata: {} })
    })

    it("returns backend-unavailable at 503 when the backend cannot be reached", async () => {
        mockedFetchConsultation.mockRejectedValue(new BackendUnavailableError())

        const response = await GET(new Request(`http://test/api/consultations/${conversationId}`), {
            params: Promise.resolve({ conversationId }),
        })

        expect(response.status).toBe(503)
        await expect(response.json()).resolves.toEqual({ error: "backend-unavailable" })
    })
})
