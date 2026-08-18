import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
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
                                contract="service-card-grid"
                                render={defineContractComponent("service-card-grid", {
                                    items: items.map((service) => defineContractComponent("service-card", {
                                        title: defineLeafComponent("heading", {}, () => (
                                            <Heading props={{ content: service.title, level: 3 }} />
                                        )),
                                        body: defineLeafComponent("text", {}, () => (
                                            <Text props={{ content: service.body, variant: "body" }} />
                                        )),
                                        points: defineContractComponent("service-points-block", {
                                            divider: defineLeafComponent("separator", {}, () => <Separator props={{}} />),
                                            list: defineContractComponent("bullet-list", {
                                                items: service.points.map((point) => defineContractComponent("labelled-bullet-item", {
                                                    mark: defineContractProjection("opaque-content-unit", () => (
                                                        <span aria-hidden className="mt-2 inline-block h-1 w-1 rounded-full bg-brand" />
                                                    )),
                                                    label: defineLeafComponent("text", {}, () => (
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
