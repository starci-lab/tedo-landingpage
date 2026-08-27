import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

const chatState = {
    conversationId: "conversation-1",
    projectId: "project-1",
    messages: [{ id: "m1", role: "assistant", content: "Welcome" }],
    discovery: { completeness: 50, nextQuestions: [{ id: "q1", label: "Industry?", options: [{ label: "Education" }] }], readyForProposal: false },
    requirements: { productType: "web", industry: "education" },
    isLoading: false,
    isSending: false,
    error: "Could not send",
    failedMessage: "Retry me",
    streamingMessageId: "m1",
    sessions: [{ id: "conversation-1", conversationId: "conversation-1", title: "Booking platform" }],
    activeSessionId: "conversation-1",
    sendMessage: vi.fn(),
    startNewChat: vi.fn(),
    openChat: vi.fn(),
}

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key, useLocale: () => "vi" }))
vi.mock("@/i18n/routing", () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }), Link: () => null, routing: { locales: ["vi"] }, usePathname: () => "/chat" }))
vi.mock("@/hooks/useConsultationChat", () => ({ useConsultationChat: () => chatState }))
vi.mock("@/hooks/rhf/useConsultationComposerForm", () => ({ useConsultationComposerForm: () => ({ register: () => ({}), watch: () => "draft", onSubmit: vi.fn() }) }))

import { ConsultationChat } from "./consultation-chat"

describe("ConsultationChat", () => {
    it("renders assistant history, sending/error state, discovery options and profile facts", () => {
        const html = renderToStaticMarkup(<ConsultationChat initialConversationId="conversation-1" />)
        expect(html).toContain("Welcome")
        expect(html).toContain("Could not send")
        expect(html).toContain("Industry?")
        expect(html).toContain("Education")
        expect(html).toContain("50%")
        expect(html).toContain("Booking platform")
        expect(html).toContain("newChat")
    })

    it("renders the initial empty conversation shell", () => {
        const original = { ...chatState }
        Object.assign(chatState, { conversationId: undefined, projectId: undefined, messages: [], discovery: undefined, requirements: {}, isLoading: false, isSending: false, error: undefined, failedMessage: undefined, streamingMessageId: undefined })
        const html = renderToStaticMarkup(<ConsultationChat />)
        expect(html).toContain("greeting")
        expect(html).toContain("composerPlaceholder")
        Object.assign(chatState, original)
    })
})
