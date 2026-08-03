import { useTranslations } from "next-intl"
import { Container } from "../ui"

type Metric = { value: string; label: string; detail: string }

export function Metrics() {
    const t = useTranslations("metrics")
    const items = t.raw("items") as Metric[]

    return (
        <section className="border-y border-line bg-surface/40 py-16">
            <Container>
                <h2 className="sr-only">{t("title")}</h2>

                <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item) => (
                        <div key={item.label} className="bg-canvas p-6">
                            <dt className="font-display text-4xl font-bold tracking-tight text-brand">
                                {item.value}
                            </dt>
                            <dd className="mt-3">
                                <p className="text-sm font-medium text-ink">
                                    {item.label}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                                    {item.detail}
                                </p>
                            </dd>
                        </div>
                    ))}
                </dl>

                <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-faint">
                    {t("footnote")}
                </p>
            </Container>
        </section>
    )
}
