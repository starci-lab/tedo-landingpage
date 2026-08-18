"use client"

import { useRouter } from "@/i18n/routing"
import { ActionButton, type ActionButtonSize, type ActionButtonVariant } from "@/components/leaves/ActionButton"

/**
 * COMPOSITE - `RouteCtaAction`: a labelled call to action that navigates to an internal StarCi
 * route.
 *
 * A LEAF CANNOT OWN THIS. `no-internal-starci-href` refuses a literal internal `href` wherever
 * it is typed, including inside a leaf's own `props` - so a marketing CTA that both READS as a
 * link and NAVIGATES within the app cannot be `ActionLink` (which is honestly a link: its `href`
 * always leaves this fence unchecked). The destination lives in this connected composite instead,
 * which reports a press through the pure `ActionButton` and calls `router.push` itself.
 *
 * REUSED ACROSS EVERY INTERNAL MARKETING CTA - the header's "/chat" contact button, the sticky
 * bar's "/chat" ask button, the cases section's "/du-an" gallery link, and the gallery's own
 * "/#contact" close - rather than one bespoke composite per destination, because all four are the
 * same shape: a label, a variant, and one internal path.
 */

/** Props for {@link RouteCtaAction}. */
export interface RouteCtaActionProps {
    /** The internal path this control navigates to. */
    readonly to: string
    /** The already-resolved label. */
    readonly label: string
    /** Which visual role this control plays. */
    readonly variant?: ActionButtonVariant
    /** How large the control reads. */
    readonly size?: ActionButtonSize
}

/**
 * Draw one call-to-action that pushes the router to an internal route.
 *
 * @param props - {@link RouteCtaActionProps}
 */
export const RouteCtaAction = ({ to, label, variant = "primary", size = "lg" }: RouteCtaActionProps) => {
    const router = useRouter()
    return (
        <ActionButton
            props={{ content: label, variant, size }}
            on={{ onPress: () => router.push(to) }}
        />
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "composite", world: "impure" } as const
