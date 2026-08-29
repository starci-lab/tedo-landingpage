import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"
import { Icon } from "@/components/leaves/Icon"

type Faq = { q: string; a: string }

/** Answers common questions about the studio's work and process. */
export const Faq = () => {
    const t = useTranslations("faq")
    const items = t.raw("items") as Faq[]

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
                                })}
                            />
                            <Tree
                                grammar="faq-list"
                                render={defineGrammarComponent("faq-list", {
                                    items: items.map((item) => defineGrammarComponent("faq-item", {
                                        content: defineGrammarProjection("opaque-content-unit", () => (
                                            <details>
                                                <summary className="faq-summary text-pretty font-medium">
                                                    {item.q}
                                                    <span className="faq-chevron">
                                                        <Icon props={{ name: "ChevronDownIcon", size: "sm" }} />
                                                    </span>
                                                </summary>
                                                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
                                            </details>
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
