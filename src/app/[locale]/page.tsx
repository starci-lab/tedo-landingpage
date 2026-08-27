import { setRequestLocale } from "next-intl/server"
import { TedoV6 } from "@/grammars/tedo"

type HomePageParams = { params: Promise<{ locale: string }> }

/** Renders the Tedo V6 AI-first outsourcing landing page. */
const HomePage = async ({ params }: HomePageParams) => {
    const { locale } = await params
    setRequestLocale(locale)

    return <TedoV6 locale={locale} />
}

export default HomePage
