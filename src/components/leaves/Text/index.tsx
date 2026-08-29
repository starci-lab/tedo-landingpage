"use client"

import { Typography } from "@heroui/react"
import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `Text`: a run of copy that is not a title. One leaf, three variants -
 * never three leaves - because all three are the same fact (words on a ground)
 * differing only in how loud they read.
 *
 * This absorbs `Eyebrow` and `SectionLead` from the deleted `components/ui.tsx`,
 * and also backs the plain "text" leaf the registry already names in
 * `card-label-row.end` and `list-label-row.label`/`fact` - the trailing fact
 * beside a card title, and the baseline-paired label/fact in a list header.
 * `tone` keeps the old `onDark` boolean as an explicit named value instead of a
 * flag threaded through every call site.
 *
 * `danger` WAS ADDED FOR THE FORM/CHAT MIGRATION WAVE. Several call sites across
 * `consultation/*` and `quote/*` hand-rolled `text-red-700` beside otherwise ordinary body
 * copy for a validation or a send failure - the same fact every time (this line reports a
 * problem), never styled twice the same way. `danger` names that fact instead of leaving
 * every call site to reinvent the colour.
 *
 * `stat` WAS ADDED FOR THE MARKETING SECTION MIGRATION WAVE. A large, brand-coloured figure -
 * a warranty window, a conversion percentage, a price, a case-study metric - is DATA next to
 * its own label, never a document title: `no-hand-rolled-heading` refuses large text paired
 * with a heavy weight outside the heading component precisely because a real title belongs in
 * the outline, and a stat figure does not - forcing it through `Heading` would put a number
 * nothing else in the page treats as a section name into the screen-reader outline. Five
 * sections previously hand-rolled five slightly different sizes for the same fact; `stat`
 * commits to one figure style instead.
 *
 * `label` WAS ALSO ADDED FOR THAT WAVE. A small mono uppercase caption above a short list - a
 * footer column's own name, what a price does and does not cover - is a different fact from
 * `eyebrow` (which always leads a whole section and always carries its own rule) and from `body`
 * (plain inline prose): it is a header for the few items directly under it and nothing else.
 */

/** Which shape of copy this is. `eyebrow` carries its own lead rule; `lead` is the
 * paragraph under a section title; `body` is the plain inline fact a row uses; `stat` is a
 * large standalone figure read as data, not a title; `label` is a small caption over a short
 * list. */
export type TextVariant = "eyebrow" | "lead" | "body" | "stat" | "label"

/** Which ground this copy sits on, or whether it reports a problem. The leaf never guesses this from an ancestor. */
export type TextTone = "default" | "onDark" | "danger"

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type TextData = {
    /** The already-resolved copy. */
    readonly content?: string
    /** Which shape of copy this is. */
    readonly variant?: TextVariant
    /** Whether this copy sits on a dark band. */
    readonly tone?: TextTone
}

/** Props for {@link Text}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type TextProps = LeafProps<TextData>

/**
 * The set per variant, tone folded in where the old primitive kept two separate
 * colour ramps (`Eyebrow`'s brand/accent pair, `SectionLead`'s ink/slate pair).
 * `body` carries no tone split: a trailing fact beside a title never sits on a
 * dark band today, so a third invented ramp would be a guess with no call site.
 */
const VARIANT_CLASSES = {
    eyebrow: {
        default: "flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-brand",
        onDark: "flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-accent",
        // No dark-band eyebrow ever reports a problem today - carried only to keep the tone map total.
        danger: "flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-red-700",
    },
    lead: {
        default: "max-w-2xl text-pretty text-base leading-relaxed sm:text-lg text-ink-muted",
        onDark: "max-w-2xl text-pretty text-base leading-relaxed sm:text-lg text-slate-300",
        danger: "max-w-2xl text-pretty text-base leading-relaxed sm:text-lg text-red-700",
    },
    body: {
        default: "text-sm text-ink-body",
        onDark: "text-sm text-white/80",
        danger: "text-sm text-red-700",
    },
    stat: {
        default: "font-display text-3xl font-bold tracking-tight text-brand",
        onDark: "font-display text-3xl font-bold tracking-tight text-white",
        // No dark-band stat figure ever reports a problem today - carried only to keep the tone map total.
        danger: "font-display text-3xl font-bold tracking-tight text-red-700",
    },
    label: {
        default: "font-mono text-xs font-medium uppercase tracking-wide text-ink-faint",
        onDark: "font-mono text-xs font-medium uppercase tracking-wide text-white/70",
        // No dark-band caption ever reports a problem today - carried only to keep the tone map total.
        danger: "font-mono text-xs font-medium uppercase tracking-wide text-red-700",
    },
} as const

const RULE_CLASSES = {
    default: "h-px w-6 shrink-0 bg-brand",
    onDark: "h-px w-6 shrink-0 bg-accent",
    danger: "h-px w-6 shrink-0 bg-red-700",
} as const

/**
 * Draw one run of copy.
 *
 * @param input - {@link TextProps}
 */
export const Text = ({ props }: TextProps) => {
    const variant = props.variant ?? "body"
    const tone = props.tone ?? "default"
    return (
        <Typography.Paragraph
            data-tier="leaf"
            data-component="Text"
            data-variant={variant}
            data-tone={tone}
            size={variant === "body" ? "sm" : "base"}
            className={VARIANT_CLASSES[variant][tone]}
        >
            {variant === "eyebrow" && <span aria-hidden className={RULE_CLASSES[tone]} />}
            {props.content ?? ""}
        </Typography.Paragraph>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
