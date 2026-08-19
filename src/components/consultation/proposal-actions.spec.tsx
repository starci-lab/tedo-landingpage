import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
import { ProposalActions } from "./proposal-actions"
describe("ProposalActions", () => {
    it("renders the idle generation panel with its action", () => { const html = renderToStaticMarkup(<ProposalActions projectId="project-1" />); expect(html).toContain(">title<"); expect(html).toContain(">body<"); expect(html).toContain(">generate<") })
    it("does not call the API during initial render", () => { const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); renderToStaticMarkup(<ProposalActions projectId="project-2" />); expect(fetchMock).not.toHaveBeenCalled(); vi.unstubAllGlobals() })
})
