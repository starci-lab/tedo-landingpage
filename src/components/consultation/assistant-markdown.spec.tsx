import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { AssistantMarkdown } from "./assistant-markdown"

describe("AssistantMarkdown", () => {
    it("renders emphasis, lists, and quote tables as HTML instead of raw Markdown", () => {
        const html = renderToStaticMarkup(
            <AssistantMarkdown content={"## Báo giá\n\n**Tổng:** 30.000.000 VND\n\n- UX/UI\n\n| Hạng mục | Giá |\n|---|---:|\n| Website | 30 triệu |"} />,
        )

        expect(html).toContain("<h3")
        expect(html).toContain("<strong")
        expect(html).toContain("<ul")
        expect(html).toContain("<table")
        expect(html).not.toContain("**Tổng:**")
    })
})
