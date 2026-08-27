// @vitest-environment jsdom
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/i18n/routing", () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }))

import { useConsultationChat } from "./useConsultationChat"

type Snapshot = {
    readonly conversationId?: string
    readonly messages: ReadonlyArray<{ readonly role: string; readonly content: string }>
    readonly sessions: ReadonlyArray<{ readonly id: string; readonly conversationId?: string }>
    readonly error?: string
    readonly failedMessage?: string
}
let snapshot: Snapshot = { messages: [], sessions: [] }
let send: ((message: string) => Promise<boolean>) | undefined

const Probe = () => {
    const chat = useConsultationChat()
    snapshot = {
        conversationId: chat.conversationId,
        messages: chat.messages,
        sessions: chat.sessions,
        error: chat.error,
        failedMessage: chat.failedMessage,
    }
    send = chat.sendMessage
    return <output>{snapshot.messages.length}</output>
}

describe("useConsultationChat", () => {
    let root: Root | undefined
    beforeAll(() => { (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true })
    afterAll(() => { delete (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT })
    beforeEach(() => {
        const values = new Map<string, string>()
        const storage: Storage = {
            get length() { return values.size },
            clear: () => values.clear(),
            getItem: (key) => values.get(key) ?? null,
            key: (index) => [...values.keys()][index] ?? null,
            removeItem: (key) => { values.delete(key) },
            setItem: (key, value) => { values.set(key, value) },
        }
        Object.defineProperty(window, "localStorage", { configurable: true, value: storage })
    })
    afterEach(() => { act(() => root?.unmount()); vi.restoreAllMocks(); window.sessionStorage.clear(); window.localStorage.clear() })

    it("optimistically sends a message and settles the assistant turn", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ conversationId: "c1", projectId: "p1", requirementsVersion: 1, userMessageId: "u1", assistantMessageId: "a1", answer: "Hello", commercialQuote: {}, handoffRequired: false, attachments: [], requirements: {}, discovery: { completeness: 10, missingFields: [], nextQuestions: [], readyForProposal: false } }), { status: 200 }))
        const host = document.createElement("div")
        root = createRoot(host)
        await act(async () => { root?.render(<Probe />) })
        await act(async () => { await send?.("  Hello  ") })
        expect(fetchMock).toHaveBeenCalledWith("/api/consultations/messages", expect.objectContaining({ method: "POST" }))
        expect(snapshot.messages.map((message) => message.role)).toEqual(["user", "assistant"])
        expect(snapshot.messages[1]?.content).toBe("Hello")
        expect(snapshot.conversationId).toBe("c1")
        expect(snapshot.sessions).toEqual([expect.objectContaining({ id: "c1", conversationId: "c1" })])
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

    it("creates a browser session as soon as the consultation opens", async () => {
        const host = document.createElement("div")
        root = createRoot(host)
        await act(async () => { root?.render(<Probe />) })

        expect(snapshot.sessions).toHaveLength(1)
        expect(snapshot.sessions[0]?.id).toMatch(/^draft-/)
        expect(window.localStorage.getItem("tedo:consultation-history:v1")).toContain(snapshot.sessions[0]?.id)
    })
})
