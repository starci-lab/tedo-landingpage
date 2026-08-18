"use client"

import { useLocale, useTranslations } from "next-intl"
import { Link, usePathname, routing } from "@/i18n/routing"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection } from "@/components/contracts/props"
import { HomeLink } from "@/components/composites/HomeLink"
import { RouteCtaAction } from "@/components/composites/RouteCtaAction"

const NAV = [
    { href: "#cases", key: "cases" },
    { href: "#process", key: "work" },
    { href: "#services", key: "services" },
    { href: "#engagement", key: "pricing" },
] as const

const LOCALE_ACTIVE_CLASSES = "rounded-full px-3 py-1 font-mono text-xs uppercase transition-colors bg-brand text-white"
const LOCALE_INACTIVE_CLASSES = "rounded-full px-3 py-1 font-mono text-xs uppercase transition-colors text-ink-faint hover:text-brand"

/** Sticky site header with primary navigation, locale switcher, and contact CTA. */
export const Header = () => {
    const t = useTranslations("nav")
    const locale = useLocale()
    const pathname = usePathname()

    return (
        <Tree
            contract="site-header"
            render={defineContractComponent("site-header", {
                bar: defineContractComponent("page-measure", {
                    content: defineContractComponent("header-bar", {
                        logo: defineContractProjection("opaque-content-unit", () => (
                            <HomeLink label="TEDO" />
                        )),
                        nav: defineContractComponent("header-nav", {
                            items: defineContractProjection("opaque-content-unit", () => (
                                <>
                                    {NAV.map((item) => (
                                        <a
                                            key={item.key}
                                            href={item.href}
                                            className="text-sm font-medium text-ink-muted transition-colors hover:text-brand"
                                        >
                                            {t(item.key)}
                                        </a>
                                    ))}
                                </>
                            )),
                        }),
                        actions: defineContractComponent("header-actions", {
                            localeSwitcher: defineContractComponent("locale-switcher-group", {
                                options: defineContractProjection("opaque-content-unit", () => (
                                    <>
                                        {routing.locales.map((l) => (
                                            <Link
                                                key={l}
                                                href={pathname}
                                                locale={l}
                                                aria-current={l === locale ? "true" : undefined}
                                                className={l === locale ? LOCALE_ACTIVE_CLASSES : LOCALE_INACTIVE_CLASSES}
                                            >
                                                {l}
                                            </Link>
                                        ))}
                                    </>
                                )),
                            }),
                            cta: defineContractProjection("opaque-content-unit", () => (
                                <RouteCtaAction to="/chat" label={t("contact")} size="md" />
                            )),
                        }),
                    }),
                }),
            })}
        />
    )
}
