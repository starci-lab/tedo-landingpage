import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing, Link } from "@/i18n/routing"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectsGallery } from "@/components/sections/projects-gallery"
import { Container } from "@/components/ui"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "projects" })
    return {
        title: `${t("title")} — Tedo`,
        description: t("subtitle"),
    }
}

export default async function ProjectsPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) notFound()
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: "projects" })

    return (
        <>
            <Header />
            <main>
                <Container className="pt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted transition-colors hover:text-brand"
                    >
                        <span aria-hidden>←</span> {t("back")}
                    </Link>
                </Container>
                <ProjectsGallery />
            </main>
            <Footer />
        </>
    )
}
