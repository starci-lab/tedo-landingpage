import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"

type Metric = { value: string; label: string; detail: string }

/** Compact proof-point strip summarizing measurable outcomes. */
export const Metrics = () => {
    const t = useTranslations("metrics")
    const items = t.raw("items") as Metric[]

    return (
        <Tree
            grammar="metrics-band"
            render={defineGrammarComponent("metrics-band", {
                content: defineGrammarComponent("page-measure", {
                    content: defineGrammarComponent("metrics-block", {
                        heading: defineGrammarComponent("visually-hidden", {
                            content: defineGrammarProjection("opaque-content-unit", () => (
                                <Heading props={{ content: t("title"), level: 2 }} />
                            )),
                        }),
                        grid: defineGrammarComponent("metrics-grid", {
                            items: items.map((item) => defineGrammarComponent("metric-item", {
                                value: defineGrammarLeaf("text", {}, () => (
                                    <Text props={{ content: item.value, variant: "stat" }} />
                                )),
                                label: defineGrammarLeaf("text", {}, () => (
                                    <Text props={{ content: item.label, variant: "body" }} />
                                )),
                                detail: defineGrammarLeaf("text", {}, () => (
                                    <Text props={{ content: item.detail, variant: "body" }} />
                                )),
                            })),
                        }),
                        footnote: defineGrammarLeaf("text", {}, () => (
                            <Text props={{ content: t("footnote"), variant: "body" }} />
                        )),
                    }),
                }),
            })}
        />
    )
}
