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
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
            <div className="tedo-sky absolute inset-0" />
            <div className="tedo-dots absolute inset-0" />
        </div>
    )
}
