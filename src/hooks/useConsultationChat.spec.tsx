// @vitest-environment jsdom
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest"

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/routing", () => ({ useRouter: () => ({ replace: vi.fn() }) }))

import { useConsultationChat } from "./useConsultationChat"

type Snapshot = { readonly messages: ReadonlyArray<{ readonly role: string; readonly content: string }>; readonly error?: string; readonly failedMessage?: string }
let snapshot: Snapshot = { messages: [] }
let send: ((message: string) => Promise<boolean>) | undefined

const Probe = () => {
    const chat = useConsultationChat()
    snapshot = { messages: chat.messages, error: chat.error, failedMessage: chat.failedMessage }
    send = chat.sendMessage
    return <output>{snapshot.messages.length}</output>
}

describe("useConsultationChat", () => {
    let root: Root | undefined
    beforeAll(() => { (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true })
    afterAll(() => { delete (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT })
    afterEach(() => { act(() => root?.unmount()); vi.restoreAllMocks(); window.sessionStorage.clear() })

    it("optimistically sends a message and settles the assistant turn", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ conversationId: "c1", projectId: "p1", requirementsVersion: 1, userMessageId: "u1", assistantMessageId: "a1", answer: "Hello", commercialQuote: {}, handoffRequired: false, attachments: [], requirements: {}, discovery: { completeness: 10, missingFields: [], nextQuestions: [], readyForProposal: false } }), { status: 200 }))
        const host = document.createElement("div")
        root = createRoot(host)
        await act(async () => { root?.render(<Probe />) })
        await act(async () => { await send?.("  Hello  ") })
        expect(fetchMock).toHaveBeenCalledWith("/api/consultations/messages", expect.objectContaining({ method: "POST" }))
        expect(snapshot.messages.map((message) => message.role)).toEqual(["user", "assistant"])
        expect(snapshot.messages[1]?.content).toBe("Hello")
    })

    it("removes the optimistic row and stores retry context when sending fails", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"))
        const host = document.createElement("div")
        root = createRoot(host)
        await act(async () => { root?.render(<Probe />) })
        await act(async () => { await send?.("Need help") })
        expect(snapshot.messages).toHaveLength(0)
        expect(snapshot.error).toBe("sendError")
        expect(snapshot.failedMessage).toBe("Need help")
        expect(window.sessionStorage.getItem("tedo:initial-consultation-prompt")).toBe("Need help")
    })
})
