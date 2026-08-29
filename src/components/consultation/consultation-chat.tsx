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
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
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

const textLeaf = (props: TextData) => defineGrammarLeaf("text", {}, () => <Text props={props} />)
const placeholderLeaf = (props: PlaceholderData) => defineGrammarLeaf("placeholder", {}, () => <Placeholder props={props} />)
const actionButtonLeaf = (props: ActionButtonData, on?: ActionButtonActions) => defineGrammarLeaf("action-button", {}, () => <ActionButton props={props} on={on} />)
const iconButtonLeaf = (props: IconButtonData, on?: IconButtonActions) => defineGrammarLeaf("icon-button", {}, () => <IconButton props={props} on={on} />)
const selectedFileChipLeaf = (props: SelectedFileChipData, on?: SelectedFileChipActions) => defineGrammarLeaf("selected-file-chip", {}, () => <SelectedFileChip props={props} on={on} />)

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
        attachments: defineGrammarProjection("opaque-content-unit", () => (
            <MessageAttachments attachments={message.attachments} conversationId={conversationId} />
        )),
        body: defineGrammarProjection("opaque-content-unit", () => (
            message.role === "assistant"
                ? <AssistantMarkdown content={message.content} animate={message.id === streamingMessageId} />
                : <UserMessageContent content={message.content} />
        )),
    }
    return message.role === "user"
        ? <Tree key={message.id} grammar="chat-bubble-user" render={defineGrammarComponent("chat-bubble-user", bubbleContent)} />
        : <Tree key={message.id} grammar="chat-bubble-assistant" render={defineGrammarComponent("chat-bubble-assistant", bubbleContent)} />
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
                grammar="chat-discovery-card"
                render={defineGrammarComponent("chat-discovery-card", {
                    question: textLeaf({ content: question.label, variant: "body" }),
                    options: defineGrammarComponent("chat-discovery-options-row", {
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
            grammar="chat-shell"
            render={defineGrammarComponent("chat-shell", {
                header: defineGrammarProjection("opaque-content-unit", () => (
                    <Tree
                        grammar="chat-header"
                        render={defineGrammarComponent("chat-header", {
                            row: defineGrammarComponent("chat-header-row", {
                                logo: defineGrammarProjection("opaque-content-unit", () => (
                                    <button type="button" aria-label="TEDO" onClick={() => router.push("/")}>
                                        <Wordmark />
                                    </button>
                                )),
                                back: defineGrammarProjection("opaque-content-unit", () => (
                                    <ActionButton
                                        props={{ content: t("back"), variant: "ghost", size: "sm" }}
                                        on={{ onPress: () => router.push("/") }}
                                    />
                                )),
                            }),
                        })}
                    />
                )),
                main: defineGrammarProjection("opaque-content-unit", () => (
                    <Tree
                        grammar="chat-main"
                        render={defineGrammarComponent("chat-main", {
                            thread: defineGrammarProjection("opaque-content-unit", () => (
                                <Tree
                                    grammar="chat-thread-section"
                                    render={defineGrammarComponent("chat-thread-section", {
                                        heading: defineGrammarLeaf("heading", {}, () => (
                                            <Heading props={{ content: t("title"), level: 1 }} />
                                        )),
                                        subtitle: defineGrammarLeaf("text", {}, () => (
                                            <Text props={{ content: t("subtitle"), variant: "body" }} />
                                        )),
                                        messages: defineGrammarProjection("opaque-content-unit", () => (
                                            // A `<span>`, not a `<div>`: this node exists only to carry the
                                            // scroll-observer ref and `aria-live`, both refused on a `Tree`
                                            // host - see the note on the same pattern in `AssistantMarkdown`.
                                            <span ref={messagesRef} aria-live="polite">
                                                <Tree
                                                    grammar="chat-messages-grid"
                                                    render={defineGrammarComponent("chat-messages-grid", {
                                                        body: defineGrammarProjection("opaque-content-unit", () => (
                                                            <>
                                                                {chat.isLoading ? (
                                                                    <Tree
                                                                        grammar="chat-thread-skeleton"
                                                                        render={defineGrammarComponent("chat-thread-skeleton", {
                                                                            bars: [
                                                                                placeholderLeaf({ height: "lg", width: "threeQuarters", tone: "brand" }),
                                                                                placeholderLeaf({ height: "md", width: "twoThirds", tone: "neutral", align: "end" }),
                                                                            ],
                                                                        })}
                                                                    />
                                                                ) : null}
                                                                {!chat.isLoading && chat.messages.length === 0 ? (
                                                                    <Tree
                                                                        grammar="chat-empty-card"
                                                                        render={defineGrammarComponent("chat-empty-card", {
                                                                            message: textLeaf({ content: t("greeting"), variant: "body" }),
                                                                        })}
                                                                    />
                                                                ) : null}
                                                                {messageBubbles(chat.messages, chat.conversationId, chat.streamingMessageId)}
                                                                {chat.isSending ? (
                                                                    <Tree
                                                                        grammar="chat-sending-indicator"
                                                                        render={defineGrammarComponent("chat-sending-indicator", {
                                                                            message: textLeaf({ content: t("thinking"), variant: "body" }),
                                                                        })}
                                                                    />
                                                                ) : null}
                                                                {chat.error ? (
                                                                    <span role="alert">
                                                                        <Tree
                                                                            grammar="chat-error-alert"
                                                                            render={defineGrammarComponent("chat-error-alert", {
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
                                        composer: defineGrammarProjection("opaque-content-unit", () => (
                                            <form onSubmit={composer.onSubmit} onDragOver={(event) => event.preventDefault()} onDrop={dropFiles}>
                                                <Tree
                                                    grammar="composer-shell"
                                                    render={defineGrammarComponent("composer-shell", {
                                                        preview: selectedFiles.length
                                                            ? defineGrammarProjection("opaque-content-unit", () => (
                                                                <Tree
                                                                    grammar="composer-attachment-preview"
                                                                    render={defineGrammarComponent("composer-attachment-preview", {
                                                                        chips: selectedFileChips(selectedFiles, t("removeAttachment"), setSelectedFiles),
                                                                    })}
                                                                />
                                                            ))
                                                            : undefined,
                                                        error: attachmentError
                                                            ? textLeaf({ content: attachmentError, variant: "body", tone: "danger" })
                                                            : undefined,
                                                        fields: defineGrammarProjection("opaque-content-unit", () => (
                                                            <>
                                                                <label htmlFor="consultation-message" className="sr-only">{t("composerLabel")}</label>
                                                                <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={selectFiles} className="hidden" />
                                                                <input ref={fileInputRef} type="file" accept={ACCEPTED_FILES} multiple onChange={selectFiles} className="hidden" />
                                                            </>
                                                        )),
                                                        controls: defineGrammarComponent("composer-input-row", {
                                                            icons: defineGrammarComponent("composer-icon-row", {
                                                                items: [
                                                                    iconButtonLeaf({ icon: "PhotoIcon", label: t("addImage") }, { onPress: () => imageInputRef.current?.click() }),
                                                                    iconButtonLeaf({ icon: "PaperClipIcon", label: t("addFile") }, { onPress: () => fileInputRef.current?.click() }),
                                                                ],
                                                            }),
                                                            field: defineGrammarComponent("prompt-field-wrap", {
                                                                control: defineGrammarProjection("opaque-content-unit", () => (
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
                            sidebar: defineGrammarProjection("opaque-content-unit", () => (
                                <Tree
                                    grammar="chat-sidebar"
                                    render={defineGrammarComponent("chat-sidebar", {
                                        history: defineGrammarComponent("chat-history-card", {
                                            header: defineGrammarComponent("chat-history-header-row", {
                                                title: defineGrammarLeaf("heading", {}, () => (
                                                    <Heading props={{ content: t("chatHistory"), level: 2 }} />
                                                )),
                                                create: actionButtonLeaf(
                                                    { content: t("newChat"), variant: "outline", size: "sm" },
                                                    { onPress: chat.startNewChat },
                                                ),
                                            }),
                                            list: defineGrammarComponent("chat-history-list", {
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
                                        profileCard: defineGrammarComponent("chat-profile-card", {
                                            header: defineGrammarComponent("chat-profile-header-row", {
                                                title: defineGrammarLeaf("heading", {}, () => (
                                                    <Heading props={{ content: t("projectProfile"), level: 2 }} />
                                                )),
                                                percent: defineGrammarLeaf("text", {}, () => (
                                                    <Text props={{ content: `${chat.discovery?.completeness ?? 0}%`, variant: "body" }} />
                                                )),
                                            }),
                                            progress: defineGrammarComponent("chat-progress-track", {
                                                fill: defineGrammarProjection("opaque-content-unit", () => (
                                                    <span
                                                        aria-hidden
                                                        style={{ width: `${chat.discovery?.completeness ?? 0}%` }}
                                                        className="block h-full rounded-full bg-brand transition-[width] duration-300"
                                                    />
                                                )),
                                            }),
                                            stats: defineGrammarComponent("chat-profile-stats", {
                                                rows: [
                                                    defineGrammarComponent("chat-profile-stat-row", {
                                                        pair: defineGrammarProjection("opaque-content-unit", () => (
                                                            <>
                                                                <dt className="text-ink-faint">{t("productType")}</dt>
                                                                <dd className="mt-1 text-ink">{readString(chat.requirements, "productType") ?? t("unknown")}</dd>
                                                            </>
                                                        )),
                                                    }),
                                                    defineGrammarComponent("chat-profile-stat-row", {
                                                        pair: defineGrammarProjection("opaque-content-unit", () => (
                                                            <>
                                                                <dt className="text-ink-faint">{t("industry")}</dt>
                                                                <dd className="mt-1 text-ink">{readString(chat.requirements, "industry") ?? t("unknown")}</dd>
                                                            </>
                                                        )),
                                                    }),
                                                ],
                                            }),
                                            estimate: price
                                                ? defineGrammarComponent("chat-estimate-block", {
                                                    label: defineGrammarLeaf("text", {}, () => (
                                                        <Text props={{ content: t("currentEstimate"), variant: "body" }} />
                                                    )),
                                                    amount: defineGrammarLeaf("text", {}, () => (
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
                                        extras: defineGrammarProjection("opaque-content-unit", () => (
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
