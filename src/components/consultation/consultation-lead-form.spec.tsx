import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }))
vi.mock("@/hooks/rhf/useConsultationLeadForm", () => ({ useConsultationLeadForm: vi.fn() }))
import { useConsultationLeadForm } from "@/hooks/rhf/useConsultationLeadForm"
import { ConsultationLeadForm } from "./consultation-lead-form"

const base = { register: (name: string) => ({ name }), onSubmit: vi.fn(), sent: false, submitError: false, formState: { errors: {}, isSubmitting: false } }
describe("ConsultationLeadForm", () => {
    it("renders the consented lead fields", () => { vi.mocked(useConsultationLeadForm).mockReturnValue(base); const html = renderToStaticMarkup(<ConsultationLeadForm conversationId="conversation-1" />); expect(html).toContain(">name<"); expect(html).toContain(">consent<") })
    it("renders success after a sent lead", () => { vi.mocked(useConsultationLeadForm).mockReturnValue({ ...base, sent: true }); expect(renderToStaticMarkup(<ConsultationLeadForm conversationId="conversation-1" />)).toContain(">success<") })
    it("renders submitting and API error branches", () => { vi.mocked(useConsultationLeadForm).mockReturnValue({ ...base, submitError: true, formState: { errors: { consent: { message: "required" } }, isSubmitting: true } }); const html = renderToStaticMarkup(<ConsultationLeadForm conversationId="conversation-1" />); expect(html).toContain(">error<"); expect(html).toContain(">sending<") })
})
