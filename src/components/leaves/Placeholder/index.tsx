import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `Placeholder`: one pulsing rectangle standing in for content that has not loaded yet.
 *
 * A TRUE GAP, NOT A NAMING GAP. Neither `chat/loading.tsx` (the route's Suspense boundary) nor
 * `ConsultationChat`'s own in-thread skeleton had a primitive to draw a loading bar with - each
 * hand-wrote a `<div>` sized by raw utility classes. Both call sites want the same fact (a shape is
 * coming, not here yet) at different sizes, which is exactly what one parametrised leaf is for.
 *
 * SIZE AND WIDTH ARE NAMED STEPS, not raw Tailwind tokens passed through - a leaf's `props` is data,
 * never a class string, for the same reason every other leaf's `props` fence refuses one.
 */

/** How tall one placeholder bar stands, from a caption-height sliver to a whole message bubble. */
export type PlaceholderHeight = "xs" | "sm" | "md" | "lg" | "xl"

/** How wide one placeholder bar runs. */
export type PlaceholderWidth = "half" | "twoThirds" | "threeQuarters" | "full" | "wide"

/** Which brand ramp the bar pulses in. The leaf never guesses this from an ancestor. */
export type PlaceholderTone = "brand" | "neutral"

/** Where along its row the bar sits - a trailing reply reads right-aligned against its sender. */
export type PlaceholderAlign = "start" | "end"

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type PlaceholderData = {
    /** How tall the bar stands. */
    readonly height: PlaceholderHeight
    /** How wide the bar runs. */
    readonly width: PlaceholderWidth
    /** Which brand ramp the bar pulses in. */
    readonly tone?: PlaceholderTone
    /** Where along its row the bar sits. */
    readonly align?: PlaceholderAlign
}

/** Props for {@link Placeholder}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type PlaceholderProps = LeafProps<PlaceholderData>

const HEIGHT_CLASSES = {
    xs: "h-5",
    sm: "h-8",
    md: "h-14",
    lg: "h-16",
    xl: "h-24",
} as const

const WIDTH_CLASSES = {
    half: "w-1/2",
    twoThirds: "w-2/3",
    threeQuarters: "w-3/4",
    full: "w-full max-w-xl",
    wide: "w-52",
} as const

const TONE_CLASSES = {
    brand: "bg-brand-soft",
    neutral: "bg-line",
} as const

const ALIGN_CLASSES = {
    start: "",
    end: "ml-auto",
} as const

/**
 * Draw one pulsing placeholder bar.
 *
 * @param input - {@link PlaceholderProps}
 */
export const Placeholder = ({ props }: PlaceholderProps) => {
    const tone = props.tone ?? "neutral"
    const align = props.align ?? "start"
    return (
        <span
            data-tier="leaf"
            data-component="Placeholder"
            aria-hidden="true"
            className={`block animate-pulse rounded-2xl ${HEIGHT_CLASSES[props.height]} ${WIDTH_CLASSES[props.width]} ${TONE_CLASSES[tone]} ${ALIGN_CLASSES[align]}`}
        />
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
