import type { LeafProps } from "@/components/grammar/props"
import { Icon, type IconName } from "@/components/leaves/Icon"

/**
 * LEAF - `IconButton`: a square trigger that reports a press and carries no label of its own -
 * "attach an image", "attach a file", and anything else that reads from its glyph alone.
 *
 * COMPOSES `Icon` INSIDE ONE `<button>`. This is still one atomic primitive host: the glyph is not
 * a structural element, so nesting the existing `Icon` leaf here does not trip
 * `no-structural-arrangement-in-leaf`, and it means this leaf invents no second copy of the
 * Heroicons surface `Icon` already closes off.
 *
 * A NATIVE `<button>`, NOT `ActionButton`. `ActionButton`'s CTA scale (`sm`/`md`/`lg`, five
 * variants) is sized and coloured for a labelled call to action; a bare icon trigger inside a
 * composer needs a fixed square hit target and a quiet hover state neither variant draws.
 */

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type IconButtonData = {
    /** Which glyph this trigger shows. */
    readonly icon: IconName
    /** The accessible name a bare glyph cannot supply on its own. */
    readonly label: string
}

/** What this leaf does. A press is the one thing an icon trigger reports. */
export type IconButtonActions = {
    readonly onPress?: () => void
}

/** Props for {@link IconButton}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type IconButtonProps = LeafProps<IconButtonData, IconButtonActions>

/**
 * Draw one square icon-only trigger.
 *
 * @param input - {@link IconButtonProps}
 */
export const IconButton = ({ props, on }: IconButtonProps) => {
    return (
        <button
            type="button"
            data-tier="leaf"
            data-component="IconButton"
            aria-label={props.label}
            onClick={on?.onPress}
            className="grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-xl text-ink-muted transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
            <Icon props={{ name: props.icon, size: "md" }} />
        </button>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
