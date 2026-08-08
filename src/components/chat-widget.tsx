"use client"

import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
} from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

type Msg = { role: "user" | "assistant"; content: string }

/**
 * Opens the quote chat from anywhere on the page. No-op during server render.
 *
 * The event name is written out at both ends rather than shared through a module
 * constant: a `"use client"` module that exports plain values as well as
 * components hands the bundler an extra binding to resolve across the
 * server/client boundary, and it fell over at runtime here while type-checking
 * clean. One short string in two places is the cheaper trade.
 */
export function openQuoteChat() {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("tedo:open-chat"))
}

export function ChatWidget() {
    const t = useTranslations("chat")
    const suggestions = t.raw("suggestions") as Array<string>

    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Array<Msg>>([
        { role: "assistant", content: t("greeting") },
    ])
    const [input, setInput] = useState("")
    const [busy, setBusy] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [messages, open])

    /**
     * Lets any CTA on the page open the quote chat — the sticky bar and the hero
     * button both fire `tedo:open-chat`. A window event rather than lifted state
     * because the widget is mounted once in the layout while the callers are
     * scattered across server-rendered sections; threading a setter through them
     * would force the whole tree client-side for one boolean.
     */
    useEffect(() => {
        const openChat = () => setOpen(true)
        window.addEventListener("tedo:open-chat", openChat)
        return () => window.removeEventListener("tedo:open-chat", openChat)
    }, [])

    async function send(text: string) {
        const content = text.trim()
        if (!content || busy) return
        setInput("")

        // Real turns only (drop the UI greeting) for the model.
        const history = messages.filter((_, i) => i > 0)
        const next: Array<Msg> = [...messages, { role: "user", content }]
        setMessages([...next, { role: "assistant", content: "" }])
        setBusy(true)

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    messages: [...history, { role: "user", content }],
                }),
            })

            if (res.status === 503) {
                replaceLast(t("notConfigured"))
                return
            }
            if (!res.ok || !res.body) {
                replaceLast(t("error"))
                return
            }

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let acc = ""
            for (;;) {
                const { done, value } = await reader.read()
                if (done) break
                acc += decoder.decode(value, { stream: true })
                replaceLast(acc)
            }
            if (!acc) replaceLast(t("error"))
        } catch {
            replaceLast(t("error"))
        } finally {
            setBusy(false)
        }
    }

    function replaceLast(content: string) {
        setMessages((prev) => {
            const copy = [...prev]
            copy[copy.length - 1] = { role: "assistant", content }
            return copy
        })
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault()
        void send(input)
    }
    function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            void send(input)
        }
    }

    const showSuggestions = messages.length === 1 && !busy

    return (
        <>
            {/* launcher */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={t("open")}
                aria-expanded={open}
                className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_12px_30px_-8px_rgba(27,123,201,0.7)] transition-transform hover:scale-105 active:scale-95"
            >
                {open ? <IconClose /> : <IconChat />}
            </button>

            {/* panel */}
            {open && (
                <div className="fixed bottom-24 right-5 z-[60] flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_40px_80px_-30px_rgba(20,48,92,0.55)]">
                    {/* header */}
                    <div className="flex items-center gap-3 bg-brand px-4 py-3.5 text-white">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green/70" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
                        </span>
                        <div className="min-w-0">
                            <p className="font-display text-sm font-bold leading-none">{t("title")}</p>
                            <p className="mt-1 text-[11px] text-white/70">{t("status")}</p>
                        </div>
                    </div>

                    {/* messages */}
                    <div ref={scrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-surface-2 p-3.5">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                                    m.role === "user"
                                        ? "self-end rounded-br-md bg-brand text-white"
                                        : "self-start rounded-bl-md border border-line bg-white text-ink"
                                }`}
                            >
                                {m.content || <TypingDots />}
                            </div>
                        ))}

                        {showSuggestions && (
                            <div className="mt-1 flex flex-col items-start gap-2">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => void send(s)}
                                        className="rounded-full border border-brand/40 bg-white px-3 py-1.5 text-left text-[13px] text-brand transition-colors hover:bg-brand-soft"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* footer: book CTA + disclaimer */}
                    <div className="border-t border-line bg-white px-3.5 pt-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <Link
                                href="/#contact"
                                onClick={() => setOpen(false)}
                                className="text-xs font-semibold text-accent hover:text-accent-dim"
                            >
                                {t("book")} →
                            </Link>
                            <span className="text-[10px] text-ink-faint">{t("disclaimer")}</span>
                        </div>

                        <form onSubmit={onSubmit} className="flex items-end gap-2 py-2.5">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={onKey}
                                rows={1}
                                placeholder={t("placeholder")}
                                className="max-h-24 flex-1 resize-none rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand"
                            />
                            <button
                                type="submit"
                                disabled={busy || !input.trim()}
                                aria-label={t("send")}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-colors hover:bg-accent-dim disabled:opacity-40"
                            >
                                <IconSend />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

function TypingDots() {
    return (
        <span className="inline-flex gap-1 py-1">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </span>
    )
}

function IconChat() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
        </svg>
    )
}
function IconClose() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    )
}
function IconSend() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    )
}
