import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"

type Metric = { value: string; label: string; detail: string }

/** Compact proof-point strip summarizing measurable outcomes. */
export const Metrics = () => {
    const t = useTranslations("metrics")
    const items = t.raw("items") as Metric[]

    return (
        <Tree
            contract="metrics-band"
            render={defineContractComponent("metrics-band", {
                content: defineContractComponent("page-measure", {
                    content: defineContractComponent("metrics-block", {
                        heading: defineContractComponent("visually-hidden", {
                            content: defineContractProjection("opaque-content-unit", () => (
                                <Heading props={{ content: t("title"), level: 2 }} />
                            )),
                        }),
                        grid: defineContractComponent("metrics-grid", {
                            items: items.map((item) => defineContractComponent("metric-item", {
                                value: defineLeafComponent("text", {}, () => (
                                    <Text props={{ content: item.value, variant: "stat" }} />
                                )),
                                label: defineLeafComponent("text", {}, () => (
                                    <Text props={{ content: item.label, variant: "body" }} />
                                )),
                                detail: defineLeafComponent("text", {}, () => (
                                    <Text props={{ content: item.detail, variant: "body" }} />
                                )),
                            })),
                        }),
                        footnote: defineLeafComponent("text", {}, () => (
                            <Text props={{ content: t("footnote"), variant: "body" }} />
                        )),
                    }),
                }),
            })}
        />
    )
}
