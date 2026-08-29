import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"
import { Separator } from "@/components/leaves/Separator"

type Service = { title: string; body: string; points: string[] }

/** Service cards describing the main engagement offers. */
export const Services = () => {
    const t = useTranslations("services")
    const items = t.raw("items") as Service[]

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
                                grammar="service-card-grid"
                                render={defineGrammarComponent("service-card-grid", {
                                    items: items.map((service) => defineGrammarComponent("service-card", {
                                        title: defineGrammarLeaf("heading", {}, () => (
                                            <Heading props={{ content: service.title, level: 3 }} />
                                        )),
                                        body: defineGrammarLeaf("text", {}, () => (
                                            <Text props={{ content: service.body, variant: "body" }} />
                                        )),
                                        points: defineGrammarComponent("service-points-block", {
                                            divider: defineGrammarLeaf("separator", {}, () => <Separator props={{}} />),
                                            list: defineGrammarComponent("bullet-list", {
                                                items: service.points.map((point) => defineGrammarComponent("labelled-bullet-item", {
                                                    mark: defineGrammarProjection("opaque-content-unit", () => (
                                                        <span aria-hidden className="mt-2 inline-block h-1 w-1 rounded-full bg-brand" />
                                                    )),
                                                    label: defineGrammarLeaf("text", {}, () => (
                                                        <Text props={{ content: point, variant: "body" }} />
                                                    )),
                                                })),
                                            }),
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
