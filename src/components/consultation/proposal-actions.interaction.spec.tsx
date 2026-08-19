// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProposalActions } from "./proposal-actions"

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))

describe("ProposalActions interactions", () => {
    it("confirms, generates, and exposes returned documents", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(new Response(null, { status: 200 }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ id: "proposal-1", projectId: "p1", version: 1, documents: [{ id: "doc-1", kind: "proposal", fileName: "proposal.pdf", mimeType: "application/pdf" }] }), { status: 200 }))
        render(<ProposalActions projectId="p1" />)
        fireEvent.click(screen.getByRole("button", { name: "generate" }))
        expect(await screen.findByText("ready")).toBeTruthy()
        expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/projects/p1/confirm", expect.objectContaining({ method: "POST" }))
        expect(screen.getByText("proposal.pdf")).toBeTruthy()
    })

    it("shows an error when confirmation fails", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 400 }))
        render(<ProposalActions projectId="p2" />)
        fireEvent.click(screen.getByRole("button", { name: "generate" }))
        expect(await screen.findByText("error")).toBeTruthy()
    })
})
