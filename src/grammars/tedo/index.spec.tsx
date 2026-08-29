// @vitest-environment jsdom

import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TedoV6 } from "./index"

const push = vi.fn()

vi.mock("@/i18n/routing", () => ({ useRouter: () => ({ push }) }))
vi.mock("@/components/consultation/lead-prompt", () => ({ LeadPrompt: () => <div>consultation-chatbot</div> }))

describe("TedoV6", () => {
    it("renders TEDO as an AI-first outsourcing company with delivery proof", () => {
        render(<TedoV6 locale="vi" />)

        expect(screen.getByRole("heading", { level: 1, name: /Một đội outsourcing.*Vận hành AI-first/i })).toBeTruthy()
        expect(screen.getByRole("heading", { name: /Con người giữ trách nhiệm[\s\S]*Agents mở rộng năng lực đội ngũ/i })).toBeTruthy()
        expect(screen.getByRole("heading", { name: /Từ project brief đầu tiên/i })).toBeTruthy()
        expect(screen.getAllByText("Tiếp nhận dự án").length).toBeGreaterThan(0)
        expect(screen.getByText("UX/UI design")).toBeTruthy()
        expect(screen.getAllByText(/YABAI NAIL/i).length).toBeGreaterThan(0)
        expect(screen.getByText("YABAI NAIL / DELIVERY RECEIPT")).toBeTruthy()
        expect(screen.getByRole("button", { name: /Bắt đầu cùng TEDO/i })).toBeTruthy()
    })

    it("renders the English grammar for English locale", () => {
        render(<TedoV6 locale="en" />)

        expect(screen.getByRole("heading", { level: 1, name: /An outsourcing team.*Built AI-first/i })).toBeTruthy()
        expect(screen.getByText(/One continuous flow through discovery/i)).toBeTruthy()
        expect(screen.queryByText(/AI consultation/i)).toBeNull()
    })
})
