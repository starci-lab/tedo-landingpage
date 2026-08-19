// @vitest-environment jsdom
import { act } from "react"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { AssistantMarkdown } from "./assistant-markdown"

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe("AssistantMarkdown streaming", () => {
    it("invokes all supported Markdown renderers", () => {
        const { container } = render(<AssistantMarkdown content={"# H1\n\n### H3\n\n1. ordered\n\n> quoted\n\n[link](https://tedo.vn) `inline`\n\n```ts\nconst value = 1\n```\n\n---"} />)
        expect(container.querySelector("h2")).toBeTruthy()
        expect(container.querySelector("h4")).toBeTruthy()
        expect(container.querySelector("ol")).toBeTruthy()
        expect(container.querySelector("blockquote")).toBeTruthy()
        expect(container.querySelector("a[href='https://tedo.vn']")).toBeTruthy()
        expect(container.querySelector("code")).toBeTruthy()
        expect(container.querySelector("hr")).toBeTruthy()
    })

    it("reveals an animated response over timer ticks and cleans up", async () => {
        vi.useFakeTimers()
        const { container } = render(<AssistantMarkdown content="Streaming answer" animate />)
        expect(container.textContent).toContain("Streaming answer")
        await act(async () => { vi.advanceTimersByTime(100) })
        expect(container.querySelector("[aria-hidden='true']")).toBeTruthy()
        vi.useRealTimers()
    })
})
