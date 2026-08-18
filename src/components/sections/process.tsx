import { useTranslations } from "next-intl"
import { Eyebrow, Section, SectionTitle } from "../ui"

type Step = { step: string; title: string; body: string; duration: string }

/** Four-step delivery process and indicative timing. */
export const Process = () => {
    const t = useTranslations("process")
    const items = t.raw("items") as Step[]

    return (
        <Section id="process">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle>{t("title")}</SectionTitle>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                    <div
                        key={item.step}
                        className="flex flex-col bg-canvas p-6"
                    >
                        <span className="font-mono text-xs font-semibold text-brand">
                            {item.step}
                        </span>
                        <h3 className="mt-4 text-lg font-medium">
                            {item.title}
                        </h3>
                        <p className="mt-2 grow text-sm leading-relaxed text-ink-muted">
                            {item.body}
                        </p>
                        <p className="mt-5 border-t border-line pt-4 font-mono text-xs text-ink-faint">
                            {item.duration}
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    )
}
