"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { isGeneratedProposalResponse, type GeneratedDocumentSummary } from "@/lib/consultation/types"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
import { Heading } from "@/components/leaves/Heading"
import { Text } from "@/components/leaves/Text"
import { ActionButton } from "@/components/leaves/ActionButton"
import { ProposalDocumentLink } from "@/components/leaves/ProposalDocumentLink"

type ProposalStatus = "idle" | "generating" | "ready" | "error"

interface ProposalActionsProps {
    projectId: string
}

/** Confirms a completed scope and exposes immutable generated brief, spec, and proposal files. */
export const ProposalActions = ({ projectId }: ProposalActionsProps) => {
    const t = useTranslations("consultation.proposal")
    const [status, setStatus] = useState<ProposalStatus>("idle")
    const [documents, setDocuments] = useState<GeneratedDocumentSummary[]>([])
    const generate = async (): Promise<void> => {
        setStatus("generating")
        try {
            const confirmed = await fetch(`/api/projects/${projectId}/confirm`, { method: "POST" })
            if (!confirmed.ok) throw new Error("confirm-failed")
            const response = await fetch(`/api/projects/${projectId}/proposals`, { method: "POST" })
            const payload: unknown = await response.json().catch(() => null)
            if (!response.ok || !isGeneratedProposalResponse(payload)) throw new Error("proposal-failed")
            setDocuments(payload.documents)
            setStatus("ready")
        } catch {
            setStatus("error")
        }
    }
    if (status === "ready") {
        return (
            <Tree
                contract="proposal-panel"
                render={defineContractComponent("proposal-panel", {
                    heading: defineLeafComponent("heading", {}, () => (
                        <Heading props={{ content: t("ready"), level: 3 }} />
                    )),
                    body: defineContractProjection("opaque-content-unit", () => (
                        <Tree
                            contract="proposal-document-list"
                            render={defineContractComponent("proposal-document-list", {
                                items: documents.map((document) => defineLeafComponent("proposal-document-link", {}, () => (
                                    <ProposalDocumentLink
                                        props={{
                                            href: `/api/projects/${projectId}/documents/${document.id}`,
                                            fileName: document.fileName,
                                        }}
                                    />
                                ))),
                            })}
                        />
                    )),
                })}
            />
        )
    }
    return (
        <Tree
            contract="proposal-panel"
            render={defineContractComponent("proposal-panel", {
                heading: defineLeafComponent("heading", {}, () => (
                    <Heading props={{ content: t("title"), level: 3 }} />
                )),
                body: defineContractProjection("opaque-content-unit", () => (
                    <Tree
                        contract="proposal-generate-body"
                        render={defineContractComponent("proposal-generate-body", {
                            description: defineLeafComponent("text", {}, () => (
                                <Text props={{ content: t("body"), variant: "body" }} />
                            )),
                            error: status === "error"
                                ? defineLeafComponent("text", {}, () => (
                                    <Text props={{ content: t("error"), variant: "body", tone: "danger" }} />
                                ))
                                : undefined,
                            action: defineLeafComponent("action-button", {}, () => (
                                <ActionButton
                                    props={{
                                        content: status === "generating" ? t("generating") : t("generate"),
                                        variant: "brand",
                                        disabled: status === "generating",
                                    }}
                                    on={{ onPress: () => void generate() }}
                                    isLoading={status === "generating"}
                                />
                            )),
                        })}
                    />
                )),
            })}
        />
    )
}
