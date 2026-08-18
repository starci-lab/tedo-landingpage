import { beforeEach, describe, expect, it, vi, type Mock } from "vitest"
import { BackendGraphqlError, BackendUnavailableError, generateProjectProposal } from "@/lib/consultation/graphql"
import { POST } from "./route"

vi.mock("@/lib/consultation/graphql", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/consultation/graphql")>()
    return { ...actual, generateProjectProposal: vi.fn() }
})

const mockedGenerateProjectProposal = generateProjectProposal as Mock
const projectId = "22222222-2222-2222-2222-222222222222"

describe("POST /api/projects/[projectId]/proposals", () => {
    beforeEach(() => {
        mockedGenerateProjectProposal.mockReset()
    })

    it("rejects a non-UUID projectId without reaching the backend", async () => {
        const response = await POST(new Request("http://test/api/projects/not-a-uuid/proposals", { method: "POST" }), {
            params: Promise.resolve({ projectId: "not-a-uuid" }),
        })

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: "invalid-project" })
        expect(mockedGenerateProjectProposal).not.toHaveBeenCalled()
    })

    it("generates the proposal over GraphQL and returns the documents in the shape the browser expects", async () => {
        const proposal = {
            id: "prop-1", projectId, version: 1, status: "draft",
            estimate: { status: "proposal-ready", currency: "VND", lines: [], missingFields: [], reviewReasons: [], requirements: {} },
            lines: [],
            documents: [{ id: "doc-1", kind: "proposal", fileName: "proposal.pdf", mimeType: "application/pdf", downloadUrl: "https://backend.test/documents/doc-1" }],
        }
        mockedGenerateProjectProposal.mockResolvedValue(proposal)

        const response = await POST(new Request(`http://test/api/projects/${projectId}/proposals`, { method: "POST" }), {
            params: Promise.resolve({ projectId }),
        })

        expect(mockedGenerateProjectProposal).toHaveBeenCalledWith(projectId)
        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual(proposal)
    })

    it("maps a backend domain error to the same code/message/metadata envelope and status the REST forwarder relayed", async () => {
        mockedGenerateProjectProposal.mockRejectedValue(new BackendGraphqlError({
            code: "COMMERCIAL_REVIEW_REQUIRED_EXCEPTION", message: "needs review", status: 409, metadata: {},
        }))

        const response = await POST(new Request(`http://test/api/projects/${projectId}/proposals`, { method: "POST" }), {
            params: Promise.resolve({ projectId }),
        })

        expect(response.status).toBe(409)
        await expect(response.json()).resolves.toEqual({ code: "COMMERCIAL_REVIEW_REQUIRED_EXCEPTION", message: "needs review", metadata: {} })
    })

    it("returns backend-unavailable at 503 when the backend cannot be reached", async () => {
        mockedGenerateProjectProposal.mockRejectedValue(new BackendUnavailableError())

        const response = await POST(new Request(`http://test/api/projects/${projectId}/proposals`, { method: "POST" }), {
            params: Promise.resolve({ projectId }),
        })

        expect(response.status).toBe(503)
        await expect(response.json()).resolves.toEqual({ error: "backend-unavailable" })
    })
})
