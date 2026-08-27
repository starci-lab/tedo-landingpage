import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { sampleYabai } from "@/lib/quote/sample-yabai"
import { QuoteDocument } from "./quote-document"

vi.mock("next-intl", () => ({
    useTranslations: () => Object.assign(
        (key: string, values?: Record<string, string | number>) =>
            values ? `${key} ${Object.values(values).join(" ")}` : key,
        {
            rich: (key: string) => key,
        },
    ),
}))

describe("QuoteDocument", () => {
    it("renders the complete client proposal across numbered print sheets", () => {
        const html = renderToStaticMarkup(<QuoteDocument doc={sampleYabai} />)

        expect(html).toContain(sampleYabai.reference)
        expect(html).toContain(sampleYabai.client.name)
        expect(html).toContain("Ra mắt app đặt lịch nail đa chi nhánh")
        expect(html).toContain("Đặt lịch")
        expect(html).toContain("footer.page 1 7")
        expect(html.match(/<article class="quote-page/g)?.length).toBe(7)
    })

    it("renders optional and overflow pricing content without dropping the final group", () => {
        const expanded = {
            ...sampleYabai,
            groups: sampleYabai.groups.map((group) => ({
                ...group,
                lines: [...group.lines, ...group.lines],
            })),
        }
        const finalGroup = expanded.groups.at(-1)
        const html = renderToStaticMarkup(<QuoteDocument doc={expanded} />)

        expect(finalGroup).toBeDefined()
        expect(html).toContain(finalGroup?.title)
        expect(html).toContain(finalGroup?.lines.at(-1)?.label)
    })
})
