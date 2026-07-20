"use client"

import type { ReactNode } from "react"
import { Link, buttonVariants } from "@heroui/react"
import type { ButtonProps } from "@heroui/react"

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
            className={`scroll-mt-20 border-t border-line py-20 sm:py-28 ${className}`}
        >
            <Container>{children}</Container>
        </section>
    )
}

export function Eyebrow({ children }: { children: ReactNode }) {
    return (
        <p className="mb-4 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-accent">
            <span aria-hidden className="h-px w-6 bg-accent-dim" />
            {children}
        </p>
    )
}

export function SectionTitle({ children }: { children: ReactNode }) {
    return (
        <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
            {children}
        </h2>
    )
}

export function SectionLead({ children }: { children: ReactNode }) {
    return (
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
            {children}
        </p>
    )
}

/**
 * A link that reads as a button. HeroUI's `Button` renders a real <button>
 * (React Aria), so navigation targets have to borrow its styling instead of
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
    variant?: ButtonProps["variant"]
    size?: ButtonProps["size"]
    external?: boolean
    className?: string
}) {
    return (
        <Link
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className={`${buttonVariants({ variant, size })} ${className}`}
        >
            {children}
        </Link>
    )
}
