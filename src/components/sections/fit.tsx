"use client"

import { useTranslations } from "next-intl"
import { Eyebrow, Section, SectionLead, SectionTitle } from "../ui"

/**
 * Who the service suits, and who it does not.
 *
 * The "not a fit" column is the point. Turning work away raises trust and filters
 * out browsers who were never going to buy — and the sales deck already argues
 * this well (slide 7 of `PAID_SERVICE_TEDO`), it just never reached the website.
 */
export function Fit() {
    const t = useTranslations("fit")
    const yes = t.raw("yes") as Array<string>
    const no = t.raw("no") as Array<string>

    return (
        <Section id="phu-hop" className="bg-surface/30">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>
            <SectionLead>{t("subtitle")}</SectionLead>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-brand/30 bg-brand-soft/40 p-6 sm:p-7">
                    <h3 className="font-display text-base font-bold text-brand-deep">{t("yesTitle")}</h3>
                    <ul className="mt-4 flex flex-col gap-3">
                        {yes.map((item) => (
                            <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-body">
                                <span aria-hidden className="mt-0.5 shrink-0 text-green">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-3xl border border-line bg-white p-6 sm:p-7">
                    <h3 className="font-display text-base font-bold text-ink-muted">{t("noTitle")}</h3>
                    <ul className="mt-4 flex flex-col gap-3">
                        {no.map((item) => (
                            <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                                <span aria-hidden className="mt-0.5 shrink-0 text-ink-faint">✕</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <p className="mt-6 text-sm text-ink-muted">{t("note")}</p>
        </Section>
    )
}
