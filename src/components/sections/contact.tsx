"use client"

import { useState, type SyntheticEvent } from "react"
import { useTranslations } from "next-intl"
import { brand } from "@/config/brand"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"
import { Separator } from "@/components/leaves/Separator"
import { ActionLink } from "@/components/leaves/ActionLink"
import { ActionButton } from "@/components/leaves/ActionButton"
import { Field } from "@/components/leaves/Field"
import { SelectField } from "@/components/leaves/SelectField"
import { TextAreaField } from "@/components/leaves/TextAreaField"

type Status = "idle" | "sending" | "sent" | "error"

/** Presents contact options and submits the project enquiry form. */
export const Contact = () => {
    const t = useTranslations("contact")
    const tf = useTranslations("contact.form")
    const options = tf.raw("serviceOptions") as string[]
    const [status, setStatus] = useState<Status>("idle")
    const [service, setService] = useState(options[0])

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault()
        setStatus("sending")

        const payload = Object.fromEntries(
            new FormData(event.currentTarget).entries()
        )

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!response.ok) throw new Error(String(response.status))
            setStatus("sent")
        } catch {
            setStatus("error")
        }
    }

    const statusText = (() => {
        if (status === "sent") return tf("success")
        if (status === "error") return tf("error", { email: brand.email })
        return tf("privacy")
    })()
    const statusTone = status === "error" ? "danger" : "default"

    return (
        <Tree
            grammar="page-band"
            render={defineGrammarComponent("page-band", {
                content: defineGrammarComponent("page-measure", {
                    content: defineGrammarComponent("contact-layout", {
                        info: defineGrammarComponent("contact-info-column", {
                            intro: defineGrammarComponent("section-intro", {
                                eyebrow: defineGrammarLeaf("text", {}, () => (
                                    <Text props={{ content: t("eyebrow"), variant: "eyebrow" }} />
                                )),
                                title: defineGrammarLeaf("heading", {}, () => (
                                    <Heading props={{ content: t("title"), level: 2 }} />
                                )),
                                lead: defineGrammarLeaf("text", {}, () => (
                                    <Text props={{ content: t("subtitle"), variant: "lead" }} />
                                )),
                            }),
                            booking: defineGrammarComponent("contact-booking-block", {
                                divider: defineGrammarLeaf("separator", {}, () => <Separator props={{}} />),
                                label: defineGrammarLeaf("text", {}, () => (
                                    <Text props={{ content: t("orBook"), variant: "body" }} />
                                )),
                                links: defineGrammarComponent("contact-booking-links", {
                                    items: [
                                        defineGrammarLeaf("action-link", {}, () => (
                                            <ActionLink
                                                props={{
                                                    href: brand.calendarUrl,
                                                    content: brand.calendarUrl.replace("https://", ""),
                                                    variant: "outline",
                                                    size: "md",
                                                    external: true,
                                                }}
                                            />
                                        )),
                                        defineGrammarLeaf("action-link", {}, () => (
                                            <ActionLink
                                                props={{ href: `mailto:${brand.email}`, content: brand.email, variant: "ghost", size: "md" }}
                                            />
                                        )),
                                    ],
                                }),
                            }),
                        }),
                        form: defineGrammarProjection("opaque-content-unit", () => (
                            // Bare on purpose - see the note on `contact-form-shell` for why the
                            // raised card ground lives on the `Tree` node one level in instead.
                            <form onSubmit={handleSubmit}>
                                <Tree
                                    grammar="contact-form-shell"
                                    render={defineGrammarComponent("contact-form-shell", {
                                        contactPair: defineGrammarComponent("two-col-row", {
                                            first: defineGrammarComponent("field-row", {
                                                control: defineGrammarProjection("opaque-content-unit", () => (
                                                    <Field props={{ name: "name", label: tf("name"), placeholder: tf("namePlaceholder"), autoComplete: "name", required: true }} />
                                                )),
                                            }),
                                            second: defineGrammarComponent("field-row", {
                                                control: defineGrammarProjection("opaque-content-unit", () => (
                                                    <Field props={{ name: "email", label: tf("email"), type: "email", placeholder: tf("emailPlaceholder"), autoComplete: "email", required: true }} />
                                                )),
                                            }),
                                        }),
                                        company: defineGrammarComponent("field-row", {
                                            control: defineGrammarProjection("opaque-content-unit", () => (
                                                <Field props={{ name: "company", label: tf("company"), placeholder: tf("companyPlaceholder"), autoComplete: "organization" }} />
                                            )),
                                        }),
                                        service: defineGrammarComponent("field-row", {
                                            control: defineGrammarProjection("opaque-content-unit", () => (
                                                <SelectField
                                                    props={{ name: "service", label: tf("service"), options, value: service }}
                                                    on={{ onChange: setService }}
                                                />
                                            )),
                                        }),
                                        message: defineGrammarComponent("field-row", {
                                            control: defineGrammarProjection("opaque-content-unit", () => (
                                                <TextAreaField props={{ name: "message", label: tf("message"), placeholder: tf("messagePlaceholder"), rows: 4, required: true }} />
                                            )),
                                        }),
                                        submit: defineGrammarLeaf("action-button", {}, () => (
                                            <ActionButton
                                                props={{ content: status === "sending" ? tf("submitting") : tf("submit"), variant: "primary", type: "submit", disabled: status === "sending" }}
                                                isLoading={status === "sending"}
                                            />
                                        )),
                                        status: defineGrammarLeaf("text", {}, () => (
                                            <Text props={{ content: statusText, variant: "body", tone: statusTone }} />
                                        )),
                                    })}
                                />
                            </form>
                        )),
                    }),
                }),
            })}
        />
    )
}
