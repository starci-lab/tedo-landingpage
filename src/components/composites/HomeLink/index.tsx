"use client"

import { useRouter } from "@/i18n/routing"
import { Wordmark } from "@/components/leaves/Wordmark"

/**
 * COMPOSITE - `HomeLink`: the site mark, pressable, always returning to `/`.
 *
 * A LEAF CANNOT OWN THIS, for the same reason {@link ../BackHomeAction} cannot: an internal
 * destination must travel through a connected `router.push`, never a literal `href`
 * (`no-internal-starci-href`), so the wiring is a closed COMPOSITE around the pure `Wordmark`.
 *
 * NOT `BackHomeAction`. That composite renders a labelled `ActionButton` - the return path
 * inside a route with no header of its own. The site header's own logo is the mark itself,
 * clickable, with no second label beside it.
 */

/** Props for {@link HomeLink}. */
export interface HomeLinkProps {
    /** The accessible name a bare mark cannot supply on its own. */
    readonly label: string
}

/**
 * Draw the site mark as the one control that always returns to `/`.
 *
 * @param props - {@link HomeLinkProps}
 */
export const HomeLink = ({ label }: HomeLinkProps) => {
    const router = useRouter()
    return (
        <button
            type="button"
            aria-label={label}
            onClick={() => router.push("/")}
            className="cursor-pointer"
        >
            <Wordmark />
        </button>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "composite", world: "impure" } as const
