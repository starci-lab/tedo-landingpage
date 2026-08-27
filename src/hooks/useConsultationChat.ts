"use client"

import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "@/i18n/routing"
import {
    activateBrowserConsultationSession,
    createBrowserConsultationSession,
    ensureBrowserConsultationSession,
    promoteBrowserConsultationSession,
    readBrowserConsultationHistory,
    saveBrowserConsultationSnapshot,
    writeBrowserConsultationHistory,
    type BrowserConsultationHistory,
    type BrowserConsultationSession,
} from "@/lib/consultation/browser-history"
import {
    isConsultationSessionResponse, isConsultationTurnResponse,
    type CommercialQuote, type ConsultationMessage, type DiscoveryState,
} from "@/lib/consultation/types"

interface UseConsultationChatResult {
    conversationId?: string
    projectId?: string
    messages: ConsultationMessage[]
    discovery?: DiscoveryState
    quote?: CommercialQuote
    requirements: Record<string, unknown>
    isLoading: boolean
    isSending: boolean
    error?: string
    failedMessage?: string
    streamingMessageId?: string
    sessions: BrowserConsultationSession[]
    activeSessionId?: string
    sendMessage: (message: string, files?: File[]) => Promise<boolean>
    startNewChat: () => void
    openChat: (sessionId: string) => void
}

