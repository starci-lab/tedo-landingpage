import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Be_Vietnam_Pro } from "next/font/google"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { SkyBackground } from "@/components/sky-background"
import { ChatWidget } from "@/components/chat-widget"
import "../globals.css"

// Be Vietnam Pro supports Vietnamese diacritics well in both headings and body
// copy. Exposed as CSS variables so the @theme font tokens use the same family.
const display = Be_Vietnam_Pro({
    subsets: ["latin", "latin-ext"],
    variable: "--font-display",
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
})

const body = Be_Vietnam_Pro({
    subsets: ["latin", "latin-ext"],
    variable: "--font-sans",
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
})

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "meta" })

    return {
        title: t("title"),
        description: t("description"),
    }
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) notFound()

    setRequestLocale(locale)

    return (
        <html
            lang={locale}
            className={`light ${display.variable} ${body.variable}`}
        >
            <body className="font-sans">
                <SkyBackground />
                <NextIntlClientProvider>
                    {children}
                    <ChatWidget />
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
