// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

const sendMessage = vi.fn().mockResolvedValue(true)
const chat = {
    conversationId: "c1", projectId: undefined, messages: [], discovery: { completeness: 20, nextQuestions: [{ id: "q1", field: "industry", type: "single-select", label: "Industry?", required: true, options: [{ value: "education", label: "Education" }] }], readyForProposal: false }, quote: undefined, requirements: {}, isLoading: false, isSending: false, error: "send failed", failedMessage: "retry this", streamingMessageId: undefined, sendMessage,
}

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key, useLocale: () => "vi" }))
vi.mock("@/i18n/routing", () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }), Link: () => null, routing: { locales: ["vi"] }, usePathname: () => "/chat" }))
vi.mock("@/hooks/useConsultationChat", () => ({ useConsultationChat: () => chat }))
vi.mock("@/hooks/rhf/useConsultationComposerForm", () => ({ useConsultationComposerForm: () => ({ register: () => ({}), watch: () => "draft", onSubmit: vi.fn() }) }))

import { ConsultationChat } from "./consultation-chat"

describe("ConsultationChat interaction callbacks", () => {
    it("invokes discovery, keyboard, retry, navigation, attachment and drag handlers", () => {
        Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: vi.fn() })
        render(<ConsultationChat initialConversationId="c1" />)
        fireEvent.click(screen.getByRole("button", { name: "TEDO" }))
        fireEvent.click(screen.getByRole("button", { name: "back" }))
        fireEvent.click(screen.getByRole("button", { name: "Education" }))
        fireEvent.click(screen.getByRole("button", { name: "retrySend" }))
        fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", shiftKey: false })
        const form = document.querySelector("form")
        expect(form).toBeTruthy()
        fireEvent.dragOver(form as HTMLFormElement)
        const files = [new File(["hello"], "brief.txt", { type: "text/plain" })]
        const inputs = document.querySelectorAll("input[type='file']")
        if (inputs[0] === undefined || inputs[1] === undefined) throw new Error("expected attachment inputs")
        fireEvent.change(inputs[0], { target: { files } })
        fireEvent.change(inputs[1], { target: { files } })
        fireEvent.click(screen.getByRole("button", { name: "addImage" }))
        fireEvent.click(screen.getByRole("button", { name: "addFile" }))
        expect(sendMessage.mock.calls.length).toBeGreaterThan(0)
    })
})
