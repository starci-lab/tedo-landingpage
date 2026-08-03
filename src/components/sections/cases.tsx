"use client"

import { useTranslations } from "next-intl"
import { Card, Chip, Separator } from "@heroui/react"
import { Link } from "@/i18n/routing"
import { Eyebrow, Section, SectionLead, SectionTitle } from "../ui"

type CaseStudy = {
    sector: string
    badge: string
    title: string
    body: string
    metric: string
    metricLabel: string
}

/**
 * Real projects only. CatMoc is deliberately kept ANONYMOUS here (shown as a
 * generic "B2B business system") — publishing its name or software details
 * without written consent falls under contract 01/010726/WS §7.1–7.2. Swap in
 * the real name once a signed consent email lands. See MO-HINH-KINH-DOANH.md §7.3.
 */
export function Cases() {
    const t = useTranslations("cases")
    const items = t.raw("items") as CaseStudy[]

    return (
        <Section id="cases" className="bg-surface/30">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>
            <SectionLead>{t("subtitle")}</SectionLead>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
                {items.map((item) => (
                    <Card key={item.title} className="flex flex-col">
                        <Card.Header>
                            <div className="flex items-center justify-between gap-3">
                                <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                                    {item.sector}
                                </span>
                                <Chip size="sm" variant="secondary">
                                    {item.badge}
                                </Chip>
                            </div>

                            <Card.Title className="mt-5 text-pretty text-lg font-medium leading-snug">
                                {item.title}
                            </Card.Title>
                            <Card.Description className="mt-3 text-sm leading-relaxed text-ink-muted">
                                {item.body}
                            </Card.Description>
                        </Card.Header>

                        <Card.Footer className="mt-auto flex-col items-start">
                            <Separator className="mb-5" />
                            <p className="font-display text-2xl font-bold text-brand">
                                {item.metric}
                            </p>
                            <p className="mt-1 text-xs text-ink-faint">
                                {item.metricLabel}
                            </p>
                        </Card.Footer>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <Link
                    href="/du-an"
                    className="group inline-flex items-center gap-1.5 font-medium text-brand transition-colors hover:text-brand-deep"
                >
                    {t("viewAll")}
                    <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                    >
                        →
                    </span>
                </Link>
            </div>
        </Section>
    )
}
