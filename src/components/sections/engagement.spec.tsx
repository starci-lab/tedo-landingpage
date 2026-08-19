import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { Engagement } from "./engagement"

vi.mock("next-intl", () => ({
    useTranslations: () => Object.assign((key: string) => key, {
        raw: () => [{ name: "Partner", best: "Best for teams", body: "Flexible", points: ["Planning"], cta: "Choose", featured: true }, { name: "Starter", best: "Best for pilots", body: "Focused", points: [], cta: "Ask" }],
    }),
}))

describe("Engagement", () => {
    it("renders featured and standard engagement cards", () => {
        const html = renderToStaticMarkup(<Engagement />)
        expect(html).toContain("Partner")
        expect(html).toContain("Starter")
        expect(html).toContain("Planning")
        expect(html).toContain("Choose")
    })
})
