import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ConsultationChat } from "@/components/consultation/consultation-chat"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type SavedConsultationParams = {
    params: Promise<{ locale: string; conversationId: string }>
}

/** Supplies localized metadata for a saved consultation route. */
export const generateMetadata = async ({ params }: SavedConsultationParams): Promise<Metadata> => {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "consultation" })
    return { title: t("metaTitle"), description: t("metaDescription"), robots: { index: false, follow: false } }
}

/** Renders a consultation restored from a validated conversation id. */
const SavedConsultationPage = async ({ params }: SavedConsultationParams) => {
    const { locale, conversationId } = await params
    if (!UUID_PATTERN.test(conversationId)) notFound()
    setRequestLocale(locale)
    return <ConsultationChat initialConversationId={conversationId} />
}

export default SavedConsultationPage
