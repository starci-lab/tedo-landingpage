"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarLeaf } from "@/components/grammar/props"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { ActionButton } from "@/components/leaves/ActionButton"

type ConsultationErrorProps = { error: Error; reset: () => void }

/** Renders the recovery actions shown when consultation loading fails. */
const ConsultationError = ({ error, reset }: ConsultationErrorProps) => {
    const t = useTranslations("consultation")
    const router = useRouter()

    return (
        <Tree
            grammar="error-panel"
            render={defineGrammarComponent("error-panel", {
                heading: defineGrammarLeaf("heading", {}, () => (
                    <Heading props={{ content: t("pageErrorTitle"), level: 1 }} />
                )),
                body: defineGrammarLeaf("text", {}, () => (
                    <Text props={{ content: error.message || t("pageErrorBody"), variant: "body" }} />
                )),
                actions: defineGrammarComponent("inline-action-row", {
                    primary: defineGrammarLeaf("action-button", {}, () => (
                        <ActionButton props={{ content: t("retry"), variant: "brand" }} on={{ onPress: reset }} />
                    )),
                    secondary: defineGrammarLeaf("action-button", {}, () => (
                        <ActionButton
                            props={{ content: t("back"), variant: "outline" }}
                            on={{ onPress: () => router.push("/") }}
                        />
                    )),
                }),
            })}
        />
    )
}

export default ConsultationError
