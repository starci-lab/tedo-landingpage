"use client"

import { useTranslations } from "next-intl"
import { openQuoteChat } from "./chat-widget"

/**
 * The lightest rung of the CTA ladder (`content-plan.md` §3).
 *
 * Every button on the page used to point at "book a call", which is the heaviest
 * ask there is — a stranger, a calendar slot, intent declared out loud. Visitors
 * who were only sizing us up had nowhere to go and left. This one answers the
 * budget question on the spot, costing them nothing.
 *
 * A real `<button>`, not a link: it opens the quote chat in place rather than
 * navigating, so nothing about it should read or behave as a destination.
 */
export function AskPriceButton({ className = "" }: { className?: string }) {
    const t = useTranslations("hero")

    return (
        <button
            type="button"
            onClick={openQuoteChat}
            className={`inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-6 text-base font-medium text-accent-ink shadow-[0_6px_18px_-6px_rgba(245,130,32,0.6)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-accent-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:translate-y-px ${className}`}
        >
            {t("ctaPrimary")}
        </button>
    )
}
