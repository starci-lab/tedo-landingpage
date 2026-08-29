import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
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
                                grammar="fit-comparison-grid"
                                render={defineGrammarComponent("fit-comparison-grid", {
                                    yes: defineGrammarComponent("fit-column", {
                                        title: defineGrammarLeaf("heading", {}, () => (
                                            <Heading props={{ content: t("yesTitle"), level: 3 }} />
                                        )),
                                        items: defineGrammarComponent("bullet-list", {
                                            items: yes.map((item) => defineGrammarComponent("labelled-bullet-item", {
                                                mark: defineGrammarProjection("opaque-content-unit", () => (
                                                    <Icon props={{ name: "CheckIcon", size: "sm" }} />
                                                )),
                                                label: defineGrammarLeaf("text", {}, () => (
                                                    <Text props={{ content: item, variant: "body" }} />
                                                )),
                                            })),
                                        }),
                                    }),
                                    no: defineGrammarComponent("fit-column", {
                                        title: defineGrammarLeaf("heading", {}, () => (
                                            <Heading props={{ content: t("noTitle"), level: 3 }} />
                                        )),
                                        items: defineGrammarComponent("bullet-list", {
                                            items: no.map((item) => defineGrammarComponent("labelled-bullet-item", {
                                                mark: defineGrammarProjection("opaque-content-unit", () => (
                                                    <Icon props={{ name: "XMarkIcon", size: "sm" }} />
                                                )),
                                                label: defineGrammarLeaf("text", {}, () => (
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
