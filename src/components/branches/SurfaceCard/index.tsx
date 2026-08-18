"use client"

import { Card } from "@heroui/react"
import { renderContractValue } from "@/components/branches/Tree"
import type { ContractSlots } from "@/components/contracts/props"

/**
 * BRANCH - `SurfaceCard`: the `labelled-surface-section` contract, projected into a bordered card.
 *
 * WRAPPER MECHANICS ARE INDEPENDENT OF CONTENT CONTRACT. `labelled-surface-section` only fixes
 * that a label sits above a body - it says nothing about a border, a shadow, or a radius. Those
 * belong to the VENDOR body this branch chooses, which is why `label` lands in `Card.Header` and
 * only `body` crosses into `Card.Content`: two different vendor regions, so the name and the
 * bounded content each keep their own edge instead of competing for one.
 *
 * NO `CardShell`. A generic shell that took "children" and drew a border around them would let
 * any two unrelated things share one wrapper for no reason beyond convenience. This branch exists
 * because exactly one contract - `labelled-surface-section` - needs exactly this vendor body.
 *
 * A named surface branch is the one place allowed to hand-write a vendor host: `contractNodeProps`
 * stays off-limits even here (the registry's OWN classes belong to `Tree`, the one frame that
 * paints them), and this file draws only the vendor's element and the vendor's own classes.
 */

/** Props for {@link SurfaceCard}. */
export interface SurfaceCardProps {
    /** Checked slots for `labelled-surface-section` - never a projection, since projecting IS this branch's job. */
    readonly render: ContractSlots<"labelled-surface-section">
    /** The card's visual weight. `transparent` drops the border/shadow while the label still leads it. */
    readonly variant?: "default" | "secondary" | "tertiary" | "transparent"
    readonly isLoading?: boolean
}

/**
 * Draw a labelled surface as a bordered card.
 *
 * @param props - {@link SurfaceCardProps}
 */
export const SurfaceCard = ({ render, variant = "default" }: SurfaceCardProps) => {
    return (
        <Card.Root data-tier="branch" data-component="SurfaceCard" variant={variant}>
            <Card.Header>
                {renderContractValue(render.slots.label, "label")}
            </Card.Header>
            <Card.Content>
                {renderContractValue(render.slots.body, "body")}
            </Card.Content>
        </Card.Root>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "branch", world: "pure" } as const
