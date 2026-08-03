"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

/**
 * Scroll-reveal wrapper: fades + lifts its children into place the first time
 * they enter the viewport. Used to give the whole page the deck's "things
 * settle into view" feel. Honors prefers-reduced-motion by rendering statically.
 */
export function Reveal({
    children,
    delay = 0,
}: {
    children: ReactNode
    delay?: number
}) {
    const reduce = useReducedMotion()
    if (reduce) return <>{children}</>

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay }}
        >
            {children}
        </motion.div>
    )
}
