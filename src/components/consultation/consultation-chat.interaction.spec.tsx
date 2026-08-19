// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

const sendMessage = vi.fn().mockResolvedValue(true)
const chat = {
    conversationId: "c1", projectId: undefined, messages: [], discovery: { completeness: 20, nextQuestions: [{ id: "q1", field: "industry", type: "single-select", label: "Industry?", required: true, options: [{ value: "education", label: "Education" }] }], readyForProposal: false }, quote: undefined, requirements: {}, isLoading: false, isSending: false, error: "send failed", failedMessage: "retry this", streamingMessageId: undefined, sendMessage,
}

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key, useLocale: () => "vi" }))
vi.mock("@/i18n/routing", () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }), Link: () => null, routing: { locales: ["vi"] }, usePathname: () => "/chat" }))
vi.mock("@/hooks/useConsultationChat", () => ({ useConsultationChat: () => chat }))
vi.mock("@/hooks/rhf/useConsultationComposerForm", () => ({ useConsultationComposerForm: () => ({ register: () => ({}), watch: () => "draft", onSubmit: vi.fn() }) }))
vi.mock("./consultation-lead-form", () => ({ ConsultationLeadForm: () => <div>lead-form</div> }))

import { ConsultationChat } from "./consultation-chat"

describe("ConsultationChat interaction callbacks", () => {
    afterEach(() => cleanup())

    it("invokes discovery, keyboard, retry, navigation, attachment and drag handlers", () => {
        Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: vi.fn() })
        render(<ConsultationChat initialConversationId="c1" />)
        fireEvent.click(screen.getByRole("button", { name: "TEDO" }))
        fireEvent.click(screen.getByRole("button", { name: "back" }))
        fireEvent.click(screen.getByRole("button", { name: "Education" }))
        fireEvent.click(screen.getByRole("button", { name: "retrySend" }))
        fireEvent.click(screen.getByRole("button", { name: "optionalFollowUp" }))
        fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", shiftKey: false })
        const form = document.querySelector("form")
        expect(form).toBeTruthy()
        fireEvent.dragOver(form as HTMLFormElement)
        const files = [new File(["hello"], "brief.txt", { type: "text/plain" })]
        const inputs = document.querySelectorAll("input[type='file']")
        if (inputs[0] === undefined || inputs[1] === undefined) throw new Error("expected attachment inputs")
        fireEvent.change(inputs[0], { target: { files } })
        fireEvent.change(inputs[1], { target: { files } })
        fireEvent.drop(form as HTMLFormElement, { dataTransfer: { files } })
        const remove = screen.queryAllByRole("button", { name: /removeAttachment/ })[0]
        if (remove) fireEvent.click(remove)
        fireEvent.click(screen.getByRole("button", { name: "addImage" }))
        fireEvent.click(screen.getByRole("button", { name: "addFile" }))
        expect(sendMessage.mock.calls.length).toBeGreaterThan(0)
    })

    it("renders loading, user-message, and sending branches", () => {
        const original = { ...chat }
        Object.assign(chat, {
            messages: [{ id: "user-1", role: "user", content: "Question", attachments: [] }],
            isLoading: true,
            isSending: true,
            error: undefined,
            failedMessage: undefined,
            discovery: undefined,
        })
        render(<ConsultationChat initialConversationId="c1" />)
        expect(screen.getByText("thinking")).toBeTruthy()
        Object.assign(chat, original)
    })
})
