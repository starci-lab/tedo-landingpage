"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useConsultationChat } from "@/hooks/useConsultationChat"
import { useConsultationComposerForm } from "@/hooks/rhf/useConsultationComposerForm"
import type { DiscoveryQuestion } from "@/lib/consultation/types"
import { Wordmark } from "@/components/wordmark"
import { ConsultationLeadForm } from "./consultation-lead-form"
import { ProposalActions } from "./proposal-actions"

const readString = (record: Record<string, unknown>, key: string): string | undefined =>
    typeof record[key] === "string" ? record[key] : undefined

/** Full-page consultation workspace with durable history, discovery progress, and handoff. */
export function ConsultationChat({ initialConversationId }: { initialConversationId?: string }) {
    const t = useTranslations("consultation")
    const locale = useLocale()
    const chat = useConsultationChat(initialConversationId)
    const composer = useConsultationComposerForm(chat.sendMessage)
    const [showLeadForm, setShowLeadForm] = useState(false)
    const endRef = useRef<HTMLDivElement>(null)
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }) }, [chat.messages, chat.isSending])
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
                    <div className="mt-8 grid gap-4" aria-live="polite">
                        {chat.isLoading ? <ChatSkeleton /> : null}
                        {!chat.isLoading && chat.messages.length === 0 ? <div className="rounded-2xl border border-line bg-white p-5 text-ink"><p>{t("greeting")}</p></div> : null}
                        {chat.messages.map((message) => (
                            <div key={message.id} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-base ${message.role === "user" ? "justify-self-end bg-ink text-white" : "justify-self-start border border-line bg-white text-ink"}`}>{message.content}</div>
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
                    <form onSubmit={composer.onSubmit} className="sticky bottom-3 mt-6 rounded-2xl border border-line bg-white p-2 shadow-[0_20px_55px_-32px_rgba(20,48,92,0.6)]">
                        <label htmlFor="consultation-message" className="sr-only">{t("composerLabel")}</label>
                        <div className="flex items-end gap-2"><textarea id="consultation-message" rows={2} {...composer.register("message")} onKeyDown={onComposerKeyDown} placeholder={t("composerPlaceholder")} className="max-h-40 min-h-14 flex-1 resize-none rounded-xl bg-surface-2 px-3 py-3 text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand" /><button type="submit" disabled={chat.isSending} className="min-h-12 cursor-pointer rounded-xl bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-50">{t("send")}</button></div>
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
                    {chat.conversationId ? showLeadForm ? <ConsultationLeadForm conversationId={chat.conversationId} /> : <button type="button" onClick={() => setShowLeadForm(true)} className="min-h-12 w-full cursor-pointer rounded-xl border border-brand bg-white px-4 font-medium text-brand transition-colors hover:bg-brand-soft">{t("humanFollowUp")}</button> : null}
                </aside>
            </main>
        </div>
    )
}

function ChatSkeleton() {
    return <div className="grid animate-pulse gap-4" aria-hidden><div className="h-16 w-3/4 rounded-2xl bg-brand-soft" /><div className="ml-auto h-14 w-2/3 rounded-2xl bg-line" /></div>
}
