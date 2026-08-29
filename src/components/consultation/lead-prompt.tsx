"use client"

import { useTranslations } from "next-intl"
import { useLeadPromptForm } from "@/hooks/rhf/useLeadPromptForm"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { ActionButton } from "@/components/leaves/ActionButton"
import { Text } from "@/components/leaves/Text"

/** Low-friction landing entry that hands one concrete intent to the dedicated chat route. */
export const LeadPrompt = () => {
    const t = useTranslations("consultation")
    const suggestions = t.raw("suggestions") as string[]
    const { register, onSubmit, startWithSuggestion, formState: { errors } } = useLeadPromptForm()
    return (
        // Bare on purpose - a `form` carries no shape of its own until it carries a class, so the
        // raised card ground lives on the `Tree` node one level in instead. See the grammar entry.
        <form onSubmit={onSubmit}>
            <Tree
                grammar="prompt-composer-body"
                render={defineGrammarComponent("prompt-composer-body", {
                    row: defineGrammarComponent("prompt-input-row", {
                        field: defineGrammarComponent("prompt-field-wrap", {
                            control: defineGrammarProjection("opaque-content-unit", () => (
                                <>
                                    <label htmlFor="project-prompt" className="sr-only">{t("promptLabel")}</label>
                                    <textarea
                                        id="project-prompt"
                                        rows={4}
                                        {...register("prompt")}
                                        placeholder={t("promptPlaceholder")}
                                        className="min-h-24 w-full resize-none rounded-xl bg-surface-2 px-4 py-3 text-base leading-relaxed text-ink outline-none placeholder:text-ink-faint focus-visible:ring-2 focus-visible:ring-brand"
                                    />
                                </>
                            )),
                        }),
                        submit: defineGrammarLeaf("action-button", {}, () => (
                            <ActionButton props={{ content: t("start"), variant: "primary", type: "submit" }} />
                        )),
                    }),
                    error: errors.prompt
                        ? defineGrammarLeaf("text", {}, () => (
                            <Text props={{ content: errors.prompt?.message ?? "", variant: "body", tone: "danger" }} />
                        ))
                        : undefined,
                    suggestions: defineGrammarComponent("suggestion-chip-row", {
                        items: suggestions.map((suggestion) => defineGrammarLeaf("action-button", {}, () => (
                            <ActionButton
                                props={{ content: suggestion, variant: "outline", size: "sm" }}
                                on={{ onPress: () => startWithSuggestion(suggestion) }}
                            />
                        ))),
                    }),
                })}
            />
        </form>
    )
}
