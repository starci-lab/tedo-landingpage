import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"

type Step = { step: string; title: string; body: string; duration: string }

/** Four-step delivery process and indicative timing. */
export const Process = () => {
    const t = useTranslations("process")
    const items = t.raw("items") as Step[]

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
                                })}
                            />
                            <Tree
                                grammar="process-step-grid"
                                render={defineGrammarComponent("process-step-grid", {
                                    items: items.map((item) => defineGrammarComponent("process-step-card", {
                                        index: defineGrammarLeaf("text", {}, () => (
                                            <Text props={{ content: item.step, variant: "label" }} />
                                        )),
                                        title: defineGrammarLeaf("heading", {}, () => (
                                            <Heading props={{ content: item.title, level: 4 }} />
                                        )),
                                        body: defineGrammarComponent("process-step-body", {
                                            content: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: item.body, variant: "body" }} />
                                            )),
                                        }),
                                        duration: defineGrammarComponent("process-step-duration", {
                                            content: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: item.duration, variant: "label" }} />
                                            )),
                                        }),
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
