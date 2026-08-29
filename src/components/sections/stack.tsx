import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"
import { Chip } from "@/components/leaves/Chip"

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

/** Technology ecosystem used across delivered products. */
export const Stack = () => {
    const t = useTranslations("stack")

    return (
        <Tree
            grammar="page-band"
            render={defineGrammarComponent("page-band", {
                content: defineGrammarComponent("page-measure", {
                    content: defineGrammarProjection("opaque-content-unit", () => (
                        <>
                            <Tree
                                grammar="section-intro"
                                render={defineGrammarComponent("section-intro", {
                                    title: defineGrammarLeaf("heading", {}, () => (
                                        <Heading props={{ content: t("title"), level: 2 }} />
                                    )),
                                    lead: defineGrammarLeaf("text", {}, () => (
                                        <Text props={{ content: t("subtitle"), variant: "lead" }} />
                                    )),
                                })}
                            />
                            <Tree
                                grammar="stack-chip-list"
                                render={defineGrammarComponent("stack-chip-list", {
                                    items: STACK.map((tech) => defineGrammarComponent("stack-chip-item", {
                                        chip: defineGrammarLeaf("chip", {}, () => (
                                            <Chip props={{ content: tech, variant: "secondary" }} />
                                        )),
                                    })),
                                })}
                            />
                        </>
                    )),
                }),
            })}
        />
    )
}
