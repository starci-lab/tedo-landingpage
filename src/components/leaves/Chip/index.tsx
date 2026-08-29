"use client"

import { Chip as HeroChip } from "@heroui/react"
import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `Chip`: one short, self-contained fact - a tag, a status word, a plan
 * badge - read at a glance rather than in a sentence.
 *
 * A THIN WRAPPER, ON PURPOSE. HeroUI's `Chip` already draws the pill, the color
 * ramp and the size scale; this leaf's whole job is closing that vendor surface
 * behind the props fence so no caller reaches HeroUI directly. `HeroChip` is the
 * import alias - the leaf's own export must be named `Chip` for its folder, so the
 * vendor component needs a different local name to avoid shadowing it.
 */

/** HeroUI's own chip weights - which fill style the pill draws with. */
export type ChipVariant = "primary" | "secondary" | "soft" | "tertiary"

/** HeroUI's own chip colors - which semantic ramp the pill borrows. */
export type ChipColor = "default" | "accent" | "success" | "warning" | "danger"

/** The three sizes a marketing surface reaches for, matching every other leaf's scale. */
export type ChipSize = "sm" | "md" | "lg"

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type ChipData = {
    /** The already-resolved label. */
    readonly content?: string
    /** Which fill style the pill draws with. */
    readonly variant?: ChipVariant
    /** Which semantic ramp the pill borrows. */
    readonly color?: ChipColor
    /** How large the pill reads. */
    readonly size?: ChipSize
}

/** Props for {@link Chip}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type ChipProps = LeafProps<ChipData>

/**
 * Draw one short fact as a pill.
 *
 * @param input - {@link ChipProps}
 */
export const Chip = ({ props }: ChipProps) => {
    return (
        <HeroChip
            data-tier="leaf"
            data-component="Chip"
            variant={props.variant ?? "soft"}
            color={props.color ?? "default"}
            size={props.size ?? "md"}
        >
            {props.content ?? ""}
        </HeroChip>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
