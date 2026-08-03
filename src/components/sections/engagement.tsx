"use client"

import { useTranslations } from "next-intl"
import { Card, Separator } from "@heroui/react"
import { CtaLink, Eyebrow, Section, SectionLead, SectionTitle } from "../ui"

type Model = {
    name: string
    best: string
    body: string
    points: string[]
    cta: string
    featured?: boolean
}

export function Engagement() {
    const t = useTranslations("engagement")
    const items = t.raw("items") as Model[]

    return (
        <Section id="engagement">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>
            <SectionLead>{t("subtitle")}</SectionLead>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
                {items.map((model) => (
                    <Card
                        key={model.name}
                        variant={model.featured ? "secondary" : "default"}
                        className={`flex flex-col ${
                            model.featured ? "ring-2 ring-accent/60" : ""
                        }`}
                    >
                        <Card.Header>
                            <Card.Title className="font-display text-xl font-semibold">
                                {model.name}
                            </Card.Title>
                            <p className="mt-1.5 text-xs font-medium text-brand">
                                {model.best}
                            </p>
                            <Card.Description className="mt-4 text-sm leading-relaxed text-ink-muted">
                                {model.body}
                            </Card.Description>
                        </Card.Header>

                        <Card.Content className="grow">
                            <Separator className="mb-5" />
                            <ul className="flex flex-col gap-2.5">
                                {model.points.map((point) => (
                                    <li
                                        key={point}
                                        className="flex gap-2.5 text-sm text-ink-muted"
                                    >
                                        <span
                                            aria-hidden
                                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand"
                                        />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </Card.Content>

                        <Card.Footer>
                            <CtaLink
                                href="#contact"
                                size="md"
                                variant={
                                    model.featured ? "primary" : "outline"
                                }
                                className="w-full"
                            >
                                {model.cta}
                            </CtaLink>
                        </Card.Footer>
                    </Card>
                ))}
            </div>
        </Section>
    )
}
