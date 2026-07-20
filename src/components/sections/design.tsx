import { useTranslations } from "next-intl"
import { Eyebrow, Section, SectionTitle } from "../ui"

type Step = { title: string; body: string }

export function Design() {
    const t = useTranslations("design")
    const steps = t.raw("steps") as Step[]

    return (
        <Section id="design" className="bg-surface/30">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
                <div>
                    <Eyebrow>{t("eyebrow")}</Eyebrow>
                    <SectionTitle>{t("title")}</SectionTitle>
                    <p className="mt-5 text-pretty text-base leading-relaxed text-ink-muted">
                        {t("body")}
                    </p>
                </div>

                <ol className="flex flex-col">
                    {steps.map((step, i) => (
                        <li
                            key={step.title}
                            className="flex gap-5 border-b border-line py-5 first:pt-0 last:border-0 last:pb-0"
                        >
                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-dim font-mono text-xs text-accent">
                                {i + 1}
                            </span>
                            <div>
                                <h3 className="font-medium">{step.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                                    {step.body}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </Section>
    )
}
