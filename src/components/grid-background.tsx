import { CircuitTraces } from "./circuit-traces"

/**
 * Fixed technical grid behind the whole page. Purely decorative, so it is
 * aria-hidden and pointer-events-none — it must never intercept a click on the
 * content above it.
 *
 * Two layers on purpose: a fine 16px weave for texture that reads as
 * "engineering drawing" up close, and a 96px major grid that gives the page a
 * visible column rhythm. Both are masked so the pattern dissolves before it
 * reaches the text — a grid at full strength behind body copy hurts legibility.
 */
export function GridBackground() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas"
        >
            <div className="tedo-grid-fine absolute inset-0" />
            <div className="tedo-grid-major absolute inset-0" />
            <div className="tedo-grid-vignette absolute inset-0" />
            {/* Above the vignette on purpose: the vignette paints solid canvas
                over the outer edges, which is exactly where the traces run. */}
            <CircuitTraces />
        </div>
    )
}
