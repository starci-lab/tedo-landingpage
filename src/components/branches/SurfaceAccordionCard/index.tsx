"use client"

import { Accordion } from "@heroui/react"
import { renderContractValue } from "@/components/branches/Tree"
import type { ContractSlots } from "@/components/contracts/props"

/**
 * BRANCH - `SurfaceAccordionCard`: the `labelled-surface-section` contract, projected into one
 * collapsible item of a HeroUI `Accordion`.
 *
 * THE LABEL BECOMES THE TRIGGER. Outside an accordion, `label` and `body` are two siblings the
 * reader sees at once; inside one, the label is the only thing showing until it is pressed - so
 * unlike `SurfaceCard` and `SurfaceListCard`, `label` here crosses INTO the vendor body too,
 * because HeroUI's `Disclosure` requires its heading and its panel under one shared item root to
 * wire the button, the panel and the expanded state together. What stays constant across all four
 * SurfaceCard-family branches is the CONTRACT, not which side of the vendor boundary each slot lands.
 *
 * THE CALLER OWNS THE `Accordion.Root`. This branch draws one `Accordion.Item`; a page assembling
 * several (an FAQ list, for one) hands each one its own `SurfaceAccordionCard` and supplies the
 * `Accordion.Root` around them so only one item opens - or several, per that root's own `type`.
 */

/** Props for {@link SurfaceAccordionCard}. */
export interface SurfaceAccordionCardProps {
    /** Checked slots for `labelled-surface-section` - never a projection, since projecting IS this branch's job. */
    readonly render: ContractSlots<"labelled-surface-section">
    /** Stable id `Accordion.Root`'s own expanded-state tracking keys this item by. */
    readonly itemId: string
    readonly isLoading?: boolean
}

/**
 * Draw a labelled surface as one collapsible accordion item.
 *
 * @param props - {@link SurfaceAccordionCardProps}
 */
export const SurfaceAccordionCard = ({ render, itemId }: SurfaceAccordionCardProps) => {
    return (
        <Accordion.Item id={itemId} data-tier="branch" data-component="SurfaceAccordionCard">
            <Accordion.Heading>
                <Accordion.Trigger>
                    {renderContractValue(render.slots.label, "label")}
                    <Accordion.Indicator />
                </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
                <Accordion.Body>
                    {renderContractValue(render.slots.body, "body")}
                </Accordion.Body>
            </Accordion.Panel>
        </Accordion.Item>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "branch", world: "pure" } as const
