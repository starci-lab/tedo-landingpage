import { useTranslations } from "next-intl"
import { brand } from "@/config/brand"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
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
            contract="site-footer"
            render={defineContractComponent("site-footer", {
                columns: defineContractComponent("footer-columns", {
                    brand: defineContractComponent("footer-brand-block", {
                        mark: defineContractProjection("opaque-content-unit", () => <Wordmark />),
                        tagline: defineLeafComponent("text", {}, () => (
                            <Text props={{ content: t("tagline"), variant: "body" }} />
                        )),
                    }),
                    sections: defineContractComponent("footer-nav-column", {
                        label: defineLeafComponent("text", {}, () => (
                            <Text props={{ content: t("sections"), variant: "label" }} />
                        )),
                        items: defineContractComponent("footer-link-list", {
                            items: defineContractProjection("opaque-content-unit", () => (
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
                    contact: defineContractComponent("footer-contact-column", {
                        label: defineLeafComponent("text", {}, () => (
                            <Text props={{ content: t("contactTitle"), variant: "label" }} />
                        )),
                        items: defineContractComponent("footer-contact-list", {
                            email: defineContractProjection("opaque-content-unit", () => (
                                <li>
                                    <a
                                        href={`mailto:${brand.email}`}
                                        className="font-mono text-sm text-ink-muted transition-colors hover:text-brand"
                                    >
                                        {brand.email}
                                    </a>
                                </li>
                            )),
                            domain: defineContractProjection("opaque-content-unit", () => (
                                <li>
                                    <span className="font-mono text-sm text-ink-muted">{brand.domain}</span>
                                </li>
                            )),
                        }),
                    }),
                }),
                legal: defineContractComponent("footer-legal", {
                    label: defineLeafComponent("text", {}, () => (
                        <Text props={{ content: t("legalTitle"), variant: "label" }} />
                    )),
                    grid: defineContractComponent("footer-legal-grid-entry", {
                        name: defineContractProjection("opaque-content-unit", () => (
                            <p className="text-sm font-semibold text-ink">{t("legalName")}</p>
                        )),
                        tax: defineContractProjection("opaque-content-unit", () => (
                            <p className="text-sm text-ink-muted">
                                <span className="text-ink-faint">{t("taxLabel")}: </span>
                                <span className="font-mono">{t("taxId")}</span>
                            </p>
                        )),
                        address: defineContractComponent("footer-legal-address", {
                            content: defineContractProjection("opaque-content-unit", () => (
                                <p className="text-sm text-ink-muted">
                                    <span className="text-ink-faint">{t("addressLabel")}: </span>
                                    {t("address")}
                                </p>
                            )),
                        }),
                    }),
                    copyright: defineLeafComponent("text", {}, () => (
                        <Text
                            props={{
                                content: `${String.fromCharCode(0xa9)} ${year} ${t("legalName")}. ${t("rights")}`,
                                variant: "body",
                            }}
                        />
                    )),
                }),
            })}
        />
    )
}
