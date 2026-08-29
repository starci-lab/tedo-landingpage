import { useTranslations } from "next-intl"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { ActionLink } from "@/components/leaves/ActionLink"
import { LeadPrompt } from "@/components/consultation/lead-prompt"
import { Hero3DVisual } from "@/components/hero-3d-visual"

/** Primary landing-page hero with the lead prompt and product visual. */
export const Hero = () => {
    const t = useTranslations("hero")

    return (
        <Tree
            grammar="hero-section"
            render={defineGrammarComponent("hero-section", {
                content: defineGrammarComponent("hero-measure", {
                    message: defineGrammarProjection("opaque-content-unit", () => (
                        <>
                            <Text props={{ content: t("eyebrow"), variant: "eyebrow" }} />
                            <Heading props={{ content: t("title"), accent: t("titleAccent"), level: 1 }} />
                            <Text props={{ content: t("subtitle"), variant: "lead" }} />
                            <LeadPrompt />
                            <Tree
                                grammar="hero-cta-row"
                                render={defineGrammarComponent("hero-cta-row", {
                                    primary: defineGrammarLeaf("action-link", {}, () => (
                                        <ActionLink props={{ href: "#cases", content: t("ctaSecondary"), variant: "outline" }} />
                                    )),
                                })}
                            />
                        </>
                    )),
                    visual: defineGrammarProjection("opaque-content-unit", () => <Hero3DVisual />),
                }),
            })}
        />
    )
}
