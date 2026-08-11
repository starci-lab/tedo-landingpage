import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ConsultationChat } from "@/components/consultation/consultation-chat"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function generateMetadata({ params }: { params: Promise<{ locale: string; conversationId: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "consultation" })
    return { title: t("metaTitle"), description: t("metaDescription"), robots: { index: false, follow: false } }
}

export default async function SavedConsultationPage({ params }: { params: Promise<{ locale: string; conversationId: string }> }) {
    const { locale, conversationId } = await params
    if (!UUID_PATTERN.test(conversationId)) notFound()
    setRequestLocale(locale)
    return <ConsultationChat initialConversationId={conversationId} />
}
