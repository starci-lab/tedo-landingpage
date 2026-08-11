import { setRequestLocale } from "next-intl/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import { Hero } from "@/components/sections/hero"
import { Services } from "@/components/sections/services"
import { Design } from "@/components/sections/design"
import { Process } from "@/components/sections/process"
import { Cases } from "@/components/sections/cases"
import { Fit } from "@/components/sections/fit"
import { Pricing } from "@/components/sections/pricing"
import { Aftercare } from "@/components/sections/aftercare"
import { Engagement } from "@/components/sections/engagement"
import { Stack } from "@/components/sections/stack"
import { Faq } from "@/components/sections/faq"
import { Contact } from "@/components/sections/contact"
import { StickyCta } from "@/components/sticky-cta"

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    setRequestLocale(locale)

    return (
        <>
            <Header />
            {/* Order follows the buyer's questions, not our org chart — see
                `content-plan.md` §2. Proof sits directly under the hero because
                nothing said after it lands before the visitor believes anyone has
                done this before; price sits mid-page because budget is the filter
                small clients apply first, and filtering early saves both sides. */}
            <main>
                <Hero />
                <Reveal><Cases /></Reveal>
                <Reveal><Fit /></Reveal>
                <Reveal><Services /></Reveal>
                <Reveal><Pricing /></Reveal>
                <Reveal><Process /></Reveal>
                <Reveal><Aftercare /></Reveal>
                <Reveal><Engagement /></Reveal>
                <Reveal><Design /></Reveal>
                <Reveal><Stack /></Reveal>
                <Reveal><Faq /></Reveal>
                <Reveal><Contact /></Reveal>
            </main>
            <Footer />
            <StickyCta />
        </>
    )
}
