import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"
import { Chip } from "@/components/leaves/Chip"
import { Separator } from "@/components/leaves/Separator"
import { RouteCtaAction } from "@/components/composites/RouteCtaAction"

type CaseStudy = {
    sector: string
    badge: string
    title: string
    body: string
    metric: string
    metricLabel: string
}

/**
 * Real projects only. CatMoc is deliberately kept ANONYMOUS here (shown as a
 * generic "B2B business system") — publishing its name or software details
 * without written consent falls under grammar 01/010726/WS §7.1–7.2. Swap in
 * the real name once a signed consent email lands. See MO-HINH-KINH-DOANH.md §7.3.
 */
export const Cases = () => {
    const t = useTranslations("cases")
    const items = t.raw("items") as CaseStudy[]

    return (
        <Tree
            grammar="page-band-tinted"
            render={defineGrammarComponent("page-band-tinted", {
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
                                grammar="case-card-grid"
                                render={defineGrammarComponent("case-card-grid", {
                                    items: items.map((item) => defineGrammarComponent("case-card", {
                                        header: defineGrammarComponent("case-card-header", {
                                            meta: defineGrammarComponent("case-card-meta-row", {
                                                sector: defineGrammarLeaf("text", {}, () => (
                                                    <Text props={{ content: item.sector, variant: "label" }} />
                                                )),
                                                badge: defineGrammarLeaf("chip", {}, () => (
                                                    <Chip props={{ content: item.badge, variant: "secondary", size: "sm" }} />
                                                )),
                                            }),
                                            title: defineGrammarLeaf("heading", {}, () => (
                                                <Heading props={{ content: item.title, level: 4 }} />
                                            )),
                                            body: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: item.body, variant: "body" }} />
                                            )),
                                        }),
                                        footer: defineGrammarComponent("case-card-footer", {
                                            divider: defineGrammarLeaf("separator", {}, () => <Separator props={{}} />),
                                            metric: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: item.metric, variant: "stat" }} />
                                            )),
                                            metricLabel: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: item.metricLabel, variant: "body" }} />
                                            )),
                                        }),
                                    })),
                                })}
                            />
                            <RouteCtaAction to="/du-an" label={t("viewAll")} variant="ghost" size="sm" />
                        </>
                    )),
                }),
            })}
        />
    )
}
