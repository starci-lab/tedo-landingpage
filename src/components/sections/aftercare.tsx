import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"

type Item = { value: string; title: string; body: string }

/**
 * What happens after handover, stated in hours and months.
 *
 * "What if it breaks later" is the objection that stalls the most small clients,
 * and the answer already exists in the contract (12-month warranty, 12h/48h
 * response) — it was just never on the page. Numbers, not adjectives: a promise
 * with a clock on it is checkable, "chăm sóc tận tâm" is not.
 * // vn-ok: quoted customer-facing Vietnamese phrase retained as source content.
 */
export const Aftercare = () => {
    const t = useTranslations("aftercare")
    const items = t.raw("items") as Array<Item>

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
                                contract="stat-card-grid"
                                render={defineContractComponent("stat-card-grid", {
                                    items: items.map((item) => defineContractComponent("stat-card", {
                                        value: defineLeafComponent("text", {}, () => (
                                            <Text props={{ content: item.value, variant: "stat" }} />
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
