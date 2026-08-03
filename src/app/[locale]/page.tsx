import { setRequestLocale } from "next-intl/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import { Hero } from "@/components/sections/hero"
import { Metrics } from "@/components/sections/metrics"
import { AiFirst } from "@/components/sections/ai-first"
import { Services } from "@/components/sections/services"
import { Design } from "@/components/sections/design"
import { Process } from "@/components/sections/process"
import { Cases } from "@/components/sections/cases"
import { Engagement } from "@/components/sections/engagement"
import { Stack } from "@/components/sections/stack"
import { Faq } from "@/components/sections/faq"
import { Contact } from "@/components/sections/contact"

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
            <main>
                <Hero />
                <Reveal><Metrics /></Reveal>
                <Reveal><Cases /></Reveal>
                <Reveal><AiFirst /></Reveal>
                <Reveal><Services /></Reveal>
                <Reveal><Design /></Reveal>
                <Reveal><Process /></Reveal>
                <Reveal><Engagement /></Reveal>
                <Reveal><Stack /></Reveal>
                <Reveal><Faq /></Reveal>
                <Reveal><Contact /></Reveal>
            </main>
            <Footer />
        </>
    )
}
