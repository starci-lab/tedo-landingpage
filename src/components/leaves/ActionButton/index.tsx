"use client"

import { Button, Spinner } from "@heroui/react"
import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `ActionButton`: a call to action that performs, rather than navigates.
 *
 * HeroUI's `Button` already renders a real `<button>` (React Aria), so unlike its
 * sibling {@link ../ActionLink} this leaf has nothing to borrow styling from - it
 * mounts the vendor primitive directly and layers the same CTA visual system on
 * top, so a submit control and a navigation control read as the same family.
 *
 * NO ABSORPTION SOURCE. The deleted `components/ui.tsx` never had a button-shaped
 * CTA: every real call site of the old `CtaLink` passed only `href`. This leaf is
 * new - built for the form-action call sites (`type="submit"`, a click that starts
 * a flow) that a navigation link cannot honestly serve.
 *
 * NO `className`, matching every other leaf's props fence.
 */

/** The three weights a call to action reaches for, matching {@link ../ActionLink}'s scale. */
export type ActionButtonSize = "sm" | "md" | "lg"

/** Which visual role this button plays, matching {@link ../ActionLink}'s vocabulary. */
export type ActionButtonVariant = "primary" | "brand" | "outline" | "outlineDark" | "ghost"

/** What kind of control this is: a plain trigger, or a form's submit control. */
export type ActionButtonType = "button" | "submit"

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type ActionButtonData = {
    /** The already-resolved label. */
    readonly content?: string
    /** Which visual role this button plays. */
    readonly variant?: ActionButtonVariant
    /** How large the control reads. */
    readonly size?: ActionButtonSize
    /** Whether this submits its enclosing form or only fires `on.onPress`. */
    readonly type?: ActionButtonType
    /** Whether this control is inert regardless of the loading state. */
    readonly disabled?: boolean
}

/** What this leaf does. A press is the one thing a button-shaped CTA reports. */
export type ActionButtonActions = {
    readonly onPress?: () => void
}

/** Props for {@link ActionButton}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type ActionButtonProps = LeafProps<ActionButtonData, ActionButtonActions>

/**
 * Its own copy of {@link ../ActionLink}'s CTA visual system - see that leaf's note on why the
 * two sets are not shared from one module. This copy adds the disabled treatment a link never
 * needs: an `<a>` has no disabled state, but a real `<button>` does.
 */
const CTA_BASE =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50"

const CTA_SIZE = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
} as const

const CTA_VARIANT = {
    primary:
        "bg-accent text-accent-ink shadow-[0_6px_18px_-6px_rgba(245,130,32,0.6)] hover:bg-accent-dim",
    brand: "bg-brand text-white hover:bg-brand-bright",
    outline:
        "border border-line-strong bg-white/60 text-ink hover:border-brand hover:text-brand",
    outlineDark:
        "border border-white/25 text-white hover:border-white/60 hover:bg-white/5",
    ghost: "text-ink hover:text-brand",
} as const

/**
 * Draw one call-to-action button.
 *
 * @param input - {@link ActionButtonProps}
 */
export const ActionButton = ({ props, on, isLoading }: ActionButtonProps) => {
    const variant = props.variant ?? "primary"
    const size = props.size ?? "lg"
    return (
        <Button
            data-tier="leaf"
            data-component="ActionButton"
            data-variant={variant}
            data-size={size}
            type={props.type ?? "button"}
            isDisabled={Boolean(props.disabled) || Boolean(isLoading)}
            onPress={on?.onPress}
            className={`${CTA_BASE} ${CTA_SIZE[size]} ${CTA_VARIANT[variant]}`}
        >
            {isLoading ? <Spinner size="sm" /> : null}
            {props.content ?? ""}
        </Button>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
