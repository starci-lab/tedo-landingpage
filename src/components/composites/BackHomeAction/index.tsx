"use client"

import { useRouter } from "@/i18n/routing"
import { ActionButton, type ActionButtonVariant } from "@/components/leaves/ActionButton"

/**
 * COMPOSITE - `BackHomeAction`: the one closed unit every "back to home" control reaches for.
 *
 * A LEAF CANNOT OWN THIS. Every leaf carries `world: "pure"` by policy - it draws from data and
 * reports a press, nothing more - and `no-internal-starci-href` requires an internal destination to
 * travel through a connected `router.push` instead of a literal `href`. That connection is real
 * side-effecting behaviour, so it belongs to a closed COMPOSITE: one leaf, wired to the one router
 * call it always makes, with nothing left for a caller to configure except the label and the weight.
 *
 * A server route file that cannot call `useRouter` itself (`du-an/page.tsx`, for one) drops this
 * component in as opaque `$content` instead of hand-writing the hook.
 */

/** Props for {@link BackHomeAction}. */
export interface BackHomeActionProps {
    /** The already-resolved label. */
    readonly label: string
    /** Which visual role this control plays. Defaults to the quietest weight - a return path never outshouts the page it returns from. */
    readonly variant?: ActionButtonVariant
}

/**
 * Draw the one control that always returns to `/`.
 *
 * @param props - {@link BackHomeActionProps}
 */
export const BackHomeAction = ({ label, variant = "ghost" }: BackHomeActionProps) => {
    const router = useRouter()
    return (
        <ActionButton
            props={{ content: label, variant, size: "sm" }}
            on={{ onPress: () => router.push("/") }}
        />
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "composite", world: "impure" } as const
