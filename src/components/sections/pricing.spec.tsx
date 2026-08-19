import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { Pricing } from "./pricing"

vi.mock("next-intl", () => ({
    useTranslations: () => Object.assign((key: string) => key, {
        raw: (key: string) => key === "tiers"
            ? [{ name: "Starter", price: "10m", time: "4 tuần", body: "Core", points: ["A"], featured: true }, { name: "Basic", price: "20m", time: "6 tuần", body: "More", points: ["B"] }]
            : ["Included"],
    }),
}))

describe("Pricing", () => {
    it("renders featured and standard tiers with coverage lists", () => {
        const html = renderToStaticMarkup(<Pricing />)
        expect(html).toContain("Starter")
        expect(html).toContain("Basic")
        expect(html).toContain("Included")
        expect(html).toContain("cta")
    })
})
