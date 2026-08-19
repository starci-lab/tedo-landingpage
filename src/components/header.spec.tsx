import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { Header } from "./header"

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key, useLocale: () => "vi" }))
vi.mock("@/i18n/routing", () => ({
    routing: { locales: ["vi", "en"] },
    usePathname: () => "/",
    useRouter: () => ({ push: vi.fn() }),
    Link: () => <a href="#locale">locale</a>,
}))
vi.mock("@/components/composites/HomeLink", () => ({ HomeLink: () => <button type="button">TEDO</button> }))
vi.mock("@/components/composites/RouteCtaAction", () => ({ RouteCtaAction: () => <a href="#contact">contact</a> }))

describe("Header", () => {
    it("renders navigation, locale choices, and contact action", () => {
        const html = renderToStaticMarkup(<Header />)
        expect(html).toContain("#cases")
        expect(html).toContain("#locale")
        expect(html).toContain("contact")
    })
})
