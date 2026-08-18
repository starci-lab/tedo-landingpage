import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import type { ContractKey } from "@/components/contracts"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
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
    defineContractComponent("bullet-list", {
        items: items.map((item) => defineContractComponent("labelled-bullet-item", {
            mark: defineContractProjection("opaque-content-unit", () => (
                icon
                    ? <Icon props={{ name: icon, size: "sm" }} />
                    : <span aria-hidden className="mt-2 inline-block h-1 w-1 rounded-full bg-brand" />
            )),
            label: defineLeafComponent("text", {}, () => (
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
                                contract="pricing-tier-grid"
                                render={defineContractComponent("pricing-tier-grid", {
                                    items: tiers.map((tier) => {
                                        const contract: ContractKey = tier.featured ? "pricing-tier-card-featured" : "pricing-tier-card"
                                        return defineContractComponent(contract, {
                                            name: defineLeafComponent("heading", {}, () => (
                                                <Heading props={{ content: tier.name, level: 3 }} />
                                            )),
                                            price: defineLeafComponent("text", {}, () => (
                                                <Text props={{ content: tier.price, variant: "stat" }} />
                                            )),
                                            time: defineLeafComponent("text", {}, () => (
                                                <Text props={{ content: tier.time, variant: "label" }} />
                                            )),
                                            body: defineLeafComponent("text", {}, () => (
                                                <Text props={{ content: tier.body, variant: "body" }} />
                                            )),
                                            points: bulletList(tier.points),
                                        })
                                    }),
                                })}
                            />
                            <Tree
                                contract="pricing-coverage-panel"
                                render={defineContractComponent("pricing-coverage-panel", {
                                    included: defineContractComponent("pricing-coverage-column", {
                                        title: defineLeafComponent("heading", {}, () => (
                                            <Heading props={{ content: t("includedTitle"), level: 4 }} />
                                        )),
                                        list: bulletList(included, "CheckIcon"),
                                    }),
                                    excluded: defineContractComponent("pricing-coverage-column", {
                                        title: defineLeafComponent("heading", {}, () => (
                                            <Heading props={{ content: t("excludedTitle"), level: 4 }} />
                                        )),
                                        list: bulletList(excluded, "MinusIcon"),
                                    }),
                                })}
                            />
                            <Tree
                                contract="pricing-instalment-panel"
                                render={defineContractComponent("pricing-instalment-panel", {
                                    title: defineLeafComponent("heading", {}, () => (
                                        <Heading props={{ content: t("instalmentTitle"), level: 4 }} />
                                    )),
                                    body: defineLeafComponent("text", {}, () => (
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
