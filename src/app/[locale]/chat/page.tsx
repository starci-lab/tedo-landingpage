import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ConsultationChat } from "@/components/consultation/consultation-chat"

type LocaleParams = { params: Promise<{ locale: string }> }

/** Supplies localized metadata for the consultation route. */
export const generateMetadata = async ({ params }: LocaleParams): Promise<Metadata> => {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "consultation" })
    return { title: t("metaTitle"), description: t("metaDescription"), robots: { index: false, follow: false } }
}

/** Renders the consultation chat entry point. */
const ConsultationPage = async ({ params }: LocaleParams) => {
    const { locale } = await params
    setRequestLocale(locale)
    return <ConsultationChat />
}

export default ConsultationPage
