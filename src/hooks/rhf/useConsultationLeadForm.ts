"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { z } from "zod"

/** Contact details and consent collected before a consultation handoff. */
export interface ConsultationLeadValues {
    name: string
    phone: string
    email: string
    company: string
    preferredChannel: "zalo" | "phone" | "email"
    consent: boolean
}

interface UseConsultationLeadFormResult extends UseFormReturn<ConsultationLeadValues> {
    onSubmit: ReturnType<UseFormReturn<ConsultationLeadValues>["handleSubmit"]>
    sent: boolean
    submitError: boolean
}

/** Validates explicit contact consent and submits a qualified consultation lead. */
export const useConsultationLeadForm = (conversationId: string): UseConsultationLeadFormResult => {
    const t = useTranslations("consultation.lead")
    const [sent, setSent] = useState(false)
    const [submitError, setSubmitError] = useState(false)
    const schema = useMemo(() => z.object({
        name: z.string().trim().min(1, t("nameRequired")).max(120),
        phone: z.string().trim().max(40),
        email: z.union([z.literal(""), z.string().trim().email(t("emailInvalid")).max(255)]),
        company: z.string().trim().max(160),
        preferredChannel: z.enum(["zalo", "phone", "email"]),
        consent: z.boolean().refine((value) => value, { message: t("consentRequired") }),
    }).superRefine((value, context) => {
        if (!value.phone && !value.email) context.addIssue({ code: "custom", path: ["phone"], message: t("contactRequired") })
        if (value.preferredChannel === "email" && !value.email) context.addIssue({ code: "custom", path: ["email"], message: t("emailRequired") })
        if ((value.preferredChannel === "phone" || value.preferredChannel === "zalo") && !value.phone) {
            context.addIssue({ code: "custom", path: ["phone"], message: t("phoneRequired") })
        }
    }), [t])
    const form = useForm<ConsultationLeadValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", phone: "", email: "", company: "", preferredChannel: "zalo", consent: false },
    })
    const onSubmit = form.handleSubmit(async (value) => {
        setSubmitError(false)
        const response = await fetch(`/api/consultations/${conversationId}/lead`, {
            method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(value),
        }).catch(() => null)
        if (!response?.ok) { setSubmitError(true); return }
        setSent(true)
    })
    return { ...form, onSubmit, sent, submitError }
}
