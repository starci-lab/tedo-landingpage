import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import type { GrammarKey } from "@/components/grammar"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"
import { Icon } from "@/components/leaves/Icon"
import { ActionLink } from "@/components/leaves/ActionLink"

type Tier = {
    name: string
    price: string
    time: string
    body: string
    points: Array<string>
    featured?: boolean
}

const bulletList = (items: Array<string>, icon?: "CheckIcon" | "MinusIcon") =>
    defineGrammarComponent("bullet-list", {
        items: items.map((item) => defineGrammarComponent("labelled-bullet-item", {
            mark: defineGrammarProjection("opaque-content-unit", () => (
                icon
                    ? <Icon props={{ name: icon, size: "sm" }} />
                    : <span aria-hidden className="mt-2 inline-block h-1 w-1 rounded-full bg-brand" />
            )),
            label: defineGrammarLeaf("text", {}, () => (
                <Text props={{ content: item, variant: "body" }} />
            )),
        })),
    })

/**
 * Price ranges on the page.
 *
 * The single biggest gap the content audit found: small Vietnamese businesses
 * filter on budget before anything else, and a site with no number makes them
 * guess "expensive" and leave. See `content-plan.md` §1.4.
 *
 * Ranges, never a fixed number — `biz.md` §2.5 keeps the exact figure for
 * discovery, and the subtitle says so plainly so nothing here reads as a quote.
 */
export const Pricing = () => {
    const t = useTranslations("pricing")
    const tiers = t.raw("tiers") as Array<Tier>
    const included = t.raw("included") as Array<string>
    const excluded = t.raw("excluded") as Array<string>

    return (
        <Tree
            grammar="page-band"
            render={defineGrammarComponent("page-band", {
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
                                grammar="pricing-tier-grid"
                                render={defineGrammarComponent("pricing-tier-grid", {
                                    items: tiers.map((tier) => {
                                        const grammar: GrammarKey = tier.featured ? "pricing-tier-card-featured" : "pricing-tier-card"
                                        return defineGrammarComponent(grammar, {
                                            name: defineGrammarLeaf("heading", {}, () => (
                                                <Heading props={{ content: tier.name, level: 3 }} />
                                            )),
                                            price: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: tier.price, variant: "stat" }} />
                                            )),
                                            time: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: tier.time, variant: "label" }} />
                                            )),
                                            body: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: tier.body, variant: "body" }} />
                                            )),
                                            points: bulletList(tier.points),
                                        })
                                    }),
                                })}
                            />
                            <Tree
                                grammar="pricing-coverage-panel"
                                render={defineGrammarComponent("pricing-coverage-panel", {
                                    included: defineGrammarComponent("pricing-coverage-column", {
                                        title: defineGrammarLeaf("heading", {}, () => (
                                            <Heading props={{ content: t("includedTitle"), level: 4 }} />
                                        )),
                                        list: bulletList(included, "CheckIcon"),
                                    }),
                                    excluded: defineGrammarComponent("pricing-coverage-column", {
                                        title: defineGrammarLeaf("heading", {}, () => (
                                            <Heading props={{ content: t("excludedTitle"), level: 4 }} />
                                        )),
                                        list: bulletList(excluded, "MinusIcon"),
                                    }),
                                })}
                            />
                            <Tree
                                grammar="pricing-instalment-panel"
                                render={defineGrammarComponent("pricing-instalment-panel", {
                                    title: defineGrammarLeaf("heading", {}, () => (
                                        <Heading props={{ content: t("instalmentTitle"), level: 4 }} />
                                    )),
                                    body: defineGrammarLeaf("text", {}, () => (
                                        <Text props={{ content: t("instalmentBody"), variant: "body" }} />
                                    )),
                                })}
                            />
                            <Text props={{ content: t("savingNote"), variant: "body" }} />
                            <ActionLink props={{ href: "#contact", content: t("cta") }} />
                        </>
                    )),
                }),
            })}
        />
    )
}
