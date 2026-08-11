"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

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
export function StickyCta() {
    const t = useTranslations("stickyCta")
    const [shown, setShown] = useState(false)

    useEffect(() => {
        const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur transition-transform duration-300 md:hidden ${
                shown ? "translate-y-0" : "translate-y-full"
            }`}
            /* Keeps the bar clear of the iOS home indicator. */
            style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
            <div className="flex items-center gap-2 px-4 pt-2">
                <Link
                    href="/chat"
                    className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-xl bg-accent px-4 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                    {t("ask")}
                </Link>
                <a
                    href="#contact"
                    className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-line-strong px-4 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                    {t("book")}
                </a>
            </div>
        </div>
    )
}
