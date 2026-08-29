"use client"

import { useRef, type CSSProperties, type PointerEvent } from "react"
import { Wordmark } from "@/components/leaves/Wordmark"

/**
 * The hero's 3D "system" visual: a tilted node graph with a central TEDO hub
 * wired to the product modules (Web / Social / CRM / Academy / AI Workforce) —
 * the deck's ecosystem diagram, rebuilt in CSS 3D. Motion is CSS-driven
 * (`.tedo-scene` in globals.css); this component only threads the cursor
 * parallax (`--px`/`--py`) and the per-node pop + float delays.
 *
 * EVERY NODE HERE IS A `<span>`, NEVER A `<div>`. The outer frame reads a live
 * pointer position off a `ref` and needs a real DOM handle for
 * `getBoundingClientRect` - `Tree` has no channel for a `ref` or a pointer
 * handler, so this one purely decorative (`aria-hidden`), ref-driven scene stays
 * outside the grammar frame entirely rather than forcing a mechanic it cannot
 * express through it. Its structural positioning is named as real CSS in
 * `globals.css` (`.hero-3d-*`) instead of Tailwind's structural utility words,
 * the same escape this file's own `.tedo-scene` already uses for its motion.
 */

type Node = {
    label: string
    /** anchor position as % of the scene box */
    x: number
    y: number
    /** depth toward the viewer (px) */
    z: number
    color: string
    /** highlighted "already running" module (StarCi Academy) */
    live?: boolean
}

const HUB = { x: 50, y: 50 }

const NODES: Array<Node> = [
    { label: "Design", x: 15, y: 19, z: 40, color: "var(--color-brand)" },
    { label: "Frontend", x: 86, y: 22, z: 70, color: "var(--color-brand-bright)" },
    { label: "Backend", x: 90, y: 58, z: 30, color: "var(--color-green)" },
    { label: "CMS", x: 71, y: 88, z: 60, color: "var(--color-accent)" },
    { label: "SEO", x: 12, y: 74, z: 50, color: "var(--color-brand)" },
]

/** Interactive CSS 3D system visual for the hero section. */
export const Hero3DVisual = () => {
    const ref = useRef<HTMLSpanElement>(null)

    function onMove(e: PointerEvent<HTMLSpanElement>) {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
        el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
    }
    function reset() {
        const el = ref.current
        if (!el) return
        el.style.setProperty("--px", "0")
        el.style.setProperty("--py", "0")
    }

    return (
        <span
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={reset}
            className="hero-3d-frame"
            aria-hidden
        >
            {/* soft glow behind the graph */}
            <span className="hero-3d-glow pointer-events-none bg-gradient-to-br from-brand-soft to-transparent blur-3xl" />

            <span className="tedo-scene aspect-square">
                {/* connector wires (drawn under the nodes) */}
                <svg
                    viewBox="0 0 100 100"
                    className="hero-3d-wires h-full w-full"
                    preserveAspectRatio="none"
                >
                    {NODES.map((n) => (
                        <line
                            key={n.label}
                            x1={HUB.x}
                            y1={HUB.y}
                            x2={n.x}
                            y2={n.y}
                            className="tedo-wire"
                            stroke={n.live ? "var(--color-accent)" : "var(--color-brand)"}
                            strokeWidth={0.5}
                            strokeLinecap="round"
                            opacity={0.45}
                        />
                    ))}
                </svg>

                {/* central hub */}
                <span className="hero-3d-hub h-28 w-28 rounded-3xl border border-line bg-white text-center">
                    <Wordmark />
                    <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint">
                        Product studio
                    </span>
                    <span className="mt-2 inline-block h-1 w-1 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
                </span>

                {/* module nodes */}
                {NODES.map((n, i) => {
                    const style: CSSProperties = {
                        left: `${n.x}%`,
                        top: `${n.y}%`,
                        // pop in (staggered), then float forever
                        animation: `tedo-pop 0.6s ${0.9 + i * 0.14}s both, tedo-float ${6 + i * 0.5}s ease-in-out ${1.6 + i * 0.14}s infinite`,
                        transform: `translate(-50%,-50%) translateZ(${n.z}px)`,
                    }
                    return (
                        <span
                            key={n.label}
                            style={style}
                            className="hero-3d-node rounded-2xl border border-line bg-white/95 px-3 py-2 backdrop-blur-sm"
                        >
                            <span
                                className="hero-3d-node-icon h-6 w-6 rounded-lg text-[10px] font-bold text-white"
                                style={{ background: n.color }}
                            >
                                {n.label.charAt(0)}
                            </span>
                            <span className="whitespace-nowrap font-display text-[13px] font-semibold text-ink">
                                {n.label}
                            </span>
                            {n.live && (
                                <span className="ml-1 rounded-full bg-green/15 px-2 py-1 font-mono text-[9px] font-semibold uppercase text-green">
                                    live
                                </span>
                            )}
                        </span>
                    )
                })}
            </span>
        </span>
    )
}
