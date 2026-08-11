import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ConsultationChat } from "@/components/consultation/consultation-chat"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "consultation" })
    return { title: t("metaTitle"), description: t("metaDescription"), robots: { index: false, follow: false } }
}

export default async function ConsultationPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    setRequestLocale(locale)
    return <ConsultationChat />
}
