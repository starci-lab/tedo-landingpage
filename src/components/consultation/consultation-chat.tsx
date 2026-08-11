"use client"

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useConsultationChat } from "@/hooks/useConsultationChat"
import { useConsultationComposerForm } from "@/hooks/rhf/useConsultationComposerForm"
import type { DiscoveryQuestion } from "@/lib/consultation/types"
import { Wordmark } from "@/components/wordmark"
import { ConsultationLeadForm } from "./consultation-lead-form"
import { ProposalActions } from "./proposal-actions"
import { AssistantMarkdown } from "./assistant-markdown"
import { MessageAttachments } from "./message-attachments"
import { UserMessageContent } from "./user-message-content"

const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024
const ACCEPTED_FILES = "image/jpeg,image/png,image/webp,image/gif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv,text/markdown,application/json"
const ACCEPTED_MIME_TYPES = new Set(ACCEPTED_FILES.split(","))

const readString = (record: Record<string, unknown>, key: string): string | undefined =>
    typeof record[key] === "string" ? record[key] : undefined

/** Full-page consultation workspace with durable history, discovery progress, and handoff. */
export function ConsultationChat({ initialConversationId }: { initialConversationId?: string }) {
    const t = useTranslations("consultation")
    const locale = useLocale()
    const chat = useConsultationChat(initialConversationId)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [attachmentError, setAttachmentError] = useState<string>()
    const sendWithAttachments = useCallback(async (message: string): Promise<boolean> => {
        const sent = await chat.sendMessage(message, selectedFiles)
        if (sent) setSelectedFiles([])
        return sent
    }, [chat, selectedFiles])
    const composer = useConsultationComposerForm(sendWithAttachments)
    const [showLeadForm, setShowLeadForm] = useState(false)
    const messagesRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLDivElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }) }, [chat.messages, chat.isSending])
    useEffect(() => {
        const messages = messagesRef.current
        if (!messages || !chat.streamingMessageId) return
        const observer = new ResizeObserver(() => endRef.current?.scrollIntoView({ block: "nearest" }))
        observer.observe(messages)
        return () => observer.disconnect()
    }, [chat.streamingMessageId])
    const answerQuestion = (question: DiscoveryQuestion, label: string): void => {
        void chat.sendMessage(`${question.label}: ${label}`)
    }
    const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            void composer.onSubmit()
        }
    }
    const price = chat.quote?.totalVnd ?? chat.quote?.rangeMinVnd
    const addFiles = (incoming: File[]): void => {
        if (selectedFiles.length + incoming.length > MAX_FILES
            || incoming.some((file) => file.size > MAX_FILE_BYTES || !ACCEPTED_MIME_TYPES.has(file.type))) {
            setAttachmentError(t("attachmentError"))
            return
        }
        setAttachmentError(undefined)
        setSelectedFiles((current) => [...current, ...incoming])
    }
    const selectFiles = (event: ChangeEvent<HTMLInputElement>): void => {
        addFiles(Array.from(event.target.files ?? []))
        event.target.value = ""
    }
    const dropFiles = (event: DragEvent<HTMLFormElement>): void => {
        event.preventDefault()
        addFiles(Array.from(event.dataTransfer.files))
    }
    return (
        <div className="relative min-h-screen bg-surface-2">
            <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                    <Link href="/" aria-label="TEDO"><Wordmark /></Link>
                    <Link href="/" className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted transition-colors hover:text-brand">{t("back")}</Link>
                </div>
            </header>
            <main className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:py-12">
                <section className="min-w-0" aria-labelledby="consultation-title">
                    <h1 id="consultation-title" className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t("title")}</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">{t("subtitle")}</p>
                    <div ref={messagesRef} className="mt-8 grid gap-4" aria-live="polite">
                        {chat.isLoading ? <ChatSkeleton /> : null}
                        {!chat.isLoading && chat.messages.length === 0 ? <div className="rounded-2xl border border-line bg-white p-5 text-ink"><p>{t("greeting")}</p></div> : null}
                        {chat.messages.map((message) => (
                            <div key={message.id} className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-base ${message.role === "user" ? "justify-self-end whitespace-pre-wrap bg-ink text-white" : "justify-self-start border border-line bg-white text-ink sm:px-5 sm:py-4"}`}>
                                <MessageAttachments attachments={message.attachments} conversationId={chat.conversationId} />
                                {message.role === "assistant"
                                    ? <AssistantMarkdown content={message.content} animate={message.id === chat.streamingMessageId} />
                                    : <UserMessageContent content={message.content} />}
                            </div>
                        ))}
                        {chat.isSending ? <div className="w-fit rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink-muted">{t("thinking")}</div> : null}
                        {chat.error ? <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"><span>{chat.error}</span>{chat.failedMessage ? <button type="button" onClick={() => void chat.sendMessage(chat.failedMessage ?? "")} className="min-h-11 rounded-lg border border-red-300 bg-white px-3 font-medium">{t("retrySend")}</button> : null}</div> : null}
                        {!chat.isSending && chat.discovery?.nextQuestions.map((question) => question.options?.length ? (
                            <div key={question.id} className="rounded-2xl border border-line bg-white p-4">
                                <p className="text-sm font-medium text-ink">{question.label}</p>
                                <div className="mt-3 flex flex-wrap gap-2">{question.options.map((option) => <button key={option.value} type="button" onClick={() => answerQuestion(question, option.label)} className="min-h-11 cursor-pointer rounded-xl border border-line-strong px-3 text-sm text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">{option.label}</button>)}</div>
                            </div>
                        ) : null)}
                        <div ref={endRef} />
                    </div>
                    <form onSubmit={composer.onSubmit} onDragOver={(event) => event.preventDefault()} onDrop={dropFiles} className="sticky bottom-3 mt-6 rounded-2xl border border-line bg-white p-2 shadow-[0_20px_55px_-32px_rgba(20,48,92,0.6)]">
                        {selectedFiles.length ? <div className="mb-2 flex flex-wrap gap-2 px-1" aria-label={t("selectedAttachments")}>
                            {selectedFiles.map((file, index) => <span key={`${file.name}-${file.lastModified}-${index}`} className="inline-flex max-w-full items-center gap-2 rounded-lg bg-brand-soft px-2 py-1 text-xs text-brand-deep"><span className="max-w-48 truncate">{file.name}</span><button type="button" onClick={() => setSelectedFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="cursor-pointer rounded p-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" aria-label={`${t("removeAttachment")} ${file.name}`}>×</button></span>)}
                        </div> : null}
                        {attachmentError ? <p role="alert" className="mb-2 px-2 text-xs text-red-700">{attachmentError}</p> : null}
                        <label htmlFor="consultation-message" className="sr-only">{t("composerLabel")}</label>
                        <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={selectFiles} className="sr-only" />
                        <input ref={fileInputRef} type="file" accept={ACCEPTED_FILES} multiple onChange={selectFiles} className="sr-only" />
                        <div className="flex items-end gap-2">
                            <div className="flex shrink-0 gap-1 pb-1"><button type="button" onClick={() => imageInputRef.current?.click()} className="grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-xl text-ink-muted transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" aria-label={t("addImage")}><svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 2-2 5 4"/></svg></button><button type="button" onClick={() => fileInputRef.current?.click()} className="grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-xl text-ink-muted transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" aria-label={t("addFile")}><svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><path d="m9 12 5-5a3 3 0 0 1 4 4l-7 7a5 5 0 0 1-7-7l7-7"/></svg></button></div>
                            <textarea id="consultation-message" rows={2} {...composer.register("message")} onKeyDown={onComposerKeyDown} placeholder={t("composerPlaceholder")} className="max-h-40 min-h-14 flex-1 resize-none rounded-xl bg-surface-2 px-3 py-3 text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand" /><button type="submit" disabled={chat.isSending || (!composer.watch("message").trim() && selectedFiles.length === 0)} className="min-h-12 cursor-pointer rounded-xl bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-50">{t("send")}</button>
                        </div>
                    </form>
                </section>
                <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label={t("projectProfile")}>
                    <div className="rounded-2xl border border-line bg-white p-5">
                        <div className="flex items-end justify-between"><h2 className="font-display font-semibold text-ink">{t("projectProfile")}</h2><span className="font-mono text-sm text-brand">{chat.discovery?.completeness ?? 0}%</span></div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-soft"><div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${chat.discovery?.completeness ?? 0}%` }} /></div>
                        <dl className="mt-5 grid gap-3 text-sm"><div><dt className="text-ink-faint">{t("productType")}</dt><dd className="mt-0.5 text-ink">{readString(chat.requirements, "productType") ?? t("unknown")}</dd></div><div><dt className="text-ink-faint">{t("industry")}</dt><dd className="mt-0.5 text-ink">{readString(chat.requirements, "industry") ?? t("unknown")}</dd></div></dl>
                        {price ? <div className="mt-5 border-t border-line pt-4"><p className="text-xs text-ink-faint">{t("currentEstimate")}</p><p className="mt-1 font-display text-xl font-bold text-brand-deep">{new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(price)} VND</p></div> : null}
                    </div>
                    {chat.discovery?.readyForProposal && chat.projectId ? <ProposalActions projectId={chat.projectId} /> : null}
                    {chat.conversationId ? showLeadForm ? <ConsultationLeadForm conversationId={chat.conversationId} /> : <button type="button" onClick={() => setShowLeadForm(true)} className="min-h-12 w-full cursor-pointer rounded-xl border border-line-strong bg-white px-4 text-sm font-medium text-ink-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">{t("optionalFollowUp")}</button> : null}
                </aside>
            </main>
        </div>
    )
}

function ChatSkeleton() {
    return <div className="grid animate-pulse gap-4" aria-hidden><div className="h-16 w-3/4 rounded-2xl bg-brand-soft" /><div className="ml-auto h-14 w-2/3 rounded-2xl bg-line" /></div>
}
