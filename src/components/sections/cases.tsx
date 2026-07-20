"use client"

import { useTranslations } from "next-intl"
import { Card, Chip, Separator } from "@heroui/react"
import { Eyebrow, Section, SectionLead, SectionTitle } from "../ui"

type CaseStudy = {
    sector: string
    title: string
    body: string
    metric: string
    metricLabel: string
}

/**
 * TODO(content): every field here is placeholder copy pending client approval.
 * The "pending" chip stays until real, cleared numbers replace them — shipping
 * invented outcomes on an outsourcing page is a one-question-and-you-are-caught risk.
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
                                    {t("placeholderBadge")}
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
                            <p className="font-mono text-2xl font-semibold text-accent">
                                {item.metric}
                            </p>
                            <p className="mt-1 text-xs text-ink-faint">
                                {item.metricLabel}
                            </p>
                        </Card.Footer>
                    </Card>
                ))}
            </div>
        </Section>
    )
}
