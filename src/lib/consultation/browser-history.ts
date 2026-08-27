import type { CommercialQuote, ConsultationMessage, DiscoveryState } from "./types"

/** Versioned localStorage slot that owns TEDO's browser-side consultation registry. */
export const BROWSER_CONSULTATION_HISTORY_KEY = "tedo:consultation-history:v1"

const MAX_BROWSER_SESSIONS = 20
const MAX_SESSION_MESSAGES = 100
const TITLE_LENGTH = 64

/** One independently resumable consultation cached by the current browser. */
export interface BrowserConsultationSession {
    id: string
    conversationId?: string
    title: string
    createdAt: string
    updatedAt: string
    messages: ConsultationMessage[]
    projectId?: string
    discovery?: DiscoveryState
    quote?: CommercialQuote
    requirements: Record<string, unknown>
}

/** Bounded registry of consultations and the session currently open in the UI. */
export interface BrowserConsultationHistory {
    version: 1
    activeId?: string
    sessions: BrowserConsultationSession[]
}

/** Chat and project facts copied from the active hook state into browser storage. */
export interface ConsultationSnapshot {
    messages: ConsultationMessage[]
    projectId?: string
    discovery?: DiscoveryState
    quote?: CommercialQuote
    requirements: Record<string, unknown>
}

/** Deterministic overrides used when creating a browser draft or proving it in tests. */
export interface NewBrowserSessionOptions {
    id?: string
    now?: string
}

const emptyHistory = (): BrowserConsultationHistory => ({ version: 1, sessions: [] })

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null

const isStoredSession = (value: unknown): value is BrowserConsultationSession =>
    isRecord(value)
    && typeof value.id === "string"
    && typeof value.title === "string"
    && typeof value.createdAt === "string"
    && typeof value.updatedAt === "string"
    && Array.isArray(value.messages)
    && isRecord(value.requirements)

/** Reads browser-owned consultation history and ignores stale or malformed payloads. */
export const readBrowserConsultationHistory = (storage: Storage): BrowserConsultationHistory => {
    try {
        const raw = storage.getItem(BROWSER_CONSULTATION_HISTORY_KEY)
        if (!raw) return emptyHistory()
        const parsed: unknown = JSON.parse(raw)
        if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.sessions)) return emptyHistory()
        const sessions = parsed.sessions.filter(isStoredSession).slice(0, MAX_BROWSER_SESSIONS)
        const activeId = typeof parsed.activeId === "string" && sessions.some((session) => session.id === parsed.activeId)
            ? parsed.activeId
            : undefined
        return { version: 1, activeId, sessions }
    } catch {
        return emptyHistory()
    }
}

/** Persists a bounded browser history without letting storage quota failures break chat. */
export const writeBrowserConsultationHistory = (storage: Storage, history: BrowserConsultationHistory): void => {
    try {
        storage.setItem(BROWSER_CONSULTATION_HISTORY_KEY, JSON.stringify({
            version: 1,
            activeId: history.activeId,
            sessions: history.sessions.slice(0, MAX_BROWSER_SESSIONS),
        }))
    } catch {
        // The backend remains authoritative when private mode or storage quota rejects this cache.
    }
}

const newDraftId = (): string => `draft-${globalThis.crypto.randomUUID()}`

/** Creates the browser draft that exists before the backend receives its first turn. */
export const createBrowserConsultationSession = (
    history: BrowserConsultationHistory,
    fallbackTitle: string,
    options: NewBrowserSessionOptions = {},
): BrowserConsultationHistory => {
    const now = options.now ?? new Date().toISOString()
    const session: BrowserConsultationSession = {
        id: options.id ?? newDraftId(),
        title: fallbackTitle,
        createdAt: now,
        updatedAt: now,
        messages: [],
        requirements: {},
    }
    return { version: 1, activeId: session.id, sessions: [session, ...history.sessions].slice(0, MAX_BROWSER_SESSIONS) }
}

/** Ensures a consultation opened from a durable URL also appears in this browser's history. */
export const ensureBrowserConsultationSession = (
    history: BrowserConsultationHistory,
    conversationId: string,
    fallbackTitle: string,
    now = new Date().toISOString(),
): BrowserConsultationHistory => {
    const existing = history.sessions.find((session) => session.conversationId === conversationId || session.id === conversationId)
    if (existing) return { ...history, activeId: existing.id }
    const session: BrowserConsultationSession = {
        id: conversationId,
        conversationId,
        title: fallbackTitle,
        createdAt: now,
        updatedAt: now,
        messages: [],
        requirements: {},
    }
    return { version: 1, activeId: session.id, sessions: [session, ...history.sessions].slice(0, MAX_BROWSER_SESSIONS) }
}

/** Replaces a local draft identity with the durable id returned by the first backend turn. */
export const promoteBrowserConsultationSession = (
    history: BrowserConsultationHistory,
    draftId: string,
    conversationId: string,
): BrowserConsultationHistory => {
    const draft = history.sessions.find((session) => session.id === draftId)
    const promoted: BrowserConsultationSession = {
        ...(draft ?? {
            title: conversationId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
            requirements: {},
        }),
        id: conversationId,
        conversationId,
    }
    const sessions = [promoted, ...history.sessions.filter((session) => session.id !== draftId && session.id !== conversationId)]
    return { version: 1, activeId: conversationId, sessions: sessions.slice(0, MAX_BROWSER_SESSIONS) }
}

const persistableMessages = (messages: ConsultationMessage[]): ConsultationMessage[] =>
    messages.slice(-MAX_SESSION_MESSAGES).map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
        quote: message.quote,
        attachments: message.attachments?.map((attachment) => ({
            id: attachment.id,
            fileName: attachment.fileName,
            mimeType: attachment.mimeType,
            size: attachment.size,
            kind: attachment.kind,
        })),
    }))

const titleFromMessages = (messages: ConsultationMessage[], fallbackTitle: string): string => {
    const firstUserMessage = messages.find((message) => message.role === "user")
    const content = firstUserMessage?.content.trim().replace(/\s+/g, " ")
    const title = content || firstUserMessage?.attachments?.[0]?.fileName || fallbackTitle
    return title.slice(0, TITLE_LENGTH)
}

/** Updates one local snapshot while keeping the most recently active conversations first. */
export const saveBrowserConsultationSnapshot = (
    history: BrowserConsultationHistory,
    sessionId: string,
    fallbackTitle: string,
    snapshot: ConsultationSnapshot,
    now = new Date().toISOString(),
): BrowserConsultationHistory => {
    const existing = history.sessions.find((session) => session.id === sessionId)
    if (!existing) return history
    const updated: BrowserConsultationSession = {
        ...existing,
        title: titleFromMessages(snapshot.messages, fallbackTitle),
        updatedAt: now,
        messages: persistableMessages(snapshot.messages),
        projectId: snapshot.projectId,
        discovery: snapshot.discovery,
        quote: snapshot.quote,
        requirements: snapshot.requirements,
    }
    const sessions = [updated, ...history.sessions.filter((session) => session.id !== sessionId)]
    return { version: 1, activeId: sessionId, sessions: sessions.slice(0, MAX_BROWSER_SESSIONS) }
}

/** Marks a stored session active without changing any of its accumulated project facts. */
export const activateBrowserConsultationSession = (
    history: BrowserConsultationHistory,
    sessionId: string,
): BrowserConsultationHistory => history.sessions.some((session) => session.id === sessionId)
    ? { ...history, activeId: sessionId }
    : history
