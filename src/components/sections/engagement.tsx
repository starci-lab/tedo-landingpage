import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import type { GrammarKey } from "@/components/grammar"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"
import { Separator } from "@/components/leaves/Separator"
import { ActionLink } from "@/components/leaves/ActionLink"

type Model = {
    name: string
    best: string
    body: string
    points: string[]
    cta: string
    featured?: boolean
}

/** Compares the available engagement models and their included work. */
export const Engagement = () => {
    const t = useTranslations("engagement")
    const items = t.raw("items") as Model[]

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
                                grammar="engagement-card-grid"
                                render={defineGrammarComponent("engagement-card-grid", {
                                    items: items.map((model) => {
                                        const grammar: GrammarKey = model.featured ? "engagement-card-featured" : "engagement-card"
                                        return defineGrammarComponent(grammar, {
                                            header: defineGrammarComponent("engagement-card-header", {
                                                name: defineGrammarLeaf("heading", {}, () => (
                                                    <Heading props={{ content: model.name, level: 3 }} />
                                                )),
                                                best: defineGrammarLeaf("text", {}, () => (
                                                    <Text props={{ content: model.best, variant: "label" }} />
                                                )),
                                                body: defineGrammarLeaf("text", {}, () => (
                                                    <Text props={{ content: model.body, variant: "body" }} />
                                                )),
                                            }),
                                            points: defineGrammarComponent("engagement-points-block", {
                                                divider: defineGrammarLeaf("separator", {}, () => <Separator props={{}} />),
                                                list: defineGrammarComponent("bullet-list", {
                                                    items: model.points.map((point) => defineGrammarComponent("labelled-bullet-item", {
                                                        mark: defineGrammarProjection("opaque-content-unit", () => (
                                                            <span aria-hidden className="mt-2 inline-block h-1 w-1 rounded-full bg-brand" />
                                                        )),
                                                        label: defineGrammarLeaf("text", {}, () => (
                                                            <Text props={{ content: point, variant: "body" }} />
                                                        )),
                                                    })),
                                                }),
                                            }),
                                            cta: defineGrammarLeaf("action-link", {}, () => (
                                                <ActionLink
                                                    props={{ href: "#contact", content: model.cta, variant: model.featured ? "primary" : "outline", size: "md" }}
                                                />
                                            )),
                                        })
                                    }),
                                })}
                            />
                        </>
                    )),
                }),
            })}
        />
    )
}
