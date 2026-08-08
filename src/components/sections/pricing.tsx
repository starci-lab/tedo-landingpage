"use client"

import { useTranslations } from "next-intl"
import { CtaLink, Eyebrow, Section, SectionLead, SectionTitle } from "../ui"

type Tier = {
    name: string
    price: string
    time: string
    body: string
    points: Array<string>
    featured?: boolean
}

/**
 * Price ranges on the page.
 *
 * The single biggest gap the content audit found: small Vietnamese businesses
 * filter on budget before anything else, and a site with no number makes them
 * guess "expensive" and leave. See `content-plan.md` §1.4.
 *
 * Ranges, never a fixed number — `biz.md` §2.5 keeps the exact figure for
 * discovery, and the subtitle says so plainly so nothing here reads as a quote.
 */
export function Pricing() {
    const t = useTranslations("pricing")
    const tiers = t.raw("tiers") as Array<Tier>
    const included = t.raw("included") as Array<string>
    const excluded = t.raw("excluded") as Array<string>

    return (
        <Section id="bang-gia">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>
            <SectionLead>{t("subtitle")}</SectionLead>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
                {tiers.map((tier) => (
                    <article
                        key={tier.name}
                        className={`flex flex-col rounded-3xl border p-6 sm:p-7 ${
                            tier.featured
                                ? "border-brand bg-brand-soft/40 shadow-[0_24px_50px_-40px_rgba(20,48,92,0.5)]"
                                : "border-line bg-white"
                        }`}
                    >
                        <h3 className="font-display text-lg font-bold text-ink">{tier.name}</h3>
                        <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-brand-deep">
                            {tier.price}
                        </p>
                        <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-faint">
                            {tier.time}
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-ink-muted">{tier.body}</p>

                        <ul className="mt-5 flex flex-col gap-2.5">
                            {tier.points.map((point) => (
                                <li key={point} className="flex gap-2.5 text-sm text-ink-body">
                                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>

            {/* What the number covers, and what it deliberately does not. Stating the
                exclusions here is what stops "phát sinh" arguments later. */}
            <div className="mt-6 grid gap-5 rounded-3xl border border-line bg-surface-2/60 p-6 sm:grid-cols-2 sm:p-7">
                <div>
                    <h3 className="font-mono text-xs uppercase tracking-wide text-brand">
                        {t("includedTitle")}
                    </h3>
                    <ul className="mt-3 flex flex-col gap-2">
                        {included.map((item) => (
                            <li key={item} className="flex gap-2.5 text-sm text-ink-body">
                                <span aria-hidden className="text-green">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-mono text-xs uppercase tracking-wide text-ink-faint">
                        {t("excludedTitle")}
                    </h3>
                    <ul className="mt-3 flex flex-col gap-2">
                        {excluded.map((item) => (
                            <li key={item} className="flex gap-2.5 text-sm text-ink-muted">
                                <span aria-hidden className="text-ink-faint">–</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-6 rounded-3xl border-l-[3px] border-accent bg-accent/6 p-6 sm:p-7">
                <h3 className="font-display text-base font-semibold text-ink">
                    {t("instalmentTitle")}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-body">
                    {t("instalmentBody")}
                </p>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-muted">
                {t("savingNote")}
            </p>

            <div className="mt-8">
                <CtaLink href="#contact">{t("cta")}</CtaLink>
            </div>
        </Section>
    )
}
