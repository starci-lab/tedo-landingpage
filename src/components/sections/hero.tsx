import { useTranslations } from "next-intl"
import { Container, CtaLink, Eyebrow } from "../ui"
import { LeadPrompt } from "../consultation/lead-prompt"
import { Hero3DVisual } from "../hero-3d-visual"

/** Primary landing-page hero with the lead prompt and product visual. */
export const Hero = () => {
    const t = useTranslations("hero")

    return (
        <section className="relative overflow-hidden">
            <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
                {/* ---- message (left on desktop) ---- */}
                <div>
                    <Eyebrow>{t("eyebrow")}</Eyebrow>

                    <h1 className="max-w-xl text-balance font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                        {t("title")}{" "}
                        <span className="text-accent">{t("titleAccent")}</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
                        {t("subtitle")}
                    </p>

                    <LeadPrompt />

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <CtaLink href="#cases" variant="outline">
                            {t("ctaSecondary")}
                        </CtaLink>
                    </div>

                </div>

                {/* ---- 3D system visual (right on desktop, top on mobile) ---- */}
                <div>
                    <Hero3DVisual />
                </div>
            </Container>
        </section>
    )
}
