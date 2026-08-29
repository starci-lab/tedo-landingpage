"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import type { GrammarKey } from "@/components/grammar"
import { defineGrammarComponent, defineGrammarProjection } from "@/components/grammar/props"
import { RouteCtaAction } from "@/components/composites/RouteCtaAction"
import { ActionLink } from "@/components/leaves/ActionLink"

/**
 * Phone-only action bar pinned to the bottom of the viewport.
 *
 * Both client sites Tedo built (Phan Thanh Hoa, Thanh Nam) keep a hotline pinned
 * the whole way down the page, and both convert on it — Tedo's own site had no
 * equivalent, so a visitor who decided halfway had to scroll hunting for a button.
 *
 * Hidden until the hero has scrolled past: while the hero's own CTAs are still on
 * screen the bar would just cover content to repeat them.
 *
 * Desktop is excluded (`md:hidden`) because the header CTA stays reachable there.
 */
export const StickyCta = () => {
    const t = useTranslations("stickyCta")
    const [shown, setShown] = useState(false)

    useEffect(() => {
        const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const grammar: GrammarKey = shown ? "sticky-cta-bar-shown" : "sticky-cta-bar-hidden"

    return (
        <Tree
            grammar={grammar}
            render={defineGrammarComponent(grammar, {
                actions: defineGrammarComponent("sticky-cta-actions", {
                    ask: defineGrammarComponent("sticky-cta-action-slot", {
                        content: defineGrammarProjection("opaque-content-unit", () => (
                            <RouteCtaAction to="/chat" label={t("ask")} size="lg" />
                        )),
                    }),
                    book: defineGrammarComponent("sticky-cta-action-slot", {
                        content: defineGrammarProjection("opaque-content-unit", () => (
                            <ActionLink props={{ href: "#contact", content: t("book"), variant: "outline", size: "lg" }} />
                        )),
                    }),
                }),
            })}
        />
    )
}
