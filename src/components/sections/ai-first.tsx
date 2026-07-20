"use client"

import { useTranslations } from "next-intl"
import { Card } from "@heroui/react"
import { Eyebrow, Section, SectionLead, SectionTitle } from "../ui"

type Item = { title: string; body: string }

export function AiFirst() {
    const t = useTranslations("aiFirst")
    const items = t.raw("items") as Item[]

    return (
        <Section id="ai-first">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>
            <SectionLead>{t("subtitle")}</SectionLead>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
                {items.map((item, i) => (
                    <Card key={item.title}>
                        <Card.Content className="flex flex-col gap-3">
                            <span className="font-mono text-xs text-accent">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <Card.Title className="text-pretty text-lg font-medium leading-snug">
                                {item.title}
                            </Card.Title>
                            <Card.Description className="text-sm leading-relaxed text-ink-muted">
                                {item.body}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                ))}
            </div>
        </Section>
    )
}
