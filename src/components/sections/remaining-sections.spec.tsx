import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { Aftercare } from "./aftercare"
import { AiFirst } from "./ai-first"
import { Cases } from "./cases"
import { Faq } from "./faq"
import { Fit } from "./fit"
import { Hero } from "./hero"
import { Process } from "./process"
import { Services } from "./services"

vi.mock("next-intl", () => ({
    useTranslations: () => Object.assign((key: string) => key, { raw: () => [] }),
}))
vi.mock("@/i18n/routing", () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => "/",
    Link: () => null,
    routing: { locales: ["vi"] },
}))

describe("remaining marketing sections", () => {
    it.each([
        ["aftercare", Aftercare],
        ["ai-first", AiFirst],
        ["cases", Cases],
        ["faq", Faq],
        ["fit", Fit],
        ["hero", Hero],
        ["process", Process],
        ["services", Services],
    ])("renders the %s section contract", (_name, Component) => {
        const html = renderToStaticMarkup(<Component />)
        expect(html).toContain("data-component=\"Tree\"")
    })
})
