import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
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
 * without written consent falls under contract 01/010726/WS §7.1–7.2. Swap in
 * the real name once a signed consent email lands. See MO-HINH-KINH-DOANH.md §7.3.
 */
export const Cases = () => {
    const t = useTranslations("cases")
    const items = t.raw("items") as CaseStudy[]

    return (
        <Tree
            contract="page-band-tinted"
            render={defineContractComponent("page-band-tinted", {
                content: defineContractComponent("page-measure", {
                    content: defineContractProjection("opaque-content-unit", () => (
                        <>
                            <Tree
                                contract="section-intro"
                                render={defineContractComponent("section-intro", {
                                    eyebrow: defineLeafComponent("text", {}, () => (
                                        <Text props={{ content: t("eyebrow"), variant: "eyebrow" }} />
                                    )),
                                    title: defineLeafComponent("heading", {}, () => (
                                        <Heading props={{ content: t("title"), level: 2 }} />
                                    )),
                                    lead: defineLeafComponent("text", {}, () => (
                                        <Text props={{ content: t("subtitle"), variant: "lead" }} />
                                    )),
                                })}
                            />
                            <Tree
                                contract="case-card-grid"
                                render={defineContractComponent("case-card-grid", {
                                    items: items.map((item) => defineContractComponent("case-card", {
                                        header: defineContractComponent("case-card-header", {
                                            meta: defineContractComponent("case-card-meta-row", {
                                                sector: defineLeafComponent("text", {}, () => (
                                                    <Text props={{ content: item.sector, variant: "label" }} />
                                                )),
                                                badge: defineLeafComponent("chip", {}, () => (
                                                    <Chip props={{ content: item.badge, variant: "secondary", size: "sm" }} />
                                                )),
                                            }),
                                            title: defineLeafComponent("heading", {}, () => (
                                                <Heading props={{ content: item.title, level: 4 }} />
                                            )),
                                            body: defineLeafComponent("text", {}, () => (
                                                <Text props={{ content: item.body, variant: "body" }} />
                                            )),
                                        }),
                                        footer: defineContractComponent("case-card-footer", {
                                            divider: defineLeafComponent("separator", {}, () => <Separator props={{}} />),
                                            metric: defineLeafComponent("text", {}, () => (
                                                <Text props={{ content: item.metric, variant: "stat" }} />
                                            )),
                                            metricLabel: defineLeafComponent("text", {}, () => (
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
