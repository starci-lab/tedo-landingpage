"use client"

import React, { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const STREAM_INTERVAL_MS = 18
const CHARACTERS_PER_TICK = 6

interface AssistantMarkdownProps {
    content: string
    animate?: boolean
}

/** Safely renders assistant Markdown and progressively reveals the newest response. */
export function AssistantMarkdown({ content, animate = false }: AssistantMarkdownProps) {
    const reduceMotion = useReducedMotion()
    const shouldAnimate = animate && !reduceMotion
    const [visibleLength, setVisibleLength] = useState(shouldAnimate ? 0 : content.length)

    useEffect(() => {
        if (!shouldAnimate) {
            setVisibleLength(content.length)
            return
        }

        setVisibleLength(0)
        const timer = window.setInterval(() => {
            setVisibleLength((current) => {
                const next = Math.min(content.length, current + CHARACTERS_PER_TICK)
                if (next === content.length) window.clearInterval(timer)
                return next
            })
        }, STREAM_INTERVAL_MS)
        return () => window.clearInterval(timer)
    }, [content, shouldAnimate])

    const isStreaming = visibleLength < content.length
    const visibleContent = content.slice(0, visibleLength)

    return (
        <div className="min-w-0 overflow-x-auto">
            <div aria-hidden={shouldAnimate ? true : undefined}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => <h2 className="mb-3 mt-1 font-display text-xl font-bold text-brand-deep sm:text-2xl">{children}</h2>,
                        h2: ({ children }) => <h3 className="mb-2 mt-5 font-display text-lg font-bold text-brand-deep first:mt-0">{children}</h3>,
                        h3: ({ children }) => <h4 className="mb-2 mt-4 font-display font-semibold text-ink">{children}</h4>,
                        p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-5 marker:text-brand">{children}</ul>,
                        ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-5 marker:font-semibold marker:text-brand">{children}</ol>,
                        strong: ({ children }) => <strong className="font-semibold text-brand-deep">{children}</strong>,
                        blockquote: ({ children }) => <blockquote className="my-3 border-l-3 border-brand pl-3 text-ink-muted">{children}</blockquote>,
                        table: ({ children }) => <table className="my-4 w-full min-w-[34rem] border-collapse text-left text-xs sm:text-sm">{children}</table>,
                        th: ({ children }) => <th className="border border-line bg-brand-soft px-3 py-2 font-semibold text-brand-deep">{children}</th>,
                        td: ({ children }) => <td className="border border-line px-3 py-2 align-top">{children}</td>,
                        a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" className="font-medium text-brand underline decoration-brand/35 underline-offset-3 hover:text-brand-deep">{children}</a>,
                        code: ({ children }) => <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.9em]">{children}</code>,
                        hr: () => <hr className="my-5 border-line" />,
                    }}
                >
                    {visibleContent}
                </ReactMarkdown>
                {isStreaming ? <span aria-hidden className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-brand align-middle" /> : null}
            </div>
            {shouldAnimate ? <span className="sr-only">{content}</span> : null}
        </div>
    )
}
