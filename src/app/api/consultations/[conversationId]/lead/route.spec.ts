import { beforeEach, describe, expect, it, vi, type Mock } from "vitest"
import { BackendGraphqlError, BackendUnavailableError, qualifyConsultationLead } from "@/lib/consultation/graphql"
import { POST } from "./route"

vi.mock("@/lib/consultation/graphql", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/consultation/graphql")>()
    return { ...actual, qualifyConsultationLead: vi.fn() }
})

const mockedQualifyConsultationLead = qualifyConsultationLead as Mock
const conversationId = "11111111-1111-1111-1111-111111111111"
const validLeadInput = { name: "An", phone: "0900000000", email: "", company: "", preferredChannel: "phone" as const, consent: true as const }

let ipCounter = 0
/** A fresh source IP per request keeps the module-level rate-limit window from colliding across tests. */
const nextIp = (): string => { ipCounter += 1; return `10.0.0.${ipCounter}` }

const postLead = (path: string, body: unknown): Promise<Response> =>
    POST(new Request(`http://test${path}`, {
        method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": nextIp() }, body: JSON.stringify(body),
    }), { params: Promise.resolve({ conversationId }) })

const postRawBody = (rawBody: string): Promise<Response> =>
    POST(new Request(`http://test/api/consultations/${conversationId}/lead`, {
        method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": nextIp() }, body: rawBody,
    }), { params: Promise.resolve({ conversationId }) })

describe("POST /api/consultations/[conversationId]/lead", () => {
    beforeEach(() => {
        mockedQualifyConsultationLead.mockReset()
    })

    it("rejects a non-UUID conversationId without reaching the backend", async () => {
        const response = await POST(new Request("http://test/api/consultations/not-a-uuid/lead", {
            method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": nextIp() }, body: JSON.stringify(validLeadInput),
        }), { params: Promise.resolve({ conversationId: "not-a-uuid" }) })

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: "invalid-conversation" })
        expect(mockedQualifyConsultationLead).not.toHaveBeenCalled()
    })

    it("rejects an unparsable body without reaching the backend", async () => {
        const response = await postRawBody("not json")

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: "invalid-body" })
        expect(mockedQualifyConsultationLead).not.toHaveBeenCalled()
    })

    it("forwards the parsed body as the mutation input and returns the qualified lead", async () => {
        mockedQualifyConsultationLead.mockResolvedValue({ leadId: "lead-1", status: "qualified" })

        const response = await postLead(`/api/consultations/${conversationId}/lead`, validLeadInput)

        expect(mockedQualifyConsultationLead).toHaveBeenCalledWith(conversationId, validLeadInput)
        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ leadId: "lead-1", status: "qualified" })
    })

    it("maps a backend domain error to the same code/message/metadata envelope and status the REST forwarder relayed", async () => {
        mockedQualifyConsultationLead.mockRejectedValue(new BackendGraphqlError({
            code: "SCOPE_INVALID_EXCEPTION", message: "invalid scope", status: 400, metadata: { issueCount: 1 },
        }))

        const response = await postLead(`/api/consultations/${conversationId}/lead`, validLeadInput)

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ code: "SCOPE_INVALID_EXCEPTION", message: "invalid scope", metadata: { issueCount: 1 } })
    })

    it("returns backend-unavailable at 503 when the backend cannot be reached", async () => {
        mockedQualifyConsultationLead.mockRejectedValue(new BackendUnavailableError())

        const response = await postLead(`/api/consultations/${conversationId}/lead`, validLeadInput)

        expect(response.status).toBe(503)
        await expect(response.json()).resolves.toEqual({ error: "backend-unavailable" })
    })
})
