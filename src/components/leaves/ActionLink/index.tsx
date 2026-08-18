"use client"

import { Link } from "@heroui/react"
import type { LeafProps } from "@/components/contracts/props"

/**
 * LEAF - `ActionLink`: a call to action that navigates.
 *
 * HeroUI's `Button` renders a real `<button>` (React Aria), so a navigation target
 * has to borrow the styling instead of using the component - otherwise the call
 * to action loses `href`, middle-click and SEO. This absorbs `CtaLink` and its
 * `CTA_BASE`/`CTA_SIZE`/`CTA_VARIANT` constants from the deleted `components/ui.tsx`
 * verbatim: the sets did not change, only the fence and the name did.
 *
 * RENAMED FROM `CtaLink`. Every real call site across the marketing sections passes
 * only `href` - never an `onClick` or a form submit - so this leaf is the honest,
 * unmodified absorption of the old primitive. A CTA that performs an action instead
 * of navigating is the sibling leaf `ActionButton`, which renders a native `<button>`
 * and has no absorption source: nothing in the deleted primitive ever did that.
 *
 * NO `className`. The old primitive took one for the rare call site that needed
 * a nudge; every leaf's props fence refuses that seam on purpose - a caller who
 * can restyle a node has become its second owner. A call site that truly needs a
 * different look names a new variant here instead.
 */

/** The three weights a call to action reaches for, from the quietest to the loudest ground. */
export type ActionLinkSize = "sm" | "md" | "lg"

/** Which visual role this link plays. Never combined - one CTA, one loudest choice. */
export type ActionLinkVariant = "primary" | "brand" | "outline" | "outlineDark" | "ghost"

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type ActionLinkData = {
    /** Where the link goes. */
    readonly href: string
    /** The already-resolved label. */
    readonly content?: string
    /** Which visual role this link plays. */
    readonly variant?: ActionLinkVariant
    /** How large the control reads. */
    readonly size?: ActionLinkSize
    /** Whether this leaves the site - opens a new tab and marks the relationship. */
    readonly external?: boolean
}

/** Props for {@link ActionLink}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type ActionLinkProps = LeafProps<ActionLinkData>

/**
 * Shared with {@link ../ActionButton}'s own copy: one CTA visual system, two vendor
 * primitives. Each leaf keeps its own copy rather than importing across siblings - a
 * leaf's classes are its own business, and the two sets already drifted apart once
 * ActionButton grew a `disabled` state a link never needs.
 */
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
 * Draw one call-to-action link.
 *
 * @param input - {@link ActionLinkProps}
 */
export const ActionLink = ({ props }: ActionLinkProps) => {
    const variant = props.variant ?? "primary"
    const size = props.size ?? "lg"
    return (
        <Link
            data-tier="leaf"
            data-component="ActionLink"
            data-variant={variant}
            data-size={size}
            href={props.href}
            {...(props.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className={`${CTA_BASE} ${CTA_SIZE[size]} ${CTA_VARIANT[variant]}`}
        >
            {props.content ?? ""}
        </Link>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
