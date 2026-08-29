import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"

type Step = { title: string; body: string }

/** Shows the design and delivery steps used for each project. */
export const Design = () => {
    const t = useTranslations("design")
    const steps = t.raw("steps") as Step[]

    return (
        <Tree
            grammar="page-band-tinted"
            render={defineGrammarComponent("page-band-tinted", {
                content: defineGrammarComponent("page-measure", {
                    content: defineGrammarComponent("design-layout", {
                        intro: defineGrammarComponent("section-intro", {
                            eyebrow: defineGrammarLeaf("text", {}, () => (
                                <Text props={{ content: t("eyebrow"), variant: "eyebrow" }} />
                            )),
                            title: defineGrammarLeaf("heading", {}, () => (
                                <Heading props={{ content: t("title"), level: 2 }} />
                            )),
                            lead: defineGrammarLeaf("text", {}, () => (
                                <Text props={{ content: t("body"), variant: "lead" }} />
                            )),
                        }),
                        steps: defineGrammarComponent("design-step-list", {
                            items: steps.map((step, i) => defineGrammarComponent("design-step-item", {
                                index: defineGrammarComponent("design-step-index", {
                                    value: defineGrammarLeaf("text", {}, () => (
                                        <Text props={{ content: String(i + 1), variant: "label" }} />
                                    )),
                                }),
                                body: defineGrammarComponent("design-step-body", {
                                    title: defineGrammarLeaf("heading", {}, () => (
                                        <Heading props={{ content: step.title, level: 4 }} />
                                    )),
                                    body: defineGrammarLeaf("text", {}, () => (
                                        <Text props={{ content: step.body, variant: "body" }} />
                                    )),
                                }),
                            })),
                        }),
                    }),
                }),
            })}
        />
    )
}
