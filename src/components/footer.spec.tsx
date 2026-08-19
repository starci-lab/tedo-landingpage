import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { Footer } from "./footer"

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))

describe("Footer", () => {
    it("renders navigation, contact and legal identity", () => {
        const html = renderToStaticMarkup(<Footer />)
        expect(html).toContain("tagline")
        expect(html).toContain("#cases")
        expect(html).toContain("mailto:")
        expect(html).toContain("legalName")
    })
})
