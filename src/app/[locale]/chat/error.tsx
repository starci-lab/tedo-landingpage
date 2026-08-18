"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineLeafComponent } from "@/components/contracts/props"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { ActionButton } from "@/components/leaves/ActionButton"

type ConsultationErrorProps = { error: Error; reset: () => void }

/** Renders the recovery actions shown when consultation loading fails. */
const ConsultationError = ({ reset }: ConsultationErrorProps) => {
    const t = useTranslations("consultation")
    const router = useRouter()

    return (
        <Tree
            contract="error-panel"
            render={defineContractComponent("error-panel", {
                heading: defineLeafComponent("heading", {}, () => (
                    <Heading props={{ content: t("pageErrorTitle"), level: 1 }} />
                )),
                body: defineLeafComponent("text", {}, () => (
                    <Text props={{ content: t("pageErrorBody"), variant: "body" }} />
                )),
                actions: defineContractComponent("inline-action-row", {
                    primary: defineLeafComponent("action-button", {}, () => (
                        <ActionButton props={{ content: t("retry"), variant: "brand" }} on={{ onPress: reset }} />
                    )),
                    secondary: defineLeafComponent("action-button", {}, () => (
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
