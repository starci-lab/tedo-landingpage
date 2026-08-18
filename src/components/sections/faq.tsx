"use client"

import { useTranslations } from "next-intl"
import { Accordion } from "@heroui/react"
import { Eyebrow, Section, SectionTitle } from "../ui"

type Faq = { q: string; a: string }

/** Answers common questions about the studio's work and process. */
export const Faq = () => {
    const t = useTranslations("faq")
    const items = t.raw("items") as Faq[]

    return (
        <Section id="faq" className="bg-surface/30">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>

            <Accordion className="mt-10 max-w-3xl">
                {items.map((item, i) => (
                    <Accordion.Item key={item.q} id={String(i)}>
                        <Accordion.Heading>
                            <Accordion.Trigger className="text-pretty font-medium">
                                {item.q}
                                <Accordion.Indicator />
                            </Accordion.Trigger>
                        </Accordion.Heading>
                        <Accordion.Panel>
                            <Accordion.Body className="max-w-2xl text-sm leading-relaxed text-ink-muted">
                                {item.a}
                            </Accordion.Body>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Section>
    )
}
