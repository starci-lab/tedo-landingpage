import { useTranslations } from "next-intl"
import { brand } from "@/config/brand"
import { Container } from "./ui"
import { Wordmark } from "./wordmark"

const LINKS = [
    { href: "#cases", key: "cases" },
    { href: "#ai-first", key: "aiFirst" },
    { href: "#process", key: "work" },
    { href: "#services", key: "services" },
    { href: "#engagement", key: "pricing" },
] as const

export function Footer() {
    const t = useTranslations("footer")
    const tNav = useTranslations("nav")
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-line bg-surface-2/60 py-14">
            <Container className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,1fr)]">
                <div className="max-w-xs">
                    <Wordmark />
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {t("tagline")}
                    </p>
                </div>

                <nav>
                    <p className="font-mono text-xs font-medium uppercase tracking-wider text-ink-faint">
                        {t("sections")}
                    </p>
                    <ul className="mt-4 flex flex-col gap-2.5">
                        {LINKS.map((link) => (
                            <li key={link.key}>
                                <a
                                    href={link.href}
                                    className="text-sm text-ink-muted transition-colors hover:text-brand"
                                >
                                    {tNav(link.key)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <p className="font-mono text-xs font-medium uppercase tracking-wider text-ink-faint">
                        {t("contactTitle")}
                    </p>
                    <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-muted">
                        <li>
                            <a
                                href={`mailto:${brand.email}`}
                                className="font-mono transition-colors hover:text-brand"
                            >
                                {brand.email}
                            </a>
                        </li>
                        <li className="font-mono">{brand.domain}</li>
                    </ul>
                </div>
            </Container>

            {/* Legal entity block — updated registration (Đà Nẵng, new ward). */}
            <Container className="mt-12 border-t border-line pt-6">
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-ink-faint">
                    {t("legalTitle")}
                </p>
                <div className="mt-3 grid gap-2 text-sm text-ink-muted sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] sm:gap-x-10">
                    <p className="font-semibold text-ink">{t("legalName")}</p>
                    <p>
                        <span className="text-ink-faint">{t("taxLabel")}: </span>
                        <span className="font-mono">{t("taxId")}</span>
                    </p>
                    <p className="sm:col-span-2">
                        <span className="text-ink-faint">{t("addressLabel")}: </span>
                        {t("address")}
                    </p>
                </div>
                <p className="mt-6 text-xs text-ink-faint">
                    © {year} {t("legalName")}. {t("rights")}
                </p>
            </Container>
        </footer>
    )
}
