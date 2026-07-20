"use client"

import { useTranslations } from "next-intl"
import { Chip } from "@heroui/react"
import { Section, SectionLead, SectionTitle } from "../ui"

// Proper nouns — deliberately not translated.
const STACK = [
    "TypeScript",
    "React",
    "Next.js",
    "React Native",
    "Flutter",
    "Node.js",
    "NestJS",
    "Go",
    "Java",
    ".NET",
    "Python",
    "PostgreSQL",
    "Redis",
    "Kafka",
    "GraphQL",
    "Docker",
    "Kubernetes",
    "Terraform",
    "AWS",
    "GCP",
    "Azure",
    "GitHub Actions",
    "Qdrant",
    "Claude",
]

export function Stack() {
    const t = useTranslations("stack")

    return (
        <Section id="stack">
            <SectionTitle>{t("title")}</SectionTitle>
            <SectionLead>{t("subtitle")}</SectionLead>

            <ul className="mt-10 flex flex-wrap gap-2">
                {STACK.map((tech) => (
                    <li key={tech}>
                        <Chip variant="secondary" className="font-mono">
                            {tech}
                        </Chip>
                    </li>
                ))}
            </ul>
        </Section>
    )
}
