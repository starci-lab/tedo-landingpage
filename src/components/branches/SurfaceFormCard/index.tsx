"use client"

import type { SyntheticEvent } from "react"
import { Form } from "@heroui/react"
import { Tree } from "@/components/branches/Tree"
import type { GrammarSlots } from "@/components/grammar/props"

/**
 * BRANCH - `SurfaceFormCard`: the `labelled-surface-section` grammar, projected into a real
 * `<form>` rather than a `<div>`.
 *
 * A GRAMMAR NEVER CARRIES BEHAVIOUR. `labelled-surface-section` fixes where the label and the
 * body sit; it says nothing about what happens on submit, because a submit handler is not data a
 * registry entry could hold - the fourth prop `LeafProps` refuses on a leaf for the same reason a
 * grammar refuses one here. `onSubmit` therefore travels as this branch's own prop, beside
 * `render`, never inside it.
 *
 * `Form.Root` has no header/content split the way `Card` does, so the whole grammar renders
 * through `Tree` exactly as the registry describes it - label above body - with the vendor form
 * supplying only the submit wiring and the surface styling around that one rendered node.
 *
 * WHY A SEPARATE BRANCH RATHER THAN `SurfaceCard` WITH AN `as="form"` ESCAPE HATCH: swapping the
 * element a vendor body opens is exactly the decision `Tree` already refuses callers for a
 * grammar's own host (see `GrammarHost`) - the element is meaning, not styling, so the branch
 * that means "this labelled surface IS a submission" is named for it instead of parameterised.
 */

/** Props for {@link SurfaceFormCard}. */
export interface SurfaceFormCardProps {
    /** Checked slots for `labelled-surface-section` - never a projection, since projecting IS this branch's job. */
    readonly render: GrammarSlots<"labelled-surface-section">
    readonly onSubmit?: (event: SyntheticEvent<HTMLFormElement>) => void
}

/**
 * Draw a labelled surface as a submittable card.
 *
 * @param props - {@link SurfaceFormCardProps}
 */
export const SurfaceFormCard = ({ render, onSubmit }: SurfaceFormCardProps) => {
    return (
        <Form.Root
            data-tier="branch"
            data-component="SurfaceFormCard"
            onSubmit={onSubmit}
            className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 sm:p-7"
        >
            <Tree grammar="labelled-surface-section" render={render} />
        </Form.Root>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "branch", world: "pure" } as const
