import { describe, expect, it } from "vitest"
import { isConsultationSessionResponse, isConsultationTurnResponse, isGeneratedProposalResponse } from "./types"

describe("consultation response guards", () => {
    it("accepts a complete consultation turn", () => {
        expect(isConsultationTurnResponse({
            conversationId: "conversation",
            userMessageId: "user-message",
            assistantMessageId: "assistant-message",
            answer: "Tell me about the users.",
            projectId: "project",
            requirementsVersion: 1,
            handoffRequired: false,
            requirements: {},
            commercialQuote: { status: "insufficient-scope", currency: "VND", reviewReasons: [] },
            discovery: { completeness: 10, missingFields: [], nextQuestions: [], readyForProposal: false },
        })).toBe(true)
    })

    it("rejects malformed persisted sessions", () => {
        expect(isConsultationSessionResponse({ id: "conversation", messages: [{ role: "assistant" }] })).toBe(false)
    })

    it("accepts generated document metadata", () => {
        expect(isGeneratedProposalResponse({
            id: "proposal",
            projectId: "project",
            version: 1,
            documents: [{ id: "document", fileName: "proposal.pdf", kind: "proposal", mimeType: "application/pdf" }],
        })).toBe(true)
    })
})
