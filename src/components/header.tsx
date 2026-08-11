"use client"

import { useLocale, useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/routing"
import { routing } from "@/i18n/routing"
import { Container, CtaLink } from "./ui"
import { Wordmark } from "./wordmark"

const NAV = [
    { href: "#cases", key: "cases" },
    { href: "#process", key: "work" },
    { href: "#services", key: "services" },
    { href: "#engagement", key: "pricing" },
] as const

export function Header() {
    const t = useTranslations("nav")
    const locale = useLocale()
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between gap-6">
                <Link href="/" aria-label="TEDO" className="shrink-0">
                    <Wordmark />
                </Link>

                <nav className="hidden items-center gap-7 lg:flex">
                    {NAV.map((item) => (
                        <a
                            key={item.key}
                            href={item.href}
                            className="text-sm font-medium text-ink-muted transition-colors hover:text-brand"
                        >
                            {t(item.key)}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <div
                        className="hidden items-center rounded-full border border-line p-0.5 sm:flex"
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
                                        ? "bg-brand text-white"
                                        : "text-ink-faint hover:text-brand"
                                }`}
                            >
                                {l}
                            </Link>
                        ))}
                    </div>

                    <CtaLink href="/chat" size="md">
                        {t("contact")}
                    </CtaLink>
                </div>
            </Container>
        </header>
    )
}
