"use client"

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type Dispatch, type DragEvent, type KeyboardEvent, type SetStateAction } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { useConsultationChat } from "@/hooks/useConsultationChat"
import { useConsultationComposerForm } from "@/hooks/rhf/useConsultationComposerForm"
import type { ConsultationMessage, DiscoveryQuestion } from "@/lib/consultation/types"
import { Wordmark } from "@/components/leaves/Wordmark"
import { ConsultationLeadForm } from "./consultation-lead-form"
import { ProposalActions } from "./proposal-actions"
import { AssistantMarkdown } from "./assistant-markdown"
import { MessageAttachments } from "./message-attachments"
import { UserMessageContent } from "./user-message-content"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
import { Heading } from "@/components/leaves/Heading"
import { Text, type TextData } from "@/components/leaves/Text"
import { ActionButton, type ActionButtonActions, type ActionButtonData } from "@/components/leaves/ActionButton"
import { IconButton, type IconButtonActions, type IconButtonData } from "@/components/leaves/IconButton"
import { SelectedFileChip, type SelectedFileChipActions, type SelectedFileChipData } from "@/components/leaves/SelectedFileChip"
import { Placeholder, type PlaceholderData } from "@/components/leaves/Placeholder"

const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024
const ACCEPTED_FILES = "image/jpeg,image/png,image/webp,image/gif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv,text/markdown,application/json"
const ACCEPTED_MIME_TYPES = new Set(ACCEPTED_FILES.split(","))

const readString = (record: Record<string, unknown>, key: string): string | undefined =>
    typeof record[key] === "string" ? record[key] : undefined

const textLeaf = (props: TextData) => defineLeafComponent("text", {}, () => <Text props={props} />)
const placeholderLeaf = (props: PlaceholderData) => defineLeafComponent("placeholder", {}, () => <Placeholder props={props} />)
const actionButtonLeaf = (props: ActionButtonData, on?: ActionButtonActions) => defineLeafComponent("action-button", {}, () => <ActionButton props={props} on={on} />)
const iconButtonLeaf = (props: IconButtonData, on?: IconButtonActions) => defineLeafComponent("icon-button", {}, () => <IconButton props={props} on={on} />)
const selectedFileChipLeaf = (props: SelectedFileChipData, on?: SelectedFileChipActions) => defineLeafComponent("selected-file-chip", {}, () => <SelectedFileChip props={props} on={on} />)

type LeadExtrasProps = {
    conversationId: string | undefined
    showLeadForm: boolean
    translate: (key: string) => string
    onShowLeadForm: () => void
}

const leadExtras = ({ conversationId, showLeadForm, translate, onShowLeadForm }: LeadExtrasProps) => {
    if (conversationId === undefined) return null
    if (showLeadForm) return <ConsultationLeadForm conversationId={conversationId} />
    return (
        <ActionButton
            props={{ content: translate("optionalFollowUp"), variant: "outline" }}
            on={{ onPress: onShowLeadForm }}
        />
    )
}

type MessageBubbleProps = {
    message: ConsultationMessage
    conversationId?: string
    streamingMessageId?: string
}

const messageBubble = ({ message, conversationId, streamingMessageId }: MessageBubbleProps) => {
    const bubbleContent = {
        attachments: defineContractProjection("opaque-content-unit", () => (
            <MessageAttachments attachments={message.attachments} conversationId={conversationId} />
        )),
        body: defineContractProjection("opaque-content-unit", () => (
            message.role === "assistant"
                ? <AssistantMarkdown content={message.content} animate={message.id === streamingMessageId} />
                : <UserMessageContent content={message.content} />
        )),
    }
    return message.role === "user"
        ? <Tree key={message.id} contract="chat-bubble-user" render={defineContractComponent("chat-bubble-user", bubbleContent)} />
        : <Tree key={message.id} contract="chat-bubble-assistant" render={defineContractComponent("chat-bubble-assistant", bubbleContent)} />
}

const messageBubbles = (messages: ReadonlyArray<ConsultationMessage>, conversationId: string | undefined, streamingMessageId: string | undefined) =>
    messages.map((message) => messageBubble({ message, conversationId, streamingMessageId }))

const retryAction = (label: string, failedMessage: string, sendMessage: (message: string) => Promise<boolean>) =>
    actionButtonLeaf(
        { content: label, variant: "outline", size: "sm" },
        { onPress: () => void sendMessage(failedMessage) },
    )

