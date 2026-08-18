"use client"

import { useTranslations } from "next-intl"
import { useConsultationLeadForm } from "@/hooks/rhf/useConsultationLeadForm"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { ActionButton } from "@/components/leaves/ActionButton"

interface ConsultationLeadFormProps {
    conversationId: string
}

/** Collects reachable contact details only after the consultation has delivered value. */
export const ConsultationLeadForm = ({ conversationId }: ConsultationLeadFormProps) => {
    const t = useTranslations("consultation.lead")
    const { register, onSubmit, sent, submitError, formState: { errors, isSubmitting } } = useConsultationLeadForm(conversationId)

    if (sent) {
        return (
            <Tree
                contract="lead-success-panel"
                render={defineContractComponent("lead-success-panel", {
                    message: defineLeafComponent("text", {}, () => (
                        <Text props={{ content: t("success"), variant: "body" }} />
                    )),
                })}
            />
        )
    }

    return (
        <form onSubmit={onSubmit}>
            <Tree
                contract="lead-form-shell"
                render={defineContractComponent("lead-form-shell", {
                    intro: defineContractProjection("opaque-content-unit", () => (
                        <>
                            <Heading props={{ content: t("title"), level: 3 }} />
                            <Text props={{ content: t("subtitle"), variant: "body" }} />
                        </>
                    )),
                    name: defineContractComponent("field-row", {
                        control: defineContractProjection("opaque-content-unit", () => (
                            <>
                                <label className="text-sm text-ink">{t("name")}</label>
                                <input
                                    {...register("name")}
                                    autoComplete="name"
                                    className="min-h-11 rounded-xl border border-line px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                />
                                {errors.name ? <span className="text-sm text-red-700">{errors.name.message}</span> : null}
                            </>
                        )),
                    }),
                    contactPair: defineContractComponent("two-col-row", {
                        first: defineContractComponent("field-row", {
                            control: defineContractProjection("opaque-content-unit", () => (
                                <>
                                    <label className="text-sm text-ink">{t("phone")}</label>
                                    <input
                                        {...register("phone")}
                                        inputMode="tel"
                                        autoComplete="tel"
                                        className="min-h-11 rounded-xl border border-line px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                    />
                                    {errors.phone ? <span className="text-sm text-red-700">{errors.phone.message}</span> : null}
                                </>
                            )),
                        }),
                        second: defineContractComponent("field-row", {
                            control: defineContractProjection("opaque-content-unit", () => (
                                <>
                                    <label className="text-sm text-ink">{t("email")}</label>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        autoComplete="email"
                                        className="min-h-11 rounded-xl border border-line px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                    />
                                    {errors.email ? <span className="text-sm text-red-700">{errors.email.message}</span> : null}
                                </>
                            )),
                        }),
                    }),
                    company: defineContractComponent("field-row", {
                        control: defineContractProjection("opaque-content-unit", () => (
                            <>
                                <label className="text-sm text-ink">{t("company")}</label>
                                <input
                                    {...register("company")}
                                    autoComplete="organization"
                                    className="min-h-11 rounded-xl border border-line px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                />
                            </>
                        )),
                    }),
                    preferred: defineContractComponent("field-row", {
                        control: defineContractProjection("opaque-content-unit", () => (
                            <>
                                <label className="text-sm text-ink">{t("preferred")}</label>
                                <select
                                    {...register("preferredChannel")}
                                    className="min-h-11 rounded-xl border border-line bg-white px-3 outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                >
                                    <option value="zalo">Zalo</option>
                                    <option value="phone">{t("phoneOption")}</option>
                                    <option value="email">Email</option>
                                </select>
                            </>
                        )),
                    }),
                    consent: defineContractComponent("checkbox-consent-row", {
                        control: defineContractProjection("opaque-content-unit", () => (
                            <>
                                <input {...register("consent")} type="checkbox" className="mt-1 h-5 w-5 accent-brand" />
                                <span className="text-sm leading-relaxed text-ink-muted">{t("consent")}</span>
                            </>
                        )),
                    }),
                    consentError: errors.consent
                        ? defineLeafComponent("text", {}, () => (
                            <Text props={{ content: errors.consent?.message ?? "", variant: "body", tone: "danger" }} />
                        ))
                        : undefined,
                    submitError: submitError
                        ? defineLeafComponent("text", {}, () => (
                            <Text props={{ content: t("error"), variant: "body", tone: "danger" }} />
                        ))
                        : undefined,
                    submit: defineLeafComponent("action-button", {}, () => (
                        <ActionButton
                            props={{ content: isSubmitting ? t("sending") : t("submit"), variant: "primary", type: "submit", disabled: isSubmitting }}
                            isLoading={isSubmitting}
                        />
                    )),
                })}
            />
        </form>
    )
}
