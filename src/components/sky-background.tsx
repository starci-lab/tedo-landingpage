import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection } from "@/components/contracts/props"

/**
 * Fixed light "sky" backdrop behind the whole page — the marketing counterpart
 * to the old technical grid, tuned to the Canva deck's airy blue/cloud world.
 * Purely decorative: aria-hidden + pointer-events-none so it never intercepts a
 * click on the content above it.
 *
 * Two layers: a soft blue/green wash bleeding from the top (`tedo-sky`), and a
 * whisper-quiet dotted field (`tedo-dots`, the deck's world-map texture) masked
 * so it dissolves before it reaches body copy.
 */
/** Fixed decorative sky and dotted backdrop behind the page content. */
export const SkyBackground = () => {
    return (
        <Tree
            contract="sky-backdrop"
            render={defineContractComponent("sky-backdrop", {
                layers: defineContractProjection("opaque-content-unit", () => (
                    <>
                        <Tree contract="sky-wash-layer" render={defineContractComponent("sky-wash-layer", {})} />
                        <Tree contract="sky-dots-layer" render={defineContractComponent("sky-dots-layer", {})} />
                    </>
                )),
            })}
        />
    )
}
