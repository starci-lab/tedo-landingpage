import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { Design } from "./design"
import { Metrics } from "./metrics"
import { Stack } from "./stack"

vi.mock("next-intl", () => ({
    useTranslations: () => Object.assign((key: string) => key, { raw: () => [] }),
}))

describe("additional authored sections", () => {
    it.each([["design", Design], ["metrics", Metrics], ["stack", Stack]])("renders %s", (_name, Component) => {
        expect(renderToStaticMarkup(<Component />)).toContain("data-component=\"Tree\"")
    })
})
