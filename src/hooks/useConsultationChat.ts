"use client"

import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "@/i18n/routing"
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
    sendMessage: (message: string) => Promise<boolean>
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
    const initialPromptSent = useRef(false)
    const sendingRef = useRef(false)

    const sendMessage = useCallback(async (rawMessage: string): Promise<boolean> => {
        const message = rawMessage.trim()
        if (!message || sendingRef.current) return false
        sendingRef.current = true
        setError(undefined)
        setFailedMessage(undefined)
        setStreamingMessageId(undefined)
        setIsSending(true)
        const optimisticId = `local-${Date.now()}`
        setMessages((current) => [...current, { id: optimisticId, role: "user", content: message }])
        try {
            const response = await fetch("/api/consultations/messages", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ message, conversationId }),
            })
            const payload: unknown = await response.json().catch(() => null)
            if (!response.ok || !isConsultationTurnResponse(payload)) throw new Error("invalid-response")
            setMessages((current) => [
                ...current.map((item) => item.id === optimisticId ? { ...item, id: payload.userMessageId } : item),
                { id: payload.assistantMessageId, role: "assistant", content: payload.answer },
            ])
            setStreamingMessageId(payload.assistantMessageId)
            setDiscovery(payload.discovery)
            setProjectId(payload.projectId)
            setQuote(payload.commercialQuote)
            setRequirements(payload.requirements)
            window.sessionStorage.removeItem("tedo:initial-consultation-prompt")
            if (!conversationId) {
                setConversationId(payload.conversationId)
                router.replace(`/chat/${payload.conversationId}`)
            }
            return true
        } catch {
            setMessages((current) => current.filter((item) => item.id !== optimisticId))
            setFailedMessage(message)
            if (!conversationId) window.sessionStorage.setItem("tedo:initial-consultation-prompt", message)
            setError(t("sendError"))
            return false
        } finally {
            sendingRef.current = false
            setIsSending(false)
        }
    }, [conversationId, router, t])

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
                if (!active || !ok || !isConsultationSessionResponse(payload)) throw new Error("invalid-session")
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

    return { conversationId, projectId, messages, discovery, quote, requirements, isLoading, isSending, error, failedMessage, streamingMessageId, sendMessage }
}
