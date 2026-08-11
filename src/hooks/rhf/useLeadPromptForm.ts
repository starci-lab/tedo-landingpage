"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "@/i18n/routing"

const PROMPT_MAX = 4_000

interface LeadPromptValues { prompt: string }

interface UseLeadPromptFormResult extends UseFormReturn<LeadPromptValues> {
    onSubmit: ReturnType<UseFormReturn<LeadPromptValues>["handleSubmit"]>
    startWithSuggestion: (prompt: string) => void
}

/** Owns validation and route handoff for the landing-page project prompt. */
export const useLeadPromptForm = (): UseLeadPromptFormResult => {
    const t = useTranslations("consultation")
    const router = useRouter()
    const schema = useMemo(() => z.object({
        prompt: z.string().trim().min(3, t("promptRequired")).max(PROMPT_MAX, t("promptTooLong")),
    }), [t])
    const form = useForm<LeadPromptValues>({ resolver: zodResolver(schema), defaultValues: { prompt: "" } })
    const openChat = (prompt: string): void => {
        window.sessionStorage.setItem("tedo:initial-consultation-prompt", prompt)
        router.push("/chat")
    }
    const onSubmit = form.handleSubmit(({ prompt }) => openChat(prompt))
    const startWithSuggestion = (prompt: string): void => {
        form.setValue("prompt", prompt, { shouldValidate: true })
        openChat(prompt)
    }
    return { ...form, onSubmit, startWithSuggestion }
}
