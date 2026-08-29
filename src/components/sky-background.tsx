import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection } from "@/components/grammar/props"

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
            grammar="sky-backdrop"
            render={defineGrammarComponent("sky-backdrop", {
                layers: defineGrammarProjection("opaque-content-unit", () => (
                    <>
                        <Tree grammar="sky-wash-layer" render={defineGrammarComponent("sky-wash-layer", {})} />
                        <Tree grammar="sky-dots-layer" render={defineGrammarComponent("sky-dots-layer", {})} />
                    </>
                )),
            })}
        />
    )
}