const discoveryCards = (questions: ReadonlyArray<DiscoveryQuestion>, onAnswer: (question: DiscoveryQuestion, label: string) => void) =>
    questions.flatMap((question) => question.options?.length
        ? [(
            <Tree
                key={question.id}
                contract="chat-discovery-card"
                render={defineContractComponent("chat-discovery-card", {
                    question: textLeaf({ content: question.label, variant: "body" }),
                    options: defineContractComponent("chat-discovery-options-row", {
                        items: question.options.map((option) => actionButtonLeaf(
                            { content: option.label, variant: "outline", size: "sm" },
                            { onPress: () => onAnswer(question, option.label) },
                        )),
                    }),
                })}
            />
        )]
        : [])

const selectedFileChips = (files: ReadonlyArray<File>, removeLabel: string, setFiles: Dispatch<SetStateAction<File[]>>) =>
    files.map((file, index) => selectedFileChipLeaf(
        { fileName: file.name, removeLabel: `${removeLabel} ${file.name}` },
        { onRemove: () => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index)) },
    ))

interface ConsultationChatProps {
    initialConversationId?: string
}

/** Full-page consultation workspace with durable history, discovery progress, and handoff. */
export const ConsultationChat = ({ initialConversationId }: ConsultationChatProps) => {
    const t = useTranslations("consultation")
    const locale = useLocale()
    const router = useRouter()
    const chat = useConsultationChat(initialConversationId)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [attachmentError, setAttachmentError] = useState<string>()
    const sendWithAttachments = useCallback(async (message: string): Promise<boolean> => {
        const sent = await chat.sendMessage(message, selectedFiles)
        if (sent) setSelectedFiles([])
        return sent
    }, [chat, selectedFiles])
    const composer = useConsultationComposerForm(sendWithAttachments)
    const [showLeadForm, setShowLeadForm] = useState(false)
    const messagesRef = useRef<HTMLSpanElement>(null)
    const endRef = useRef<HTMLSpanElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }) }, [chat.messages, chat.isSending])
    useEffect(() => {
        const messages = messagesRef.current
        if (!messages || !chat.streamingMessageId) return
        const observer = new ResizeObserver(() => endRef.current?.scrollIntoView({ block: "nearest" }))
        observer.observe(messages)
        return () => observer.disconnect()
    }, [chat.streamingMessageId])
    const answerQuestion = (question: DiscoveryQuestion, label: string): void => {
        void chat.sendMessage(`${question.label}: ${label}`)
    }
    const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            void composer.onSubmit()
        }
    }
    const price = chat.quote?.totalVnd ?? chat.quote?.rangeMinVnd
    const addFiles = (incoming: File[]): void => {
        if (selectedFiles.length + incoming.length > MAX_FILES
            || incoming.some((file) => file.size > MAX_FILE_BYTES || !ACCEPTED_MIME_TYPES.has(file.type))) {
            setAttachmentError(t("attachmentError"))
            return
        }
        setAttachmentError(undefined)
        setSelectedFiles((current) => [...current, ...incoming])
    }
    const selectFiles = (event: ChangeEvent<HTMLInputElement>): void => {
        addFiles(Array.from(event.target.files ?? []))
        event.target.value = ""
    }
    const dropFiles = (event: DragEvent<HTMLFormElement>): void => {
        event.preventDefault()
        addFiles(Array.from(event.dataTransfer.files))
    }

    return (
        <Tree
            contract="chat-shell"
            render={defineContractComponent("chat-shell", {
                header: defineContractProjection("opaque-content-unit", () => (
                    <Tree
                        contract="chat-header"
                        render={defineContractComponent("chat-header", {
                            row: defineContractComponent("chat-header-row", {
                                logo: defineContractProjection("opaque-content-unit", () => (
                                    <button type="button" aria-label="TEDO" onClick={() => router.push("/")}>
                                        <Wordmark />
                                    </button>
                                )),
                                back: defineContractProjection("opaque-content-unit", () => (
                                    <ActionButton
                                        props={{ content: t("back"), variant: "ghost", size: "sm" }}
                                        on={{ onPress: () => router.push("/") }}
                                    />
                                )),
                            }),
                        })}
                    />
                )),
                main: defineContractProjection("opaque-content-unit", () => (
                    <Tree
                        contract="chat-main"
                        render={defineContractComponent("chat-main", {
                            thread: defineContractProjection("opaque-content-unit", () => (
                                <Tree
                                    contract="chat-thread-section"
                                    render={defineContractComponent("chat-thread-section", {
                                        heading: defineLeafComponent("heading", {}, () => (
                                            <Heading props={{ content: t("title"), level: 1 }} />
                                        )),
                                        subtitle: defineLeafComponent("text", {}, () => (
                                            <Text props={{ content: t("subtitle"), variant: "body" }} />
                                        )),
                                        messages: defineContractProjection("opaque-content-unit", () => (
                                            // A `<span>`, not a `<div>`: this node exists only to carry the
                                            // scroll-observer ref and `aria-live`, both refused on a `Tree`
                                            // host - see the note on the same pattern in `AssistantMarkdown`.
                                            <span ref={messagesRef} aria-live="polite">
                                                <Tree
                                                    contract="chat-messages-grid"
                                                    render={defineContractComponent("chat-messages-grid", {
                                                        body: defineContractProjection("opaque-content-unit", () => (
                                                            <>
                                                                {chat.isLoading ? (
                                                                    <Tree
                                                                        contract="chat-thread-skeleton"
                                                                        render={defineContractComponent("chat-thread-skeleton", {
                                                                            bars: [
                                                                                placeholderLeaf({ height: "lg", width: "threeQuarters", tone: "brand" }),
                                                                                placeholderLeaf({ height: "md", width: "twoThirds", tone: "neutral", align: "end" }),
                                                                            ],
                                                                        })}
                                                                    />
                                                                ) : null}
                                                                {!chat.isLoading && chat.messages.length === 0 ? (
                                                                    <Tree
                                                                        contract="chat-empty-card"
                                                                        render={defineContractComponent("chat-empty-card", {
                                                                            message: textLeaf({ content: t("greeting"), variant: "body" }),
                                                                        })}
                                                                    />
                                                                ) : null}
                                                                {messageBubbles(chat.messages, chat.conversationId, chat.streamingMessageId)}
                                                                {chat.isSending ? (
                                                                    <Tree
                                                                        contract="chat-sending-indicator"
                                                                        render={defineContractComponent("chat-sending-indicator", {
                                                                            message: textLeaf({ content: t("thinking"), variant: "body" }),
                                                                        })}
                                                                    />
                                                                ) : null}
                                                                {chat.error ? (
                                                                    <span role="alert">
                                                                        <Tree
                                                                            contract="chat-error-alert"
                                                                            render={defineContractComponent("chat-error-alert", {
                                                                                message: textLeaf({ content: chat.error ?? "", variant: "body" }),
                                                                                retry: chat.failedMessage
                                                                                    ? retryAction(t("retrySend"), chat.failedMessage, chat.sendMessage)
                                                                                    : undefined,
                                                                            })}
                                                                        />
                                                                    </span>
                                                                ) : null}
                                                                {!chat.isSending && chat.discovery ? discoveryCards(chat.discovery.nextQuestions, answerQuestion) : null}
                                                                <span ref={endRef} />
                                                            </>
                                                        )),
                                                    })}
                                                />
                                            </span>
                                        )),
                                        composer: defineContractProjection("opaque-content-unit", () => (
                                            <form onSubmit={composer.onSubmit} onDragOver={(event) => event.preventDefault()} onDrop={dropFiles}>
                                                <Tree
                                                    contract="composer-shell"
                                                    render={defineContractComponent("composer-shell", {
                                                        preview: selectedFiles.length
                                                            ? defineContractProjection("opaque-content-unit", () => (
                                                                <Tree
                                                                    contract="composer-attachment-preview"
                                                                    render={defineContractComponent("composer-attachment-preview", {
                                                                        chips: selectedFileChips(selectedFiles, t("removeAttachment"), setSelectedFiles),
                                                                    })}
                                                                />
                                                            ))
                                                            : undefined,
                                                        error: attachmentError
                                                            ? textLeaf({ content: attachmentError, variant: "body", tone: "danger" })
                                                            : undefined,
                                                        fields: defineContractProjection("opaque-content-unit", () => (
                                                            <>
                                                                <label htmlFor="consultation-message" className="sr-only">{t("composerLabel")}</label>
                                                                <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={selectFiles} className="hidden" />
                                                                <input ref={fileInputRef} type="file" accept={ACCEPTED_FILES} multiple onChange={selectFiles} className="hidden" />
                                                            </>
                                                        )),
                                                        controls: defineContractComponent("composer-input-row", {
                                                            icons: defineContractComponent("composer-icon-row", {
                                                                items: [
                                                                    iconButtonLeaf({ icon: "PhotoIcon", label: t("addImage") }, { onPress: () => imageInputRef.current?.click() }),
                                                                    iconButtonLeaf({ icon: "PaperClipIcon", label: t("addFile") }, { onPress: () => fileInputRef.current?.click() }),
                                                                ],
                                                            }),
                                                            field: defineContractComponent("prompt-field-wrap", {
                                                                control: defineContractProjection("opaque-content-unit", () => (
                                                                    <textarea
                                                                        id="consultation-message"
                                                                        rows={2}
                                                                        {...composer.register("message")}
                                                                        onKeyDown={onComposerKeyDown}
                                                                        placeholder={t("composerPlaceholder")}
                                                                        className="max-h-40 min-h-14 w-full resize-none rounded-xl bg-surface-2 px-3 py-3 text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                                                    />
                                                                )),
                                                            }),
                                                            submit: actionButtonLeaf({
                                                                content: t("send"),
                                                                variant: "primary",
                                                                type: "submit",
                                                                disabled: chat.isSending || (!composer.watch("message").trim() && selectedFiles.length === 0),
                                                            }),
                                                        }),
                                                    })}
                                                />
                                            </form>
                                        )),
                                    })}
                                />
                            )),
                            sidebar: defineContractProjection("opaque-content-unit", () => (
                                <Tree
                                    contract="chat-sidebar"
                                    render={defineContractComponent("chat-sidebar", {
                                        history: defineContractComponent("chat-history-card", {
                                            header: defineContractComponent("chat-history-header-row", {
                                                title: defineLeafComponent("heading", {}, () => (
                                                    <Heading props={{ content: t("chatHistory"), level: 2 }} />
                                                )),
                                                create: actionButtonLeaf(
                                                    { content: t("newChat"), variant: "outline", size: "sm" },
                                                    { onPress: chat.startNewChat },
                                                ),
                                            }),
                                            list: defineContractComponent("chat-history-list", {
                                                items: chat.sessions.map((session) => actionButtonLeaf(
                                                    {
                                                        content: session.title,
                                                        variant: session.id === chat.activeSessionId ? "brand" : "ghost",
                                                        size: "sm",
                                                    },
                                                    { onPress: () => chat.openChat(session.id) },
                                                )),
                                            }),
                                        }),
                                        profileCard: defineContractComponent("chat-profile-card", {
                                            header: defineContractComponent("chat-profile-header-row", {
                                                title: defineLeafComponent("heading", {}, () => (
                                                    <Heading props={{ content: t("projectProfile"), level: 2 }} />
                                                )),
                                                percent: defineLeafComponent("text", {}, () => (
                                                    <Text props={{ content: `${chat.discovery?.completeness ?? 0}%`, variant: "body" }} />
                                                )),
                                            }),
                                            progress: defineContractComponent("chat-progress-track", {
                                                fill: defineContractProjection("opaque-content-unit", () => (
                                                    <span
                                                        aria-hidden
                                                        style={{ width: `${chat.discovery?.completeness ?? 0}%` }}
                                                        className="block h-full rounded-full bg-brand transition-[width] duration-300"
                                                    />
                                                )),
                                            }),
                                            stats: defineContractComponent("chat-profile-stats", {
                                                rows: [
                                                    defineContractComponent("chat-profile-stat-row", {
                                                        pair: defineContractProjection("opaque-content-unit", () => (
                                                            <>
                                                                <dt className="text-ink-faint">{t("productType")}</dt>
                                                                <dd className="mt-1 text-ink">{readString(chat.requirements, "productType") ?? t("unknown")}</dd>
                                                            </>
                                                        )),
                                                    }),
                                                    defineContractComponent("chat-profile-stat-row", {
                                                        pair: defineContractProjection("opaque-content-unit", () => (
                                                            <>
                                                                <dt className="text-ink-faint">{t("industry")}</dt>
                                                                <dd className="mt-1 text-ink">{readString(chat.requirements, "industry") ?? t("unknown")}</dd>
                                                            </>
                                                        )),
                                                    }),
                                                ],
                                            }),
                                            estimate: price
                                                ? defineContractComponent("chat-estimate-block", {
                                                    label: defineLeafComponent("text", {}, () => (
                                                        <Text props={{ content: t("currentEstimate"), variant: "body" }} />
                                                    )),
                                                    amount: defineLeafComponent("text", {}, () => (
                                                        <Text
                                                            props={{
                                                                content: `${new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(price)} VND`,
                                                                variant: "body",
                                                            }}
                                                        />
                                                    )),
                                                })
                                                : undefined,
                                        }),
                                        extras: defineContractProjection("opaque-content-unit", () => (
                                            <>
                                                {chat.discovery?.readyForProposal && chat.projectId ? <ProposalActions projectId={chat.projectId} /> : null}
                                                {leadExtras({
                                                    conversationId: chat.conversationId,
                                                    showLeadForm,
                                                    translate: t,
                                                    onShowLeadForm: () => setShowLeadForm(true),
                                                })}
                                            </>
                                        )),
                                    })}
                                />
                            )),
                        })}
                    />
                )),
            })}
        />
    )
}
