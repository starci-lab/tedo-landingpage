import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { UserMessageContent } from "./user-message-content"

describe("UserMessageContent", () => {
    it("turns HTTP links into safe external anchors without interpreting HTML", () => {
        const html = renderToStaticMarkup(<UserMessageContent content={'Xem https://example.com và <script>alert("x")</script>'} />)
        expect(html).toContain('href="https://example.com"')
        expect(html).toContain('rel="noopener noreferrer"')
        expect(html).toContain("&lt;script&gt;")
        expect(html).not.toContain("<script>")
    })
})
