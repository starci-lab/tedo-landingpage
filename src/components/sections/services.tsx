"use client"

import { useTranslations } from "next-intl"
import { Card, Separator } from "@heroui/react"
import { Eyebrow, Section, SectionLead, SectionTitle } from "../ui"

type Service = { title: string; body: string; points: string[] }

/** Service cards describing the main engagement offers. */
export const Services = () => {
    const t = useTranslations("services")
    const items = t.raw("items") as Service[]

    return (
        <Section id="services">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>
            <SectionLead>{t("subtitle")}</SectionLead>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
                {items.map((service) => (
                    <Card key={service.title} className="flex flex-col">
                        <Card.Header>
                            <Card.Title className="text-pretty text-xl font-medium leading-snug">
                                {service.title}
                            </Card.Title>
                            <Card.Description className="mt-3 text-sm leading-relaxed text-ink-muted">
                                {service.body}
                            </Card.Description>
                        </Card.Header>

                        <Card.Content>
                            <Separator className="mb-5" />
                            <ul className="flex flex-col gap-2">
                                {service.points.map((point) => (
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
                    </Card>
                ))}
            </div>
        </Section>
    )
}
