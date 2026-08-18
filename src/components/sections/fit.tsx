import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"
import { Icon } from "@/components/leaves/Icon"

/**
 * Who the service suits, and who it does not.
 *
 * The "not a fit" column is the point. Turning work away raises trust and filters
 * out browsers who were never going to buy — and the sales deck already argues
 * this well (slide 7 of `PAID_SERVICE_TEDO`), it just never reached the website.
 */
export const Fit = () => {
    const t = useTranslations("fit")
    const yes = t.raw("yes") as Array<string>
    const no = t.raw("no") as Array<string>

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
                                contract="fit-comparison-grid"
                                render={defineContractComponent("fit-comparison-grid", {
                                    yes: defineContractComponent("fit-column", {
                                        title: defineLeafComponent("heading", {}, () => (
                                            <Heading props={{ content: t("yesTitle"), level: 3 }} />
                                        )),
                                        items: defineContractComponent("bullet-list", {
                                            items: yes.map((item) => defineContractComponent("labelled-bullet-item", {
                                                mark: defineContractProjection("opaque-content-unit", () => (
                                                    <Icon props={{ name: "CheckIcon", size: "sm" }} />
                                                )),
                                                label: defineLeafComponent("text", {}, () => (
                                                    <Text props={{ content: item, variant: "body" }} />
                                                )),
                                            })),
                                        }),
                                    }),
                                    no: defineContractComponent("fit-column", {
                                        title: defineLeafComponent("heading", {}, () => (
                                            <Heading props={{ content: t("noTitle"), level: 3 }} />
                                        )),
                                        items: defineContractComponent("bullet-list", {
                                            items: no.map((item) => defineContractComponent("labelled-bullet-item", {
                                                mark: defineContractProjection("opaque-content-unit", () => (
                                                    <Icon props={{ name: "XMarkIcon", size: "sm" }} />
                                                )),
                                                label: defineLeafComponent("text", {}, () => (
                                                    <Text props={{ content: item, variant: "body" }} />
                                                )),
                                            })),
                                        }),
                                    }),
                                })}
                            />
                            <Text props={{ content: t("note"), variant: "body" }} />
                        </>
                    )),
                }),
            })}
        />
    )
}
