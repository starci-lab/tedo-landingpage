// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { ProjectsGallery } from "./projects-gallery"

vi.mock("next-intl", () => ({
    useTranslations: () => Object.assign((key: string) => key, {
        raw: () => [
            { category: "Commerce", badge: "Core", title: "Shop", tagline: "Sell", body: "Catalog", metric: "10k", metricLabel: "orders", stack: ["Next"], highlights: ["Fast"], image: "/shop.png" },
            { category: "Education", badge: "New", title: "Learn", tagline: "Study", body: "Courses", metric: "2k", metricLabel: "users", stack: [], highlights: [], pending: true },
        ],
    }),
}))
vi.mock("@/i18n/routing", () => ({
    useRouter: () => ({ push: vi.fn() }),
    Link: () => <a href="#contact">contact</a>,
    routing: { locales: ["vi"] },
    usePathname: () => "/du-an",
}))

describe("ProjectsGallery", () => {
    it("renders image and placeholder project branches with pending notes", () => {
        const html = renderToStaticMarkup(<ProjectsGallery />)
        expect(html).toContain("Shop")
        expect(html).toContain("Learn")
        expect(html).toContain("pendingImage")
        expect(html).toContain("gallery-cta-panel")
    })

    it("filters a category and restores all projects", () => {
        const { getByText, getByRole, queryByText } = render(<ProjectsGallery />)
        fireEvent.click(getByRole("button", { name: "Commerce" }))
        expect(getByText("Shop")).toBeTruthy()
        expect(queryByText("Learn")).toBeNull()
        fireEvent.click(getByRole("button", { name: "filterAll" }))
        expect(getByText("Learn")).toBeTruthy()
    })
})
