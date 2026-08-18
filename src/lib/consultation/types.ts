/** The participant responsible for one consultation message. */
export type ConsultationRole = "user" | "assistant"

/** Metadata needed to present an uploaded consultation file. */
export interface ConsultationAttachment {
    id: string
    fileName: string
    mimeType: string
    size: number
    kind: "image" | "file"
    previewUrl?: string
}

/** One persisted message in a consultation conversation. */
export interface ConsultationMessage {
    id: string
    role: ConsultationRole
    content: string
    createdAt?: string
    quote?: CommercialQuote
    attachments?: ConsultationAttachment[]
}

/** One selectable answer offered during requirements discovery. */
export interface DiscoveryOption { value: string; label: string }

/** A question that advances requirements discovery. */
export interface DiscoveryQuestion {
    id: string
    field: string
    type: "text" | "number" | "single-select" | "multi-select"
    label: string
    required: boolean
    options?: DiscoveryOption[]
}

/** Progress and remaining questions for requirements discovery. */
export interface DiscoveryState {
    completeness: number
    missingFields: string[]
    nextQuestions: DiscoveryQuestion[]
    readyForProposal: boolean
}

/** Commercial estimate derived from the currently known scope. */
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

/** Complete backend response after processing one consultation turn. */
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

/** Resumable snapshot of a consultation and its associated project. */
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

/** Download metadata for one generated proposal document. */
export interface GeneratedDocumentSummary {
    id: string
    kind: string
    fileName: string
    mimeType: string
}

/** Proposal generation result and all documents produced for it. */
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
