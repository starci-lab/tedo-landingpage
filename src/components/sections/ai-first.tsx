import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"

type Item = { title: string; body: string }

/** Explains the AI-first delivery approach and its practical outcomes. */
export const AiFirst = () => {
    const t = useTranslations("aiFirst")
    const items = t.raw("items") as Item[]

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
                                    eyebrow: defineGrammarLeaf("text", {}, () => (
                                        <Text props={{ content: t("eyebrow"), variant: "eyebrow" }} />
                                    )),
                                    title: defineGrammarLeaf("heading", {}, () => (
                                        <Heading props={{ content: t("title"), level: 2 }} />
                                    )),
                                    lead: defineGrammarLeaf("text", {}, () => (
                                        <Text props={{ content: t("subtitle"), variant: "lead" }} />
                                    )),
                                })}
                            />
                            <Tree
                                grammar="insight-card-grid"
                                render={defineGrammarComponent("insight-card-grid", {
                                    items: items.map((item, i) => defineGrammarComponent("insight-card", {
                                        index: defineGrammarLeaf("text", {}, () => (
                                            <Text props={{ content: String(i + 1).padStart(2, "0"), variant: "label" }} />
                                        )),
                                        title: defineGrammarLeaf("heading", {}, () => (
                                            <Heading props={{ content: item.title, level: 4 }} />
                                        )),
                                        body: defineGrammarLeaf("text", {}, () => (
                                            <Text props={{ content: item.body, variant: "body" }} />
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
