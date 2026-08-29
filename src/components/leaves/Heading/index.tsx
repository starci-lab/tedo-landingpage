"use client"

import { Typography } from "@heroui/react"
import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `Heading`: the name of a thing, at a level of the document outline.
 *
 * `level` DRIVES BOTH THE TAG AND THE SET, so the outline a screen reader walks and the sizes a
 * reader sees can never disagree. A caller raising the level is saying something true about the
 * page, never making the words bigger.
 *
 * This absorbs `SectionTitle` from the deleted `components/ui.tsx`: level 2 keeps its bold,
 * tight-tracking set, and `tone` keeps the old `onDark` switch as an explicit named value instead
 * of a boolean flag threaded through every call site.
 *
 * `accent` WAS ADDED FOR THE MARKETING SECTION MIGRATION WAVE. The hero headline closes on one
 * word in the brand's orange accent colour - a real, fixed emphasis every visitor sees first on
 * the page, not a one-off. `content` stays a single plain string by the leaf's own data fence, so
 * the emphasised trailing run travels as its own optional field rather than the leaf trying to
 * parse rich markup out of one string.
 */

/** How deep in the outline this title sits. Four levels is as deep as a marketing page should go. */
export type HeadingLevel = 1 | 2 | 3 | 4

/** Which ground this title sits on. The leaf never guesses this from an ancestor. */
export type HeadingTone = "default" | "onDark"

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type HeadingData = {
    /** The already-resolved title. */
    readonly content?: string
    /** Which level of the document outline this is. */
    readonly level?: HeadingLevel
    /** Whether this title sits on a dark band. */
    readonly tone?: HeadingTone
    /** An emphasised trailing run, always set in the brand's accent colour regardless of `tone`. */
    readonly accent?: string
}

/** Props for {@link Heading}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type HeadingProps = LeafProps<HeadingData>

/**
 * The set per outline level. Level 1 is the hero's own headline; level 2 is a section title -
 * `SectionTitle`'s old set, with its arbitrary `text-[2.6rem]` step replaced by the nearest step
 * the type scale already names.
 */
const LEVEL_CLASSES = {
    1: "text-4xl font-bold leading-tight tracking-tight sm:text-5xl",
    2: "text-3xl font-bold leading-tight tracking-tight sm:text-4xl",
    3: "text-xl font-semibold",
    4: "text-base font-semibold",
} as const

const TONE_CLASSES = {
    default: "text-foreground",
    onDark: "text-white",
} as const

/**
 * Draw a title.
 *
 * @param input - {@link HeadingProps}
 */
export const Heading = ({ props }: HeadingProps) => {
    const level = props.level ?? 2
    const tone = props.tone ?? "default"
    return (
        <Typography.Heading
            data-tier="leaf"
            data-component="Heading"
            data-level={level}
            data-tone={tone}
            level={level}
            className={`${LEVEL_CLASSES[level]} ${TONE_CLASSES[tone]}`}
        >
            {props.content ?? ""}
            {props.accent ? <span className="text-accent"> {props.accent}</span> : null}
        </Typography.Heading>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
