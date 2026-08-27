import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectsGallery } from "@/components/sections/projects-gallery"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection } from "@/components/contracts/props"
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
            contract="landing-main"
            render={defineContractComponent("landing-main", {
                header: defineContractProjection("opaque-content-unit", () => <Header />),
                body: defineContractProjection("opaque-content-unit", () => (
                    <Tree
                        contract="route-body-with-back-nav"
                        render={defineContractComponent("route-body-with-back-nav", {
                            nav: defineContractComponent("back-link-row", {
                                link: defineContractProjection("opaque-content-unit", () => (
                                    <BackHomeAction label={`← ${t("back")}`} />
                                )),
                            }),
                            content: defineContractProjection("opaque-content-unit", () => <ProjectsGallery />),
                        })}
                    />
                )),
                footer: defineContractProjection("opaque-content-unit", () => <Footer />),
            })}
        />
    )
}

export default ProjectsPage
