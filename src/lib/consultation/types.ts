export type ConsultationRole = "user" | "assistant"

export interface ConsultationAttachment {
    id: string
    fileName: string
    mimeType: string
    size: number
    kind: "image" | "file"
    previewUrl?: string
}

export interface ConsultationMessage {
    id: string
    role: ConsultationRole
    content: string
    createdAt?: string
    quote?: CommercialQuote
    attachments?: ConsultationAttachment[]
}

export interface DiscoveryOption { value: string; label: string }

export interface DiscoveryQuestion {
    id: string
    field: string
    type: "text" | "number" | "single-select" | "multi-select"
    label: string
    required: boolean
    options?: DiscoveryOption[]
}

export interface DiscoveryState {
    completeness: number
    missingFields: string[]
    nextQuestions: DiscoveryQuestion[]
    readyForProposal: boolean
}

export interface CommercialQuote {
    status: "insufficient-scope" | "comparable-match" | "proposal-ready" | "manual-review"
    currency: "VND"
    totalVnd?: number
    rangeMinVnd?: number
    rangeMaxVnd?: number
    timelineMinWeeks?: number
    timelineMaxWeeks?: number
    reviewReasons: string[]
}

export interface ConsultationTurnResponse {
    conversationId: string
    projectId: string
    requirementsVersion: number
    userMessageId: string
    assistantMessageId: string
    answer: string
    commercialQuote: CommercialQuote
    requirements: Record<string, unknown>
    discovery: DiscoveryState
    handoffRequired: boolean
    attachments: ConsultationAttachment[]
}

export interface ConsultationSessionResponse {
    conversationId: string
    status: "open" | "handoff" | "closed"
    messages: ConsultationMessage[]
    project?: {
        projectId: string
        version: number
        requirements: Record<string, unknown>
        discovery: DiscoveryState
    }
}

export interface GeneratedDocumentSummary {
    id: string
    kind: string
    fileName: string
    mimeType: string
}

export interface GeneratedProposalResponse {
    id: string
    projectId: string
    version: number
    documents: GeneratedDocumentSummary[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null

/** Narrows the untrusted consultation response returned through the frontend proxy. */
export const isConsultationTurnResponse = (value: unknown): value is ConsultationTurnResponse => {
    if (!isRecord(value) || !isRecord(value.discovery) || !isRecord(value.commercialQuote)) return false
    return typeof value.conversationId === "string"
        && typeof value.projectId === "string"
        && typeof value.answer === "string"
        && Array.isArray(value.attachments)
        && typeof value.discovery.completeness === "number"
        && Array.isArray(value.discovery.nextQuestions)
}

/** Narrows a resumable consultation read returned by TEDO backend. */
export const isConsultationSessionResponse = (value: unknown): value is ConsultationSessionResponse => {
    if (!isRecord(value) || !Array.isArray(value.messages)) return false
    return typeof value.conversationId === "string"
        && value.messages.every((message) => isRecord(message)
            && (message.role === "user" || message.role === "assistant")
            && typeof message.id === "string"
            && typeof message.content === "string"
            && (message.attachments === undefined || Array.isArray(message.attachments)))
}

/** Narrows document metadata returned after proposal generation. */
export const isGeneratedProposalResponse = (value: unknown): value is GeneratedProposalResponse =>
    isRecord(value)
    && typeof value.id === "string"
    && typeof value.projectId === "string"
    && typeof value.version === "number"
    && Array.isArray(value.documents)
    && value.documents.every((document) => isRecord(document)
        && typeof document.id === "string"
        && typeof document.kind === "string"
        && typeof document.fileName === "string"
        && typeof document.mimeType === "string")
