"use client"

import { useLocale, useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { routing } from "@/i18n/routing"
import { brand } from "@/config/brand"
import { Container, CtaLink } from "./ui"

const NAV = [
    { href: "#services", key: "services" },
    { href: "#ai-first", key: "aiFirst" },
    { href: "#process", key: "work" },
    { href: "#cases", key: "cases" },
    { href: "#engagement", key: "pricing" },
] as const

export function Header() {
    const t = useTranslations("nav")
    const locale = useLocale()
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between gap-6">
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight"
                    aria-label={brand.name}
                >
                    {brand.name}
                    <span className="text-accent">.</span>
                </Link>

                <nav className="hidden items-center gap-7 lg:flex">
                    {NAV.map((item) => (
                        <a
                            key={item.key}
                            href={item.href}
                            className="text-sm text-ink-muted transition-colors hover:text-ink"
                        >
                            {t(item.key)}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <div
                        className="flex items-center rounded-full border border-line p-0.5"
                        role="group"
                        aria-label={t("language")}
                    >
                        {routing.locales.map((l) => (
                            <Link
                                key={l}
                                href={pathname}
                                locale={l}
                                aria-current={l === locale ? "true" : undefined}
                                className={`rounded-full px-2.5 py-1 font-mono text-xs uppercase transition-colors ${
                                    l === locale
                                        ? "bg-accent text-accent-ink"
                                        : "text-ink-faint hover:text-ink"
                                }`}
                            >
                                {l}
                            </Link>
                        ))}
                    </div>

                    <CtaLink href="#contact" size="sm">
                        {t("contact")}
                    </CtaLink>
                </div>
            </Container>
        </header>
    )
}
