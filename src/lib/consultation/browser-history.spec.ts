// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import {
    BROWSER_CONSULTATION_HISTORY_KEY,
    createBrowserConsultationSession,
    ensureBrowserConsultationSession,
    promoteBrowserConsultationSession,
    readBrowserConsultationHistory,
    saveBrowserConsultationSnapshot,
    writeBrowserConsultationHistory,
} from "./browser-history"

describe("browser consultation history", () => {
    let storage: Storage
    beforeEach(() => {
        const values = new Map<string, string>()
        storage = {
            get length() { return values.size },
            clear: () => values.clear(),
            getItem: (key) => values.get(key) ?? null,
            key: (index) => [...values.keys()][index] ?? null,
            removeItem: (key) => { values.delete(key) },
            setItem: (key, value) => { values.set(key, value) },
        }
    })

    it("creates a draft immediately and promotes it without losing its snapshot", () => {
        const draft = createBrowserConsultationSession(
            { version: 1, sessions: [] },
            "New conversation",
            { id: "draft-1", now: "2026-08-20T00:00:00.000Z" },
        )
        const withMessage = saveBrowserConsultationSnapshot(draft, "draft-1", "New conversation", {
            messages: [{ id: "message-1", role: "user", content: "Build a booking platform" }],
            requirements: { productType: "web" },
        }, "2026-08-20T00:01:00.000Z")
        const promoted = promoteBrowserConsultationSession(withMessage, "draft-1", "conversation-1")

        expect(promoted.activeId).toBe("conversation-1")
        expect(promoted.sessions).toEqual([expect.objectContaining({
            id: "conversation-1",
            conversationId: "conversation-1",
            title: "Build a booking platform",
            requirements: { productType: "web" },
        })])
    })

    it("keeps multiple durable sessions isolated and orders the active snapshot first", () => {
        const first = ensureBrowserConsultationSession(
            { version: 1, sessions: [] }, "conversation-1", "New conversation", "2026-08-20T00:00:00.000Z",
        )
        const second = ensureBrowserConsultationSession(
            first, "conversation-2", "New conversation", "2026-08-20T00:01:00.000Z",
        )
        const updated = saveBrowserConsultationSnapshot(second, "conversation-1", "New conversation", {
            messages: [{ id: "m1", role: "assistant", content: "Saved answer" }],
            requirements: { industry: "education" },
        }, "2026-08-20T00:02:00.000Z")

        expect(updated.sessions.map((session) => session.id)).toEqual(["conversation-1", "conversation-2"])
        expect(updated.sessions[0]?.messages[0]?.content).toBe("Saved answer")
        expect(updated.sessions[1]?.messages).toEqual([])
    })

    it("round-trips valid storage and refuses malformed browser data", () => {
        const history = createBrowserConsultationSession(
            { version: 1, sessions: [] }, "New conversation", { id: "draft-1" },
        )
        writeBrowserConsultationHistory(storage, history)
        expect(readBrowserConsultationHistory(storage).activeId).toBe("draft-1")

        storage.setItem(BROWSER_CONSULTATION_HISTORY_KEY, "{broken")
        expect(readBrowserConsultationHistory(storage)).toEqual({ version: 1, sessions: [] })
    })
})
