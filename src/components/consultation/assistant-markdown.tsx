"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import type { Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection } from "@/components/contracts/props"
import { Heading } from "@/components/leaves/Heading"

const STREAM_INTERVAL_MS = 18
const CHARACTERS_PER_TICK = 6

const markdownComponents: Components = {
    h1: (p) => <Heading props={{ content: markdownText(p.children), level: 2 }} />,
    h2: (p) => <Heading props={{ content: markdownText(p.children), level: 3 }} />,
    h3: (p) => <Heading props={{ content: markdownText(p.children), level: 4 }} />,
    p: (p) => <p className="my-2 first:mt-0 last:mb-0">{p.children}</p>,
    ul: (p) => (
        <Tree
            contract="markdown-unordered-list"
            render={defineContractComponent("markdown-unordered-list", {
                content: defineContractProjection("opaque-content-unit", () => p.children),
            })}
        />
    ),
    ol: (p) => (
        <Tree
            contract="markdown-ordered-list"
            render={defineContractComponent("markdown-ordered-list", {
                content: defineContractProjection("opaque-content-unit", () => p.children),
            })}
        />
    ),
    li: (p) => <li>{p.children}</li>,
    strong: (p) => <strong className="font-semibold text-brand-deep">{p.children}</strong>,
    blockquote: (p) => (
        <blockquote className="my-3 border-l-3 border-brand pl-3 text-ink-muted">{p.children}</blockquote>
    ),
    table: (p) => <table className="my-4 w-full min-w-markdown-table border-collapse text-left text-xs sm:text-sm">{p.children}</table>,
    th: (p) => <th className="border border-line bg-brand-soft px-3 py-2 font-semibold text-brand-deep">{p.children}</th>,
    td: (p) => <td className="border border-line px-3 py-2 align-top">{p.children}</td>,
    a: (p) => (
        <a href={p.href} target="_blank" rel="noreferrer" className="font-medium text-brand underline decoration-brand/35 underline-offset-3 hover:text-brand-deep">
            {p.children}
        </a>
    ),
    code: (p) => <code className="rounded bg-surface-2 px-1 py-1 font-mono text-[0.9em]">{p.children}</code>,
    hr: () => <hr className="my-5 border-line" />,
}

interface AssistantMarkdownProps {
    content: string
    animate?: boolean
}

/** Safely renders assistant Markdown and progressively reveals the newest response. */
export const AssistantMarkdown = ({ content, animate = false }: AssistantMarkdownProps) => {
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
        <Tree
            contract="markdown-body-shell"
            render={defineContractComponent("markdown-body-shell", {
                content: defineContractProjection("opaque-content-unit", () => (
                    // A `<span>`, not a `<div>`: this node exists only to carry `aria-hidden` while the
                    // reply is still streaming, and every neutral host is refused outside `Tree` -
                    // see `no-structural-host-outside-contract-frame`. It carries no class of its own.
                    <span aria-hidden={shouldAnimate ? true : undefined}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                        >
                            {visibleContent}
                        </ReactMarkdown>
                        {isStreaming ? <span aria-hidden className="ml-1 inline-block h-4 w-1 animate-pulse bg-brand align-middle" /> : null}
                        {shouldAnimate ? <span className="sr-only">{content}</span> : null}
                    </span>
                )),
            })}
        />
    )
}

/** Flattens react-markdown's already-built heading children back to plain text for the Heading leaf. */
const markdownText = (node: ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") return String(node)
    if (Array.isArray(node)) return node.map(markdownText).join("")
    if (node && typeof node === "object" && "props" in node) {
        const props = (node as { props?: Record<string, unknown> }).props
        const nested = props?.["children"]
        return nested ? markdownText(nested as ReactNode) : ""
    }
    return ""
}
