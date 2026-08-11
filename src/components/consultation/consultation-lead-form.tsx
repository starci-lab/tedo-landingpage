"use client"

import { useTranslations } from "next-intl"
import { useConsultationLeadForm } from "@/hooks/rhf/useConsultationLeadForm"

/** Collects reachable contact details only after the consultation has delivered value. */
export function ConsultationLeadForm({ conversationId }: { conversationId: string }) {
    const t = useTranslations("consultation.lead")
    const { register, onSubmit, sent, submitError, formState: { errors, isSubmitting } } = useConsultationLeadForm(conversationId)
    if (sent) {
        return <div role="status" className="rounded-2xl border border-green/30 bg-green/10 p-5 text-sm leading-relaxed text-ink">{t("success")}</div>
    }
    return (
        <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-line bg-white p-5">
            <div><h3 className="font-display text-lg font-semibold text-ink">{t("title")}</h3><p className="mt-1 text-sm leading-relaxed text-ink-muted">{t("subtitle")}</p></div>
            <label className="grid gap-1.5 text-sm text-ink"><span>{t("name")}</span><input {...register("name")} autoComplete="name" className="min-h-11 rounded-xl border border-line px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand" />{errors.name ? <span className="text-red-700">{errors.name.message}</span> : null}</label>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm text-ink"><span>{t("phone")}</span><input {...register("phone")} inputMode="tel" autoComplete="tel" className="min-h-11 rounded-xl border border-line px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand" />{errors.phone ? <span className="text-red-700">{errors.phone.message}</span> : null}</label>
                <label className="grid gap-1.5 text-sm text-ink"><span>{t("email")}</span><input {...register("email")} type="email" autoComplete="email" className="min-h-11 rounded-xl border border-line px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand" />{errors.email ? <span className="text-red-700">{errors.email.message}</span> : null}</label>
            </div>
            <label className="grid gap-1.5 text-sm text-ink"><span>{t("company")}</span><input {...register("company")} autoComplete="organization" className="min-h-11 rounded-xl border border-line px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand" /></label>
            <label className="grid gap-1.5 text-sm text-ink"><span>{t("preferred")}</span><select {...register("preferredChannel")} className="min-h-11 rounded-xl border border-line bg-white px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand"><option value="zalo">Zalo</option><option value="phone">{t("phoneOption")}</option><option value="email">Email</option></select></label>
            <label className="flex min-h-11 items-start gap-3 text-sm leading-relaxed text-ink-muted"><input {...register("consent")} type="checkbox" className="mt-1 h-5 w-5 accent-brand" /><span>{t("consent")}</span></label>
            {errors.consent ? <p className="text-sm text-red-700">{errors.consent.message}</p> : null}
            {submitError ? <p role="alert" className="text-sm text-red-700">{t("error")}</p> : null}
            <button type="submit" disabled={isSubmitting} className="min-h-12 cursor-pointer rounded-xl bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? t("sending") : t("submit")}</button>
        </form>
    )
}
