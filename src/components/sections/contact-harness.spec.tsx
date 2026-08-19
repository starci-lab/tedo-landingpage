// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Contact } from "./contact"

vi.mock("next-intl", () => ({
    useTranslations: () => Object.assign((key: string) => key, { raw: () => ["Web app"] }),
}))

describe("Contact form handlers", () => {
    afterEach(() => vi.restoreAllMocks())

    it("posts the form and transitions to success", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }))
        render(<Contact />)
        fireEvent.submit(document.querySelector("form") as HTMLFormElement)
        await waitFor(() => expect(screen.getByText("success")).toBeTruthy())
        expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }))
    })

    it("shows the translated error after a failed request", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"))
        render(<Contact />)
        fireEvent.submit(document.querySelector("form") as HTMLFormElement)
        await waitFor(() => expect(screen.getByText(/error/)).toBeTruthy())
    })
})
