"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { isGeneratedProposalResponse, type GeneratedDocumentSummary } from "@/lib/consultation/types"

type ProposalStatus = "idle" | "generating" | "ready" | "error"

/** Confirms a completed scope and exposes immutable generated brief, spec, and proposal files. */
export function ProposalActions({ projectId }: { projectId: string }) {
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
            <div className="rounded-2xl border border-brand/25 bg-brand-soft/50 p-5">
                <h3 className="font-display font-semibold text-ink">{t("ready")}</h3>
                <div className="mt-3 grid gap-2">
                    {documents.map((document) => (
                        <a key={document.id} href={`/api/projects/${projectId}/documents/${document.id}`} className="flex min-h-11 items-center justify-between rounded-xl bg-white px-3 text-sm text-brand transition-colors hover:text-brand-deep">
                            <span>{document.fileName}</span>
                            <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                                <path d="M10 3v10m0 0 4-4m-4 4-4-4M4 16h12" />
                            </svg>
                        </a>
                    ))}
                </div>
            </div>
        )
    }
    return (
        <div className="rounded-2xl border border-brand/25 bg-brand-soft/50 p-5">
            <h3 className="font-display font-semibold text-ink">{t("title")}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{t("body")}</p>
            {status === "error" ? <p role="alert" className="mt-2 text-sm text-red-700">{t("error")}</p> : null}
            <button type="button" onClick={() => void generate()} disabled={status === "generating"} className="mt-4 min-h-11 cursor-pointer rounded-xl bg-brand px-4 font-medium text-white transition-colors hover:bg-brand-bright disabled:cursor-not-allowed disabled:opacity-50">
                {status === "generating" ? t("generating") : t("generate")}
            </button>
        </div>
    )
}
