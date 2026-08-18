import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"

type Step = { step: string; title: string; body: string; duration: string }

/** Four-step delivery process and indicative timing. */
export const Process = () => {
    const t = useTranslations("process")
    const items = t.raw("items") as Step[]

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
                                })}
                            />
                            <Tree
                                contract="process-step-grid"
                                render={defineContractComponent("process-step-grid", {
                                    items: items.map((item) => defineContractComponent("process-step-card", {
                                        index: defineLeafComponent("text", {}, () => (
                                            <Text props={{ content: item.step, variant: "label" }} />
                                        )),
                                        title: defineLeafComponent("heading", {}, () => (
                                            <Heading props={{ content: item.title, level: 4 }} />
                                        )),
                                        body: defineContractComponent("process-step-body", {
                                            content: defineLeafComponent("text", {}, () => (
                                                <Text props={{ content: item.body, variant: "body" }} />
                                            )),
                                        }),
                                        duration: defineContractComponent("process-step-duration", {
                                            content: defineLeafComponent("text", {}, () => (
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
