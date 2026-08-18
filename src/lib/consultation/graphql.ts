import { getTedoBackendUrl } from "./backend"

/** One selectable answer offered during requirements discovery. */
export interface DiscoveryOptionData { value: string; label: string }

/** A question that advances requirements discovery. */
export interface DiscoveryQuestionData {
    id: string
    field: string
    type: string
    label: string
    required: boolean
    options?: DiscoveryOptionData[]
}

/** Progress and remaining questions for requirements discovery. */
export interface DiscoveryStateData {
    completeness: number
    missingFields: string[]
    nextQuestions: DiscoveryQuestionData[]
    readyForProposal: boolean
}

/** Branding scope captured for a project. */
export interface BrandingRequirementsData {
    level?: string
    needsNaming?: boolean
    needsLogo?: boolean
    deliverables?: string[]
    revisionRounds?: number
}

/** UX/UI scope captured for a project. */
export interface UxUiRequirementsData {
    research?: boolean
    wireframes?: boolean
    prototype?: boolean
    designSystem?: boolean
    responsive?: boolean
    estimatedScreens?: number
    revisionRounds?: number
}

/** Delivery scope captured for a project. */
export interface DeliveryRequirementsData {
    desiredWeeks?: number
    warrantyMonths?: number
    dataMigration?: string
    hosting?: string
    supportLevel?: string
}

/** Accumulated business and delivery facts for a project. */
export interface ProjectRequirementsData {
    projectName?: string
    productType?: string
    industry?: string
    businessModel?: string
    businessStage?: string
    locations?: number
    languages?: number
    businessGoals?: string[]
    channels?: string[]
    roles?: string[]
    modules?: string[]
    integrations?: string[]
    branding?: BrandingRequirementsData
    uxUi?: UxUiRequirementsData
    delivery?: DeliveryRequirementsData
    budgetVnd?: number
}

/** Current versioned requirements aggregate and next discovery questions. */
export interface ProjectRequirementSnapshotData {
    projectId: string
    revisionId: string
    version: number
    requirements: ProjectRequirementsData
    discovery: DiscoveryStateData
    confirmedAt?: string
}

/** Safe attachment view returned when a customer resumes a consultation. */
export interface ConsultationAttachmentData {
    id: string
    fileName: string
    mimeType: string
    size: number
    kind: string
}

/** One durable message returned when a customer resumes a consultation. */
export interface ConsultationMessageData {
    id: string
    role: string
    content: string
    citations: unknown[]
    quote?: unknown
    attachments: ConsultationAttachmentData[]
    createdAt: string
}

/** Resumable consultation history and its accumulated project requirements. */
export interface ConsultationSessionData {
    conversationId: string
    channel: string
    status: string
    lastMessageAt: string
    messages: ConsultationMessageData[]
    project?: ProjectRequirementSnapshotData
}

/** Explicitly consented contact details submitted for project follow-up. */
export interface QualifyConsultationLeadInput {
    name: string
    phone?: string
    email?: string
    company?: string
    preferredChannel: "phone" | "zalo" | "email"
    consent: true
}

/** Durable result after a consultation becomes a qualified lead. */
export interface QualifiedConsultationLeadData {
    leadId: string
    status: string
}

/** A comparable prior case surfaced beside a commercial estimate. */
export interface EstimateComparableData {
    caseId: string
    displayName: string
    mayNamePublicly: boolean
}

/** One priced line item on a commercial estimate. */
export interface CommercialPriceLineData {
    code: string
    label: string
    quantity: number
    unitPriceVnd: number
    amountVnd: number
    reviewed: boolean
}

/** Commercial estimate derived from the currently known scope. */
export interface CommercialEstimateData {
    status: string
    currency: string
    subtotalVnd?: number
    discountVnd?: number
    totalVnd?: number
    rangeMinVnd?: number
    rangeMaxVnd?: number
    timelineMinWeeks?: number
    timelineMaxWeeks?: number
    comparable?: EstimateComparableData
    similarity?: number
    lines: CommercialPriceLineData[]
    missingFields: string[]
    reviewReasons: string[]
    requirements: ProjectRequirementsData
}

