import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `SelectedFileChip`: one file waiting to be sent, named and removable before it goes.
 *
 * ONE ATOMIC PRIMITIVE. The pill and its remove control are both non-landmark elements
 * (`<span>`/`<button>`), so this stays one primitive host the same way {@link ../AttachmentLink}
 * does - see that leaf's note on `no-structural-arrangement-in-leaf`.
 */

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type SelectedFileChipData = {
    /** The file's own name, truncated by the pill if it runs long. */
    readonly fileName: string
    /** The accessible name for the remove control - the file name is folded into it by the caller. */
    readonly removeLabel: string
}

/** What this leaf does. Removing the file is the one action a pending chip reports. */
export type SelectedFileChipActions = {
    readonly onRemove?: () => void
}

/** Props for {@link SelectedFileChip}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type SelectedFileChipProps = LeafProps<SelectedFileChipData, SelectedFileChipActions>

/**
 * Draw one pending attachment as a removable pill.
 *
 * @param input - {@link SelectedFileChipProps}
 */
export const SelectedFileChip = ({ props, on }: SelectedFileChipProps) => {
    return (
        <span
            data-tier="leaf"
            data-component="SelectedFileChip"
            className="inline-flex max-w-full items-center gap-2 rounded-lg bg-brand-soft px-2 py-1 text-xs text-brand-deep"
        >
            <span className="max-w-48 truncate">{props.fileName}</span>
            <button
                type="button"
                onClick={on?.onRemove}
                aria-label={props.removeLabel}
                className="cursor-pointer rounded p-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
                ×
            </button>
        </span>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
