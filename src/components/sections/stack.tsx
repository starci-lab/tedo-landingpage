import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
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
            contract="page-band"
            render={defineContractComponent("page-band", {
                content: defineContractComponent("page-measure", {
                    content: defineContractProjection("opaque-content-unit", () => (
                        <>
                            <Tree
                                contract="section-intro"
                                render={defineContractComponent("section-intro", {
                                    title: defineLeafComponent("heading", {}, () => (
                                        <Heading props={{ content: t("title"), level: 2 }} />
                                    )),
                                    lead: defineLeafComponent("text", {}, () => (
                                        <Text props={{ content: t("subtitle"), variant: "lead" }} />
                                    )),
                                })}
                            />
                            <Tree
                                contract="stack-chip-list"
                                render={defineContractComponent("stack-chip-list", {
                                    items: STACK.map((tech) => defineContractComponent("stack-chip-item", {
                                        chip: defineLeafComponent("chip", {}, () => (
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
