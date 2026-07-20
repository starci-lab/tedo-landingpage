import { useTranslations } from "next-intl"
import { brand } from "@/config/brand"
import { Container } from "./ui"

const LINKS = [
    { href: "#services", key: "services" },
    { href: "#ai-first", key: "aiFirst" },
    { href: "#process", key: "work" },
    { href: "#cases", key: "cases" },
    { href: "#engagement", key: "pricing" },
] as const

export function Footer() {
    const t = useTranslations("footer")
    const tNav = useTranslations("nav")
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-line py-14">
            <Container className="grid gap-10 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                    <p className="text-lg font-semibold tracking-tight">
                        {brand.name}
                        <span className="text-accent">.</span>
                    </p>
                    <p className="mt-2 text-sm text-ink-muted">
                        {t("tagline")}
                    </p>
                </div>

                <nav>
                    <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                        {t("sections")}
                    </p>
                    <ul className="mt-4 flex flex-col gap-2.5">
                        {LINKS.map((link) => (
                            <li key={link.key}>
                                <a
                                    href={link.href}
                                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                                >
                                    {tNav(link.key)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                        {t("contactTitle")}
                    </p>
                    <ul className="mt-4 flex flex-col gap-2.5 font-mono text-sm text-ink-muted">
                        <li>
                            <a
                                href={`mailto:${brand.email}`}
                                className="transition-colors hover:text-ink"
                            >
                                {brand.email}
                            </a>
                        </li>
                        <li>{brand.domain}</li>
                    </ul>
                </div>
            </Container>

            <Container className="mt-12 border-t border-line pt-6">
                <p className="text-xs text-ink-faint">
                    © {year} {brand.name}. {t("rights")}
                </p>
            </Container>
        </footer>
    )
}
