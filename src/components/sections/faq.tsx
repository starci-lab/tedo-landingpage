import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
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
                                })}
                            />
                            <Tree
                                contract="faq-list"
                                render={defineContractComponent("faq-list", {
                                    items: items.map((item) => defineContractComponent("faq-item", {
                                        content: defineContractProjection("opaque-content-unit", () => (
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
