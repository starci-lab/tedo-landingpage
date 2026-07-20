import { useTranslations } from "next-intl"
import { brand } from "@/config/brand"
import { Container, CtaLink, Eyebrow } from "../ui"

export function Hero() {
    const t = useTranslations("hero")

    return (
        <section className="relative overflow-hidden">
            {/* Accent glow anchored behind the headline, not a full-width wash —
                keeps the eye on the first line instead of the whole viewport. */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]"
            />

            <Container className="relative py-24 sm:py-32">
                <Eyebrow>{t("eyebrow")}</Eyebrow>

                <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                    {t("title")}{" "}
                    <span className="text-accent">{t("titleAccent")}</span>
                </h1>

                <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
                    {t("subtitle")}
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <CtaLink href={brand.calendarUrl} external>
                        {t("ctaPrimary")}
                    </CtaLink>
                    <CtaLink href="#ai-first" variant="outline">
                        {t("ctaSecondary")}
                    </CtaLink>
                </div>

                <p className="mt-5 font-mono text-xs text-ink-faint">
                    {t("note")}
                </p>
            </Container>
        </section>
    )
}
