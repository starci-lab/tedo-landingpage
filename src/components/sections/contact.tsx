"use client"

import { useState, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import {
    Button,
    Card,
    Input,
    Label,
    ListBox,
    ListBoxItem,
    Select,
    Separator,
    Spinner,
    TextArea,
    TextField,
} from "@heroui/react"
import { brand } from "@/config/brand"
import { CtaLink, Eyebrow, Section, SectionLead, SectionTitle } from "../ui"

type Status = "idle" | "sending" | "sent" | "error"

export function Contact() {
    const t = useTranslations("contact")
    const tf = useTranslations("contact.form")
    const options = tf.raw("serviceOptions") as string[]
    const [status, setStatus] = useState<Status>("idle")

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    return (
        <Section id="contact">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
                <div>
                    <Eyebrow>{t("eyebrow")}</Eyebrow>
                    <SectionTitle>{t("title")}</SectionTitle>
                    <SectionLead>{t("subtitle")}</SectionLead>

                    <Separator className="my-8" />

                    <p className="text-sm text-ink-muted">{t("orBook")}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                        <CtaLink
                            href={brand.calendarUrl}
                            variant="outline"
                            size="md"
                            external
                        >
                            {brand.calendarUrl.replace("https://", "")}
                        </CtaLink>
                        <CtaLink
                            href={`mailto:${brand.email}`}
                            variant="ghost"
                            size="md"
                            className="font-mono"
                        >
                            {brand.email}
                        </CtaLink>
                    </div>
                </div>

                <Card>
                    <Card.Content>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <TextField
                                    name="name"
                                    isRequired
                                    autoComplete="name"
                                >
                                    <Label>{tf("name")}</Label>
                                    <Input
                                        placeholder={tf("namePlaceholder")}
                                    />
                                </TextField>

                                <TextField
                                    name="email"
                                    type="email"
                                    isRequired
                                    autoComplete="email"
                                >
                                    <Label>{tf("email")}</Label>
                                    <Input
                                        placeholder={tf("emailPlaceholder")}
                                    />
                                </TextField>
                            </div>

                            <TextField
                                name="company"
                                autoComplete="organization"
                            >
                                <Label>{tf("company")}</Label>
                                <Input
                                    placeholder={tf("companyPlaceholder")}
                                />
                            </TextField>

                            <Select
                                name="service"
                                defaultSelectedKey={options[0]}
                                placeholder={options[0]}
                            >
                                <Label>{tf("service")}</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {options.map((option) => (
                                            <ListBoxItem
                                                key={option}
                                                id={option}
                                            >
                                                {option}
                                            </ListBoxItem>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>

                            <TextField name="message" isRequired>
                                <Label>{tf("message")}</Label>
                                <TextArea
                                    rows={4}
                                    placeholder={tf("messagePlaceholder")}
                                />
                            </TextField>

                            <Button
                                type="submit"
                                size="lg"
                                isDisabled={status === "sending"}
                                className="mt-1"
                            >
                                {status === "sending" ? (
                                    <>
                                        <Spinner size="sm" />
                                        {tf("submitting")}
                                    </>
                                ) : (
                                    tf("submit")
                                )}
                            </Button>

                            <p
                                aria-live="polite"
                                className="min-h-5 text-xs leading-relaxed"
                            >
                                {status === "sent" && (
                                    <span className="text-accent">
                                        {tf("success")}
                                    </span>
                                )}
                                {status === "error" && (
                                    <span className="text-ink-muted">
                                        {tf("error", { email: brand.email })}
                                    </span>
                                )}
                                {(status === "idle" ||
                                    status === "sending") && (
                                    <span className="text-ink-faint">
                                        {tf("privacy")}
                                    </span>
                                )}
                            </p>
                        </form>
                    </Card.Content>
                </Card>
            </div>
        </Section>
    )
}
