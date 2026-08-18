import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"

type Item = { title: string; body: string }

/** Explains the AI-first delivery approach and its practical outcomes. */
export const AiFirst = () => {
    const t = useTranslations("aiFirst")
    const items = t.raw("items") as Item[]

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
                                contract="insight-card-grid"
                                render={defineContractComponent("insight-card-grid", {
                                    items: items.map((item, i) => defineContractComponent("insight-card", {
                                        index: defineLeafComponent("text", {}, () => (
                                            <Text props={{ content: String(i + 1).padStart(2, "0"), variant: "label" }} />
                                        )),
                                        title: defineLeafComponent("heading", {}, () => (
                                            <Heading props={{ content: item.title, level: 4 }} />
                                        )),
                                        body: defineLeafComponent("text", {}, () => (
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
