"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

/**
 * BRANCH - `Reveal`: fades + lifts already-resolved content into place the first time it enters
 * the viewport. Used to give the whole page the deck's "things settle into view" feel. Honors
 * `prefers-reduced-motion` by rendering statically.
 *
 * TAKES `content: ReactNode`, RESOLVED BY THE CALLER THROUGH THE GRAMMAR SYSTEM BEFORE IT
 * ARRIVES HERE - never a `grammar`+`render` pair of its own. `Reveal` is a Client Component (it
 * needs `framer-motion`'s viewport hooks), and a grammar-bound `render` value can carry a closure
 * (`GrammarProjection.project`, a `LeafComponent`'s own call signature) in its shape. A closure
 * cannot cross the Server->Client boundary Next.js draws around a Client Component's props - only
 * an already-built element tree can. So the caller (a Server Component) resolves its grammar
 * content into real JSX first - `<Reveal content={<GrammarContent grammar=... render=... />} />`
 * or, as often, a plain section element - and this branch only ever adds motion around a finished
 * node. It still opens no host element of its own: only the `motion.div` wrapper, which carries no
 * class, sits between the caller's content and the viewport.
 */

/** Props for {@link Reveal}. */
export interface RevealProps {
    /** Already-resolved content to animate into view. */
    content: ReactNode
    /** Stagger offset in seconds, for a run of several reveals entering together. */
    delay?: number
}

/**
 * Reveal already-resolved content on scroll.
 *
 * @param props - {@link RevealProps}
 */
export const Reveal = ({ content, delay = 0 }: RevealProps) => {
    const reduce = useReducedMotion()
    if (reduce) return <>{content}</>

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay }}
        >
            {content}
        </motion.div>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "branch", world: "pure" } as const
