import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectsGallery } from "@/components/sections/projects-gallery"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection } from "@/components/grammar/props"
import { BackHomeAction } from "@/components/composites/BackHomeAction"

type LocaleParams = { params: Promise<{ locale: string }> }

/** Provides the locales generated for the projects route. */
export const generateStaticParams = () => {
    return routing.locales.map((locale) => ({ locale }))
}

/** Supplies localized metadata for the projects route. */
export const generateMetadata = async ({
    params,
}: LocaleParams): Promise<Metadata> => {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "projects" })
    return {
        title: `${t("title")} — Tedo`,
        description: t("subtitle"),
    }
}

/** Renders the localized projects gallery page. */
const ProjectsPage = async ({ params }: LocaleParams) => {
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) notFound()
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: "projects" })

    return (
        <Tree
            grammar="landing-main"
            render={defineGrammarComponent("landing-main", {
                header: defineGrammarProjection("opaque-content-unit", () => <Header />),
                body: defineGrammarProjection("opaque-content-unit", () => (
                    <Tree
                        grammar="route-body-with-back-nav"
                        render={defineGrammarComponent("route-body-with-back-nav", {
                            nav: defineGrammarComponent("back-link-row", {
                                link: defineGrammarProjection("opaque-content-unit", () => (
                                    <BackHomeAction label={`← ${t("back")}`} />
                                )),
                            }),
                            content: defineGrammarProjection("opaque-content-unit", () => <ProjectsGallery />),
                        })}
                    />
                )),
                footer: defineGrammarProjection("opaque-content-unit", () => <Footer />),
            })}
        />
    )
}

export default ProjectsPage