/** Download metadata for one generated proposal document. */
export interface GeneratedDocumentSummaryData {
    id: string
    kind: string
    fileName: string
    mimeType: string
    downloadUrl: string
}

/** Proposal generation result and all documents produced for it. */
export interface GeneratedProposalData {
    id: string
    projectId: string
    version: number
    status: string
    estimate: CommercialEstimateData
    lines: CommercialPriceLineData[]
    documents: GeneratedDocumentSummaryData[]
}

/**
 * Domain failure surfaced by the backend's GraphQL door, carrying the same `code`/`message`/`metadata`
 * an `AbstractException` would have carried through the REST door's `AbstractExceptionHttpFilter`, plus
 * the HTTP-equivalent `status` the GraphQL error formatter attaches at `extensions.status`.
 */
/** Constructor input for {@link BackendGraphqlError}. */
export interface BackendGraphqlErrorParams {
    code: string
    message: string
    status: number
    metadata: Record<string, unknown>
}

export class BackendGraphqlError extends Error {
    readonly code: string
    readonly status: number
    readonly metadata: Record<string, unknown>

    constructor(params: BackendGraphqlErrorParams) {
        super(params.message)
        this.name = "BackendGraphqlError"
        this.code = params.code
        this.status = params.status
        this.metadata = params.metadata
    }
}

/** Raised when the backend GraphQL endpoint could not be reached or returned no usable body. */
export class BackendUnavailableError extends Error {
    constructor() {
        super("backend-unavailable")
        this.name = "BackendUnavailableError"
    }
}

interface GraphqlErrorEntry {
    message: string
    extensions?: { code?: string; status?: number; metadata?: Record<string, unknown> }
}

interface GraphqlResponseBody<TData> {
    data?: TData
    errors?: GraphqlErrorEntry[]
}

const GRAPHQL_TIMEOUT_MS = 55_000

/** Posts one GraphQL operation to the private backend and returns its `data`, translating transport failure into a typed error. */
const executeGraphqlOperation = async <TData>(query: string, variables: Record<string, unknown>): Promise<TData> => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), GRAPHQL_TIMEOUT_MS)
    let response: Response
    try {
        response = await fetch(`${getTedoBackendUrl()}/graphql`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ query, variables }),
            cache: "no-store",
            signal: controller.signal,
        })
    } catch {
        throw new BackendUnavailableError()
    } finally {
        clearTimeout(timeout)
    }

    let body: GraphqlResponseBody<TData>
    try {
        body = await response.json() as GraphqlResponseBody<TData>
    } catch {
        throw new BackendUnavailableError()
    }

    const failure = body.errors?.[0]
    if (failure) {
        throw new BackendGraphqlError({
            code: failure.extensions?.code ?? "BACKEND_GRAPHQL_ERROR",
            message: failure.message,
            // Mirrors `statusForCode`'s own unmapped default (`status-for-code.ts`) rather than
            // inventing a third fallback status the two transports could drift from.
            status: failure.extensions?.status ?? 500,
            metadata: failure.extensions?.metadata ?? {},
        })
    }
    if (!body.data) throw new BackendUnavailableError()
    return body.data
}

/** Translates a thrown backend transport error into the same envelope `forwardConsultationRequest` produced for REST. */
export const toBackendErrorResponse = (error: unknown): Response => {
    if (error instanceof BackendGraphqlError) {
        return Response.json({ code: error.code, message: error.message, metadata: error.metadata }, { status: error.status })
    }
    return Response.json({ error: "backend-unavailable" }, { status: 503 })
}

const PROJECT_REQUIREMENTS_FIELDS = `
    projectName
    productType
    industry
    businessModel
    businessStage
    locations
    languages
    businessGoals
    channels
    roles
    modules
    integrations
    budgetVnd
    branding { level needsNaming needsLogo deliverables revisionRounds }
    uxUi { research wireframes prototype designSystem responsive estimatedScreens revisionRounds }
    delivery { desiredWeeks warrantyMonths dataMigration hosting supportLevel }
`

