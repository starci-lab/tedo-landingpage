import { Tree } from "@/components/branches/Tree"
import type { ContractSlots } from "@/components/contracts/props"

/**
 * BRANCH - `SurfaceListCard`: the `labelled-surface-section` contract, projected into one row of
 * a semantic list rather than a bordered card.
 *
 * THE VENDOR BODY HERE IS `<li>`, AND NOTHING ELSE. A list row that already sits inside a
 * `<ul>`/`<ol>` gets its separation from the list itself, so drawing a `Card` around every row
 * would double the border a reader sees between two items. This is the "bare list [that] can drop
 * the surface while the label stays" the registry's own `why` names for `labelled-surface-section`:
 * the whole contract renders exactly as the registry describes it - label above body, `flex
 * flex-col gap-3` - through `Tree` itself, with no vendor frame added around it at all.
 *
 * THE CALLER OWNS THE `<ul>`. This branch draws one `<li>`; a page assembling several hands each
 * one its own `SurfaceListCard` and supplies the list host around them.
 */

/** Props for {@link SurfaceListCard}. */
export interface SurfaceListCardProps {
    /** Checked slots for `labelled-surface-section` - never a projection, since projecting IS this branch's job. */
    readonly render: ContractSlots<"labelled-surface-section">
}

/**
 * Draw a labelled surface as one bare list row.
 *
 * @param props - {@link SurfaceListCardProps}
 */
export const SurfaceListCard = ({ render }: SurfaceListCardProps) => {
    return (
        <li data-tier="branch" data-component="SurfaceListCard">
            <Tree contract="labelled-surface-section" render={render} />
        </li>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "branch", world: "pure" } as const
