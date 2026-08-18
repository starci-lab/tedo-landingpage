"use client"

import { useTranslations } from "next-intl"
import { Eyebrow, Section, SectionLead, SectionTitle } from "../ui"

type Item = { value: string; title: string; body: string }

/**
 * What happens after handover, stated in hours and months.
 *
 * "What if it breaks later" is the objection that stalls the most small clients,
 * and the answer already exists in the contract (12-month warranty, 12h/48h
 * response) — it was just never on the page. Numbers, not adjectives: a promise
 * with a clock on it is checkable, "chăm sóc tận tâm" is not.
 * // vn-ok: quoted customer-facing Vietnamese phrase retained as source content.
 */
export const Aftercare = () => {
    const t = useTranslations("aftercare")
    const items = t.raw("items") as Array<Item>

    return (
        <Section id="sau-ban-giao">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>
            <SectionLead>{t("subtitle")}</SectionLead>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                    <article
                        key={item.title}
                        className="flex flex-col rounded-3xl border border-line bg-white p-6"
                    >
                        <p className="font-display text-2xl font-extrabold tracking-tight text-brand">
                            {item.value}
                        </p>
                        <h3 className="mt-2 font-display text-base font-semibold text-ink">
                            {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                    </article>
                ))}
            </div>
        </Section>
    )
}