const DISCOVERY_STATE_FIELDS = `
    completeness
    missingFields
    readyForProposal
    nextQuestions { id field type label required options { value label } }
`

const PROJECT_SNAPSHOT_FIELDS = `
    projectId
    revisionId
    version
    confirmedAt
    requirements { ${PROJECT_REQUIREMENTS_FIELDS} }
    discovery { ${DISCOVERY_STATE_FIELDS} }
`

const CONSULTATION_QUERY = `
    query Consultation($conversationId: ID!) {
        consultation(conversationId: $conversationId) {
            conversationId
            channel
            status
            lastMessageAt
            messages {
                id
                role
                content
                citations
                quote
                attachments { id fileName mimeType size kind }
                createdAt
            }
            project { ${PROJECT_SNAPSHOT_FIELDS} }
        }
    }
`

/** Loads a durable consultation and its accumulated project requirements over GraphQL. */
export const fetchConsultation = async (conversationId: string): Promise<ConsultationSessionData> => {
    const data = await executeGraphqlOperation<{ consultation: ConsultationSessionData }>(
        CONSULTATION_QUERY, { conversationId },
    )
    return data.consultation
}

const QUALIFY_CONSULTATION_LEAD_MUTATION = `
    mutation QualifyConsultationLead($conversationId: ID!, $input: QualifyConsultationLeadInput!) {
        qualifyConsultationLead(conversationId: $conversationId, input: $input) {
            leadId
            status
        }
    }
`

/** Turns a saved consultation into a reachable lead over GraphQL. */
export const qualifyConsultationLead = async (
    conversationId: string,
    input: QualifyConsultationLeadInput,
): Promise<QualifiedConsultationLeadData> => {
    const data = await executeGraphqlOperation<{ qualifyConsultationLead: QualifiedConsultationLeadData }>(
        QUALIFY_CONSULTATION_LEAD_MUTATION, { conversationId, input },
    )
    return data.qualifyConsultationLead
}

const CONFIRM_PROJECT_REQUIREMENTS_MUTATION = `
    mutation ConfirmProjectRequirements($projectId: String!) {
        confirmProjectRequirements(projectId: $projectId) { ${PROJECT_SNAPSHOT_FIELDS} }
    }
`

/** Freezes the current complete requirements revision before commercial generation, over GraphQL. */
export const confirmProjectRequirements = async (projectId: string): Promise<ProjectRequirementSnapshotData> => {
    const data = await executeGraphqlOperation<{ confirmProjectRequirements: ProjectRequirementSnapshotData }>(
        CONFIRM_PROJECT_REQUIREMENTS_MUTATION, { projectId },
    )
    return data.confirmProjectRequirements
}

const GENERATE_PROJECT_PROPOSAL_MUTATION = `
    mutation GenerateProjectProposal($projectId: String!) {
        generateProjectProposal(projectId: $projectId) {
            id
            projectId
            version
            status
            estimate {
                status
                currency
                subtotalVnd
                discountVnd
                totalVnd
                rangeMinVnd
                rangeMaxVnd
                timelineMinWeeks
                timelineMaxWeeks
                comparable { caseId displayName mayNamePublicly }
                similarity
                lines { code label quantity unitPriceVnd amountVnd reviewed }
                missingFields
                reviewReasons
                requirements { ${PROJECT_REQUIREMENTS_FIELDS} }
            }
            lines { code label quantity unitPriceVnd amountVnd reviewed }
            documents { id kind fileName mimeType downloadUrl }
        }
    }
`

/** Generates one immutable draft proposal version and its customer documents, over GraphQL. */
export const generateProjectProposal = async (projectId: string): Promise<GeneratedProposalData> => {
    const data = await executeGraphqlOperation<{ generateProjectProposal: GeneratedProposalData }>(
        GENERATE_PROJECT_PROPOSAL_MUTATION, { projectId },
    )
    return data.generateProjectProposal
}
