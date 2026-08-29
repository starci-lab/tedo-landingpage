"use client"

import { Separator as HeroSeparator } from "@heroui/react"
import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `Separator`: the rule that ends one run of content before the next
 * begins, without naming what either side is.
 *
 * A THIN WRAPPER, ON PURPOSE. HeroUI's `Separator` already draws the line and its
 * orientation; this leaf's whole job is closing that vendor surface behind the
 * props fence. `HeroSeparator` is the import alias - the leaf's own export must be
 * named `Separator` for its folder, so the vendor component needs a different
 * local name to avoid shadowing it.
 */

/** Which axis the rule runs along. */
export type SeparatorOrientation = "horizontal" | "vertical"

/** HeroUI's own weight ramp - how strongly the rule reads against its ground. */
export type SeparatorVariant = "default" | "secondary" | "tertiary"

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type SeparatorData = {
    /** Which axis the rule runs along. */
    readonly orientation?: SeparatorOrientation
    /** How strongly the rule reads against its ground. */
    readonly variant?: SeparatorVariant
}

/** Props for {@link Separator}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type SeparatorProps = LeafProps<SeparatorData>

/**
 * Draw one dividing rule.
 *
 * @param input - {@link SeparatorProps}
 */
export const Separator = ({ props }: SeparatorProps) => {
    return (
        <HeroSeparator
            data-tier="leaf"
            data-component="Separator"
            orientation={props.orientation ?? "horizontal"}
            variant={props.variant ?? "default"}
        />
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
