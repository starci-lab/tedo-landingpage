import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `FilterChip`: a pressable pill that narrows a visible set to one category, or clears
 * back to "all".
 *
 * NOT `Chip`. `Chip` draws "one short, self-contained fact... read at a glance" and takes no
 * `on` - it cannot report a press. A category filter is a CONTROL, not a fact: it toggles a
 * selection and needs a real focusable, clickable host, which is exactly what the projects
 * gallery's filter row hand-rolled a bare `<button>` for before this migration. `ActionButton`
 * does not fit either - its five-variant CTA scale is sized and coloured for a call to action,
 * not a low-contrast pill that reads as "on" or "off".
 *
 * A NATIVE `<button>`, ONE PRIMITIVE HOST. No icon, no nested structural element - just the
 * label and the selected/unselected ground.
 */

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type FilterChipData = {
    /** The already-resolved category label. */
    readonly content: string
    /** Whether this filter is the one currently narrowing the visible set. */
    readonly selected?: boolean
}

/** What this leaf does. A press is the one thing a filter chip reports. */
export type FilterChipActions = {
    readonly onPress?: () => void
}

/** Props for {@link FilterChip}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type FilterChipProps = LeafProps<FilterChipData, FilterChipActions>

const SELECTED_CLASSES = "cursor-pointer rounded-full border border-brand bg-brand px-4 py-2 text-sm font-medium text-white transition-colors"
const UNSELECTED_CLASSES = "cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-brand hover:text-brand"

/**
 * Draw one pressable category filter.
 *
 * @param input - {@link FilterChipProps}
 */
export const FilterChip = ({ props, on }: FilterChipProps) => {
    return (
        <button
            type="button"
            data-tier="leaf"
            data-component="FilterChip"
            aria-pressed={Boolean(props.selected)}
            onClick={on?.onPress}
            className={props.selected ? SELECTED_CLASSES : UNSELECTED_CLASSES}
        >
            {props.content}
        </button>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
