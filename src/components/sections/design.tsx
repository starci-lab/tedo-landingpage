import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineLeafComponent } from "@/components/contracts/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"

type Step = { title: string; body: string }

/** Shows the design and delivery steps used for each project. */
export const Design = () => {
    const t = useTranslations("design")
    const steps = t.raw("steps") as Step[]

    return (
        <Tree
            contract="page-band-tinted"
            render={defineContractComponent("page-band-tinted", {
                content: defineContractComponent("page-measure", {
                    content: defineContractComponent("design-layout", {
                        intro: defineContractComponent("section-intro", {
                            eyebrow: defineLeafComponent("text", {}, () => (
                                <Text props={{ content: t("eyebrow"), variant: "eyebrow" }} />
                            )),
                            title: defineLeafComponent("heading", {}, () => (
                                <Heading props={{ content: t("title"), level: 2 }} />
                            )),
                            lead: defineLeafComponent("text", {}, () => (
                                <Text props={{ content: t("body"), variant: "lead" }} />
                            )),
                        }),
                        steps: defineContractComponent("design-step-list", {
                            items: steps.map((step, i) => defineContractComponent("design-step-item", {
                                index: defineContractComponent("design-step-index", {
                                    value: defineLeafComponent("text", {}, () => (
                                        <Text props={{ content: String(i + 1), variant: "label" }} />
                                    )),
                                }),
                                body: defineContractComponent("design-step-body", {
                                    title: defineLeafComponent("heading", {}, () => (
                                        <Heading props={{ content: step.title, level: 4 }} />
                                    )),
                                    body: defineLeafComponent("text", {}, () => (
                                        <Text props={{ content: step.body, variant: "body" }} />
                                    )),
                                }),
                            })),
                        }),
                    }),
                }),
            })}
        />
    )
}
