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
    title: "Preview mẫu báo giá — Tedo", // vn-ok: this is the user-facing route metadata.
    robots: { index: false, follow: false },
}

/** Provides the locale variants for the static quote preview route. */
export const generateStaticParams = () => {
    return routing.locales.map((locale) => ({ locale }))
}

type QuotePreviewPageProps = {
    params: Promise<{ locale: string }>
}

/** Renders the admin-only proposal preview using the checked-in sample document. */
const QuotePreviewPage = async ({
    params,
}: QuotePreviewPageProps) => {
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) notFound()
    setRequestLocale(locale)

    return (
        <main>
            {/* Screen-only toolbar: gone from the printed sheet. */}
            <div className="border-b border-line bg-surface px-6 py-3 print:hidden">
                <div className="mx-auto flex max-w-[210mm] items-baseline justify-between gap-4">
                    <div>
                        <p className="font-display text-sm font-semibold text-ink">Preview mẫu báo giá</p> {/* vn-ok: this is rendered quote-preview copy. */}
                        <p className="text-xs text-ink-muted">
                            Dữ liệu mẫu: {sampleYabai.client.name} · {sampleYabai.reference} {/* vn-ok: this is rendered quote-preview copy. */}
                        </p>
                    </div>
                    <p className="text-xs text-ink-faint">Ctrl/Cmd + P để xuất PDF · khổ A4 · bỏ header/footer trình duyệt</p> {/* vn-ok: this is rendered quote-preview copy. */}
                </div>
            </div>

            <QuoteDocument doc={sampleYabai} />
        </main>
    )
}

export default QuotePreviewPage
