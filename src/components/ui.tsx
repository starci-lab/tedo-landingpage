"use client"

import type { ReactNode } from "react"
import { Link } from "@heroui/react"

export function Container({
    children,
    className = "",
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
            {children}
        </div>
    )
}

export function Section({
    id,
    children,
    className = "",
}: {
    id?: string
    children: ReactNode
    className?: string
}) {
    return (
        <section
            id={id}
            className={`scroll-mt-20 py-20 sm:py-28 ${className}`}
        >
            <Container>{children}</Container>
        </section>
    )
}

/** Small uppercase label with a lead rule — the deck's section-marker device. */
export function Eyebrow({
    children,
    onDark = false,
}: {
    children: ReactNode
    onDark?: boolean
}) {
    return (
        <p
            className={`mb-4 flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.16em] ${
                onDark ? "text-accent" : "text-brand"
            }`}
        >
            <span
                aria-hidden
                className={`h-px w-6 ${onDark ? "bg-accent" : "bg-brand"}`}
            />
            {children}
        </p>
    )
}

export function SectionTitle({
    children,
    onDark = false,
}: {
    children: ReactNode
    onDark?: boolean
}) {
    return (
        <h2
            className={`max-w-3xl text-balance font-display text-3xl font-bold leading-[1.12] tracking-tight sm:text-[2.6rem] ${
                onDark ? "text-white" : "text-ink"
            }`}
        >
            {children}
        </h2>
    )
}

export function SectionLead({
    children,
    onDark = false,
}: {
    children: ReactNode
    onDark?: boolean
}) {
    return (
        <p
            className={`mt-4 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg ${
                onDark ? "text-slate-300" : "text-ink-muted"
            }`}
        >
            {children}
        </p>
    )
}

const CTA_BASE =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:translate-y-px"

const CTA_SIZE = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
} as const

const CTA_VARIANT = {
    /** Orange Saturn-ring accent — the single loud call to action. */
    primary:
        "bg-accent text-accent-ink shadow-[0_6px_18px_-6px_rgba(245,130,32,0.6)] hover:bg-accent-dim",
    /** Brand-blue solid — used on dark bands where orange would over-shout. */
    brand: "bg-brand text-white hover:bg-brand-bright",
    /** Quiet bordered link for the secondary path. */
    outline:
        "border border-line-strong bg-white/60 text-ink hover:border-brand hover:text-brand",
    /** Bordered for dark grounds. */
    outlineDark:
        "border border-white/25 text-white hover:border-white/60 hover:bg-white/5",
    /** Quiet text link — no fill, no border. */
    ghost: "text-ink hover:text-brand",
} as const

/**
 * A link that reads as a button. HeroUI's `Button` renders a real <button>
 * (React Aria), so navigation targets have to borrow the styling instead of
 * using the component — otherwise CTAs lose href, middle-click and SEO.
 */
export function CtaLink({
    href,
    children,
    variant = "primary",
    size = "lg",
    external,
    className = "",
}: {
    href: string
    children: ReactNode
    variant?: keyof typeof CTA_VARIANT
    size?: keyof typeof CTA_SIZE
    external?: boolean
    className?: string
}) {
    return (
        <Link
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className={`${CTA_BASE} ${CTA_SIZE[size]} ${CTA_VARIANT[variant]} ${className}`}
        >
            {children}
        </Link>
    )
}
