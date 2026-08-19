import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { sampleYabai } from "@/lib/quote/sample-yabai"
import { QuoteDocument } from "./quote-document"

vi.mock("next-intl", () => ({ useTranslations: () => Object.assign((key: string, values?: Record<string, string | number>) => values ? `${key} ${Object.values(values).join(" ")}` : key, { rich: (key: string) => key }) }))

describe("QuoteDocument renderer branches", () => {
    it("renders feature, phase, badge and maintenance alternatives", () => {
        const variant = {
            ...sampleYabai,
            client: { name: "Client" },
            features: sampleYabai.features.map((feature) => ({ ...feature, core: false })),
            outOfScope: [],
            phases: sampleYabai.phases.map((phase) => ({ ...phase, tag: undefined })),
            maintenancePercent: undefined,
            groups: [{ ...sampleYabai.groups[0], lines: [{ label: "No amount", detail: undefined }, { label: "Gift", badge: "gift" as const }, { label: "Included", badge: "included" as const }] }],
        }
        const html = renderToStaticMarkup(<QuoteDocument doc={variant} />)
        expect(html).toContain("No amount")
        expect(html).toContain("Gift")
        expect(html).toContain("Included")
        expect(html).not.toContain("features.core")
        expect(html).not.toContain("running.maintenanceDescription")
    })
})
