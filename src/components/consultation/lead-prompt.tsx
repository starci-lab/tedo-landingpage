"use client"

import { useTranslations } from "next-intl"
import { useLeadPromptForm } from "@/hooks/rhf/useLeadPromptForm"

/** Low-friction landing entry that hands one concrete intent to the dedicated chat route. */
export function LeadPrompt() {
    const t = useTranslations("consultation")
    const suggestions = t.raw("suggestions") as string[]
    const { register, onSubmit, startWithSuggestion, formState: { errors } } = useLeadPromptForm()
    return (
        <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-line bg-white p-2 shadow-[0_18px_50px_-35px_rgba(20,48,92,0.5)]">
            <label htmlFor="project-prompt" className="sr-only">{t("promptLabel")}</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <textarea
                    id="project-prompt"
                    rows={4}
                    {...register("prompt")}
                    placeholder={t("promptPlaceholder")}
                    className="min-h-24 flex-1 resize-none overflow-y-hidden rounded-xl bg-surface-2 px-4 py-3 text-base leading-relaxed text-ink outline-none placeholder:text-ink-faint focus-visible:ring-2 focus-visible:ring-brand"
                />
                <button type="submit" className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-accent px-5 font-medium text-accent-ink transition-colors duration-200 hover:bg-accent-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
                    {t("start")}
                </button>
            </div>
            {errors.prompt ? <p className="px-2 pt-2 text-sm text-red-700">{errors.prompt.message}</p> : null}
            <div className="flex flex-wrap gap-2 px-1 pb-1 pt-2" aria-label={t("suggestionLabel")}>
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        onClick={() => startWithSuggestion(suggestion)}
                        className="min-h-11 cursor-pointer rounded-full border border-line-strong px-3 text-left text-sm text-ink-muted transition-colors duration-200 hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </form>
    )
}
