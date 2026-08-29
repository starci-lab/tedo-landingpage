import * as OutlineIcons from "@heroicons/react/24/outline"
import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `Icon`: the picture a word needs when the word alone is slower to find.
 *
 * THE SET IS NOT HAND-PICKED. `name` is typed as `keyof typeof OutlineIcons`, so every glyph
 * `@heroicons/react/24/outline` ships is reachable and none is copy-pasted into a second map here.
 * That keeps `props.name` a plain string - satisfying the data fence every leaf's `props` must
 * satisfy - while the glyph COMPONENT itself never crosses that fence.
 *
 * COLOUR IS NOT A PROP. The glyph draws in `currentColor`, so it inherits whatever `text-*` the
 * node above carries and can never disagree with the label beside it.
 */

/** Every glyph name `@heroicons/react/24/outline` exports. */
export type IconName = keyof typeof OutlineIcons

/** The three sizes a marketing surface reaches for: inline with body copy, beside a control, or standalone. */
export type IconSize = "sm" | "md" | "lg"

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type IconData = {
    /** Which Heroicon to draw. */
    readonly name: IconName
    /** How large the glyph reads. */
    readonly size?: IconSize
}

/** Props for {@link Icon}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type IconProps = LeafProps<IconData>

/** Each size step, matched to the reading step it usually sits beside. */
const SIZE_CLASSES = {
    sm: "size-4 shrink-0",
    md: "size-5 shrink-0",
    lg: "size-6 shrink-0",
} as const

/**
 * Draw one glyph.
 *
 * @param input - {@link IconProps}
 */
export const Icon = ({ props }: IconProps) => {
    const Glyph = OutlineIcons[props.name]
    return (
        <Glyph
            data-tier="leaf"
            data-component="Icon"
            aria-hidden="true"
            className={SIZE_CLASSES[props.size ?? "md"]}
        />
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
