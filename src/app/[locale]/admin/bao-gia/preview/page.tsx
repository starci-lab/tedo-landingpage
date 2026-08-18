import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { QuoteDocument } from "@/components/quote/quote-document"
import { sampleYabai } from "@/lib/quote/sample-yabai"

/**
 * Design surface for the proposal template.
 *
 * This is the "page to update the template" — but deliberately a PREVIEW, not a
 * visual editor. It renders the real YABAI proposal so layout work happens against
 * copy that is as long and as uneven as the actual thing; lorem ipsum makes every
 * table look balanced and hides exactly the overflow bugs worth catching.
 *
 * Not indexed and not linked from anywhere public. It carries no live client data —
 * the fixture is a proposal already sent — so it needs no auth yet. The moment this
 * route starts reading real quotes from the database it must sit behind the admin
 * password, same as the rest of `/admin`.
 */
export const metadata: Metadata = {
    title: "Preview mẫu báo giá — Tedo",
    robots: { index: false, follow: false },
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function QuotePreviewPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) notFound()
    setRequestLocale(locale)

    return (
        <main>
            {/* Screen-only toolbar: gone from the printed sheet. */}
            <div className="border-b border-line bg-surface px-6 py-3 print:hidden">
                <div className="mx-auto flex max-w-[210mm] items-baseline justify-between gap-4">
                    <div>
                        <p className="font-display text-sm font-semibold text-ink">Preview mẫu báo giá</p>
                        <p className="text-xs text-ink-muted">
                            Dữ liệu mẫu: {sampleYabai.client.name} · {sampleYabai.reference}
                        </p>
                    </div>
                    <p className="text-xs text-ink-faint">Ctrl/Cmd + P để xuất PDF · khổ A4 · bỏ header/footer trình duyệt</p>
                </div>
            </div>

            <QuoteDocument doc={sampleYabai} />
        </main>
    )
}
