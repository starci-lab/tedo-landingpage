import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import type { ContractKey } from "@/components/contracts"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
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
            contract="page-band"
            render={defineContractComponent("page-band", {
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
                                contract="engagement-card-grid"
                                render={defineContractComponent("engagement-card-grid", {
                                    items: items.map((model) => {
                                        const contract: ContractKey = model.featured ? "engagement-card-featured" : "engagement-card"
                                        return defineContractComponent(contract, {
                                            header: defineContractComponent("engagement-card-header", {
                                                name: defineLeafComponent("heading", {}, () => (
                                                    <Heading props={{ content: model.name, level: 3 }} />
                                                )),
                                                best: defineLeafComponent("text", {}, () => (
                                                    <Text props={{ content: model.best, variant: "label" }} />
                                                )),
                                                body: defineLeafComponent("text", {}, () => (
                                                    <Text props={{ content: model.body, variant: "body" }} />
                                                )),
                                            }),
                                            points: defineContractComponent("engagement-points-block", {
                                                divider: defineLeafComponent("separator", {}, () => <Separator props={{}} />),
                                                list: defineContractComponent("bullet-list", {
                                                    items: model.points.map((point) => defineContractComponent("labelled-bullet-item", {
                                                        mark: defineContractProjection("opaque-content-unit", () => (
                                                            <span aria-hidden className="mt-2 inline-block h-1 w-1 rounded-full bg-brand" />
                                                        )),
                                                        label: defineLeafComponent("text", {}, () => (
                                                            <Text props={{ content: point, variant: "body" }} />
                                                        )),
                                                    })),
                                                }),
                                            }),
                                            cta: defineLeafComponent("action-link", {}, () => (
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