/** Runs durable consultation turns and resumes prior history from a conversation URL. */
export const useConsultationChat = (initialConversationId?: string): UseConsultationChatResult => {
    const t = useTranslations("consultation")
    const router = useRouter()
    const [conversationId, setConversationId] = useState(initialConversationId)
    const [projectId, setProjectId] = useState<string>()
    const [messages, setMessages] = useState<ConsultationMessage[]>([])
    const [discovery, setDiscovery] = useState<DiscoveryState>()
    const [quote, setQuote] = useState<CommercialQuote>()
    const [requirements, setRequirements] = useState<Record<string, unknown>>({})
    const [isLoading, setIsLoading] = useState(Boolean(initialConversationId))
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState<string>()
    const [failedMessage, setFailedMessage] = useState<string>()
    const [streamingMessageId, setStreamingMessageId] = useState<string>()
    const [sessions, setSessions] = useState<BrowserConsultationSession[]>([])
    const [activeSessionId, setActiveSessionId] = useState<string>()
    const [historyReady, setHistoryReady] = useState(false)
    const initialPromptSent = useRef(false)
    const sendingRef = useRef(false)
    const initializedRoute = useRef<string | undefined>(undefined)
    const historyRef = useRef<BrowserConsultationHistory>({ version: 1, sessions: [] })
    const newConversationTitle = t("newConversation")

    const commitHistory = useCallback((history: BrowserConsultationHistory): void => {
        historyRef.current = history
        writeBrowserConsultationHistory(window.localStorage, history)
        setSessions(history.sessions)
        setActiveSessionId(history.activeId)
    }, [])

    const sendMessage = useCallback(async (rawMessage: string, files: File[] = []): Promise<boolean> => {
        const message = rawMessage.trim()
        if ((!message && files.length === 0) || sendingRef.current) return false
        sendingRef.current = true
        setError(undefined)
        setFailedMessage(undefined)
        setStreamingMessageId(undefined)
        setIsSending(true)
        let localSessionId = activeSessionId ?? historyRef.current.activeId
        if (!localSessionId) {
            const created = createBrowserConsultationSession(historyRef.current, newConversationTitle)
            commitHistory(created)
            localSessionId = created.activeId
        }
        const optimisticId = `local-${Date.now()}`
        const optimisticAttachments = files.map((file, index) => ({
            id: `${optimisticId}-${index}`, fileName: file.name, mimeType: file.type,
            size: file.size, kind: file.type.startsWith("image/") ? "image" as const : "file" as const,
            previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        }))
        setMessages((current) => [...current, {
            id: optimisticId, role: "user", content: message, attachments: optimisticAttachments,
        }])
        try {
            const form = new FormData()
            form.set("message", message)
            if (conversationId) form.set("conversationId", conversationId)
            files.forEach((file) => form.append("files", file))
            const response = await fetch("/api/consultations/messages", {
                method: "POST",
                body: form,
            })
            const payload: unknown = await response.json().catch(() => null)
            if (!response.ok || !isConsultationTurnResponse(payload)) throw new Error("invalid-response")
            setMessages((current) => [
                ...current.map((item) => item.id === optimisticId ? {
                    ...item, id: payload.userMessageId, content: message, attachments: payload.attachments,
                } : item),
                { id: payload.assistantMessageId, role: "assistant", content: payload.answer },
            ])
            optimisticAttachments.forEach((attachment) => {
                if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
            })
            setStreamingMessageId(payload.assistantMessageId)
            setDiscovery(payload.discovery)
            setProjectId(payload.projectId)
            setQuote(payload.commercialQuote)
            setRequirements(payload.requirements)
            window.sessionStorage.removeItem("tedo:initial-consultation-prompt")
            if (!conversationId) {
                if (localSessionId) {
                    commitHistory(promoteBrowserConsultationSession(historyRef.current, localSessionId, payload.conversationId))
                }
                setConversationId(payload.conversationId)
                router.replace(`/chat/${payload.conversationId}`)
            }
            return true
        } catch {
            optimisticAttachments.forEach((attachment) => {
                if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
            })
            setMessages((current) => current.filter((item) => item.id !== optimisticId))
            setFailedMessage(message)
            if (!conversationId) window.sessionStorage.setItem("tedo:initial-consultation-prompt", message)
            setError(t("sendError"))
            return false
        } finally {
            sendingRef.current = false
            setIsSending(false)
        }
    }, [activeSessionId, commitHistory, conversationId, newConversationTitle, router, t])

    useEffect(() => {
        const routeKey = initialConversationId ?? "new"
        if (initializedRoute.current === routeKey) return
        initializedRoute.current = routeKey
        let history = readBrowserConsultationHistory(window.localStorage)
        history = initialConversationId
            ? ensureBrowserConsultationSession(history, initialConversationId, newConversationTitle)
            : createBrowserConsultationSession(history, newConversationTitle)
        commitHistory(history)
        const active = history.sessions.find((session) => session.id === history.activeId)
        if (active) {
            setConversationId(active.conversationId)
            setMessages(active.messages)
            setProjectId(active.projectId)
            setDiscovery(active.discovery)
            setQuote(active.quote)
            setRequirements(active.requirements)
        }
        setHistoryReady(true)
    }, [commitHistory, initialConversationId, newConversationTitle])

    useEffect(() => {
        if (!initialConversationId) {
            setIsLoading(false)
            if (initialPromptSent.current) return
            const prompt = window.sessionStorage.getItem("tedo:initial-consultation-prompt")
            if (!prompt) return
            initialPromptSent.current = true
            window.sessionStorage.removeItem("tedo:initial-consultation-prompt")
            void sendMessage(prompt)
            return
        }
        let active = true
        void fetch(`/api/consultations/${initialConversationId}`, { cache: "no-store" })
            .then(async (response) => ({ ok: response.ok, payload: await response.json() as unknown }))
            .then(({ ok, payload }) => {
                if (!active || historyRef.current.activeId !== initialConversationId) return
                if (!ok || !isConsultationSessionResponse(payload)) throw new Error("invalid-session")
                setMessages(payload.messages)
                setStreamingMessageId(undefined)
                setDiscovery(payload.project?.discovery)
                setProjectId(payload.project?.projectId)
                setRequirements(payload.project?.requirements ?? {})
                setQuote([...payload.messages].reverse().find((message) => message.quote)?.quote)
            })
            .catch(() => { if (active) setError(t("loadError")) })
            .finally(() => { if (active) setIsLoading(false) })
        return () => { active = false }
    }, [initialConversationId, sendMessage, t])

    useEffect(() => {
        if (!historyReady || !activeSessionId) return
        commitHistory(saveBrowserConsultationSnapshot(
            historyRef.current,
            activeSessionId,
            newConversationTitle,
            { messages, projectId, discovery, quote, requirements },
        ))
    }, [activeSessionId, commitHistory, discovery, historyReady, messages, newConversationTitle, projectId, quote, requirements])

    const startNewChat = useCallback((): void => {
        const history = createBrowserConsultationSession(historyRef.current, newConversationTitle)
        commitHistory(history)
        setConversationId(undefined)
        setProjectId(undefined)
        setMessages([])
        setDiscovery(undefined)
        setQuote(undefined)
        setRequirements({})
        setError(undefined)
        setFailedMessage(undefined)
        setStreamingMessageId(undefined)
        setIsLoading(false)
        router.replace("/chat")
    }, [commitHistory, newConversationTitle, router])

    const openChat = useCallback((sessionId: string): void => {
        const session = historyRef.current.sessions.find((item) => item.id === sessionId)
        if (!session) return
        commitHistory(activateBrowserConsultationSession(historyRef.current, sessionId))
        setConversationId(session.conversationId)
        setProjectId(session.projectId)
        setMessages(session.messages)
        setDiscovery(session.discovery)
        setQuote(session.quote)
        setRequirements(session.requirements)
        setError(undefined)
        setFailedMessage(undefined)
        setStreamingMessageId(undefined)
        if (session.conversationId) router.push(`/chat/${session.conversationId}`)
        else router.replace("/chat")
    }, [commitHistory, router])

    return {
        conversationId, projectId, messages, discovery, quote, requirements,
        isLoading, isSending, error, failedMessage, streamingMessageId,
        sessions, activeSessionId, sendMessage, startNewChat, openChat,
    }
}
