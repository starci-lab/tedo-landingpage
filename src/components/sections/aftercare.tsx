import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"

type Item = { value: string; title: string; body: string }

/**
 * What happens after handover, stated in hours and months.
 *
 * "What if it breaks later" is the objection that stalls the most small clients,
 * and the answer already exists in the grammar (12-month warranty, 12h/48h
 * response) — it was just never on the page. Numbers, not adjectives: a promise
 * with a clock on it is checkable, "chăm sóc tận tâm" is not.
 * // vn-ok: quoted customer-facing Vietnamese phrase retained as source content.
 */
export const Aftercare = () => {
    const t = useTranslations("aftercare")
    const items = t.raw("items") as Array<Item>

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
                                grammar="stat-card-grid"
                                render={defineGrammarComponent("stat-card-grid", {
                                    items: items.map((item) => defineGrammarComponent("stat-card", {
                                        value: defineGrammarLeaf("text", {}, () => (
                                            <Text props={{ content: item.value, variant: "stat" }} />
                                        )),
                                        title: defineGrammarLeaf("heading", {}, () => (
                                            <Heading props={{ content: item.title, level: 4 }} />
                                        )),
                                        body: defineGrammarLeaf("text", {}, () => (
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
