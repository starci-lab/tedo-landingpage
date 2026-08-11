"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { z } from "zod"

const MESSAGE_MAX = 4_000
interface ComposerValues { message: string }

interface UseConsultationComposerFormResult extends UseFormReturn<ComposerValues> {
    onSubmit: ReturnType<UseFormReturn<ComposerValues>["handleSubmit"]>
}

/** Owns the single-message form and clears it only after dispatch starts. */
export const useConsultationComposerForm = (
    sendMessage: (message: string) => Promise<boolean>,
): UseConsultationComposerFormResult => {
    const schema = useMemo(() => z.object({ message: z.string().trim().max(MESSAGE_MAX) }), [])
    const form = useForm<ComposerValues>({ resolver: zodResolver(schema), defaultValues: { message: "" } })
    const onSubmit = form.handleSubmit(async ({ message }) => {
        if (await sendMessage(message)) form.reset()
    })
    return { ...form, onSubmit }
}
