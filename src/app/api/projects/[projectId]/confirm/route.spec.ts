import { beforeEach, describe, expect, it, vi, type Mock } from "vitest"
import { BackendGraphqlError, BackendUnavailableError, confirmProjectRequirements } from "@/lib/consultation/graphql"
import { POST } from "./route"

vi.mock("@/lib/consultation/graphql", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/consultation/graphql")>()
    return { ...actual, confirmProjectRequirements: vi.fn() }
})

const mockedConfirmProjectRequirements = confirmProjectRequirements as Mock
const projectId = "22222222-2222-2222-2222-222222222222"

describe("POST /api/projects/[projectId]/confirm", () => {
    beforeEach(() => {
        mockedConfirmProjectRequirements.mockReset()
    })

    it("rejects a non-UUID projectId without reaching the backend", async () => {
        const response = await POST(new Request("http://test/api/projects/not-a-uuid/confirm", { method: "POST" }), {
            params: Promise.resolve({ projectId: "not-a-uuid" }),
        })

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: "invalid-project" })
        expect(mockedConfirmProjectRequirements).not.toHaveBeenCalled()
    })

    it("confirms the current revision over GraphQL and returns the snapshot unchanged", async () => {
        const snapshot = {
            projectId, revisionId: "rev-1", version: 3, requirements: {},
            discovery: { completeness: 100, missingFields: [], nextQuestions: [], readyForProposal: true },
        }
        mockedConfirmProjectRequirements.mockResolvedValue(snapshot)

        const response = await POST(new Request(`http://test/api/projects/${projectId}/confirm`, { method: "POST" }), {
            params: Promise.resolve({ projectId }),
        })

        expect(mockedConfirmProjectRequirements).toHaveBeenCalledWith(projectId)
        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual(snapshot)
    })

    it("maps a backend domain error to the same code/message/metadata envelope and status the REST forwarder relayed", async () => {
        mockedConfirmProjectRequirements.mockRejectedValue(new BackendGraphqlError({
            code: "REQUIREMENTS_INCOMPLETE_EXCEPTION", message: "incomplete", status: 409, metadata: {},
        }))

        const response = await POST(new Request(`http://test/api/projects/${projectId}/confirm`, { method: "POST" }), {
            params: Promise.resolve({ projectId }),
        })

        expect(response.status).toBe(409)
        await expect(response.json()).resolves.toEqual({ code: "REQUIREMENTS_INCOMPLETE_EXCEPTION", message: "incomplete", metadata: {} })
    })

    it("returns backend-unavailable at 503 when the backend cannot be reached", async () => {
        mockedConfirmProjectRequirements.mockRejectedValue(new BackendUnavailableError())

        const response = await POST(new Request(`http://test/api/projects/${projectId}/confirm`, { method: "POST" }), {
            params: Promise.resolve({ projectId }),
        })

        expect(response.status).toBe(503)
        await expect(response.json()).resolves.toEqual({ error: "backend-unavailable" })
    })
})
