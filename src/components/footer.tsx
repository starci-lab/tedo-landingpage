import { useTranslations } from "next-intl"
import { brand } from "@/config/brand"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Wordmark } from "@/components/leaves/Wordmark"

const LINKS = [
    { href: "#cases", key: "cases" },
    { href: "#process", key: "work" },
    { href: "#services", key: "services" },
    { href: "#engagement", key: "pricing" },
] as const

/** Site footer with navigation, contact details, and legal information. */
export const Footer = () => {
    const t = useTranslations("footer")
    const tNav = useTranslations("nav")
    const year = new Date().getFullYear()

    return (
        <Tree
            grammar="site-footer"
            render={defineGrammarComponent("site-footer", {
                columns: defineGrammarComponent("footer-columns", {
                    brand: defineGrammarComponent("footer-brand-block", {
                        mark: defineGrammarProjection("opaque-content-unit", () => <Wordmark />),
                        tagline: defineGrammarLeaf("text", {}, () => (
                            <Text props={{ content: t("tagline"), variant: "body" }} />
                        )),
                    }),
                    sections: defineGrammarComponent("footer-nav-column", {
                        label: defineGrammarLeaf("text", {}, () => (
                            <Text props={{ content: t("sections"), variant: "label" }} />
                        )),
                        items: defineGrammarComponent("footer-link-list", {
                            items: defineGrammarProjection("opaque-content-unit", () => (
                                <>
                                    {LINKS.map((link) => (
                                        <li key={link.key}>
                                            <a
                                                href={link.href}
                                                className="-mx-1 min-h-11 rounded px-1 text-sm text-ink-muted transition-colors hover:text-brand"
                                            >
                                                {tNav(link.key)}
                                            </a>
                                        </li>
                                    ))}
                                </>
                            )),
                        }),
                    }),
                    contact: defineGrammarComponent("footer-contact-column", {
                        label: defineGrammarLeaf("text", {}, () => (
                            <Text props={{ content: t("contactTitle"), variant: "label" }} />
                        )),
                        items: defineGrammarComponent("footer-contact-list", {
                            email: defineGrammarProjection("opaque-content-unit", () => (
                                <li>
                                    <a
                                        href={`mailto:${brand.email}`}
                                        className="font-mono text-sm text-ink-muted transition-colors hover:text-brand"
                                    >
                                        {brand.email}
                                    </a>
                                </li>
                            )),
                            domain: defineGrammarProjection("opaque-content-unit", () => (
                                <li>
                                    <span className="font-mono text-sm text-ink-muted">{brand.domain}</span>
                                </li>
                            )),
                        }),
                    }),
                }),
                legal: defineGrammarComponent("footer-legal", {
                    label: defineGrammarLeaf("text", {}, () => (
                        <Text props={{ content: t("legalTitle"), variant: "label" }} />
                    )),
                    grid: defineGrammarComponent("footer-legal-grid-entry", {
                        name: defineGrammarProjection("opaque-content-unit", () => (
                            <p className="text-sm font-semibold text-ink">{t("legalName")}</p>
                        )),
                        tax: defineGrammarProjection("opaque-content-unit", () => (
                            <p className="text-sm text-ink-muted">
                                <span className="text-ink-faint">{t("taxLabel")}: </span>
                                <span className="font-mono">{t("taxId")}</span>
                            </p>
                        )),
                        address: defineGrammarComponent("footer-legal-address", {
                            content: defineGrammarProjection("opaque-content-unit", () => (
                                <p className="text-sm text-ink-muted">
                                    <span className="text-ink-faint">{t("addressLabel")}: </span>
                                    {t("address")}
                                </p>
                            )),
                        }),
                    }),
                    copyright: defineGrammarLeaf("text", {}, () => (
                        <Text
                            props={{
                                content: `${String.fromCodePoint(0xa9)} ${year} ${t("legalName")}. ${t("rights")}`,
                                variant: "body",
                            }}
                        />
                    )),
                }),
            })}
        />
    )
}
