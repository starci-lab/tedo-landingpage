import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { QuoteDocument } from "@/components/quote/quote-document"
import { sampleYabai } from "@/lib/quote/sample-yabai"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"

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
        <Tree
            grammar="quote-preview-shell"
            render={defineGrammarComponent("quote-preview-shell", {
                toolbar: defineGrammarProjection("opaque-content-unit", () => (
                    <Tree
                        grammar="quote-preview-toolbar"
                        render={defineGrammarComponent("quote-preview-toolbar", {
                            row: defineGrammarComponent("quote-preview-toolbar-row", {
                                details: defineGrammarComponent("quote-preview-toolbar-details", {
                                    title: defineGrammarLeaf("text", {}, () => (
                                        <Text
                                            props={{
                                                // vn-ok: this is rendered quote-preview copy.
                                                content: "Preview mẫu báo giá",
                                                variant: "body",
                                            }}
                                        />
                                    )),
                                    meta: defineGrammarLeaf("text", {}, () => (
                                        <Text
                                            props={{
                                                // vn-ok: this is rendered quote-preview copy.
                                                content: `Dữ liệu mẫu: ${sampleYabai.client.name} · ${sampleYabai.reference}`,
                                                variant: "body",
                                            }}
                                        />
                                    )),
                                }),
                                hint: defineGrammarLeaf("text", {}, () => (
                                    <Text
                                        props={{
                                            // vn-ok: this is rendered quote-preview copy.
                                            content: "Ctrl/Cmd + P để xuất PDF · khổ A4 · bỏ header/footer trình duyệt",
                                            variant: "body",
                                        }}
                                    />
                                )),
                            }),
                        })}
                    />
                )),
                document: defineGrammarProjection("opaque-content-unit", () => (
                    <QuoteDocument doc={sampleYabai} />
                )),
            })}
        />
    )
}

export default QuotePreviewPage
