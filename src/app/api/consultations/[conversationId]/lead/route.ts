import { qualifyConsultationLead, toBackendErrorResponse, type QualifyConsultationLeadInput } from "@/lib/consultation/graphql"
import { acceptConsultationRequest } from "@/lib/consultation/rate-limit"

type LeadRouteContext = { params: Promise<{ conversationId: string }> }

/** Proxies an explicitly consented lead handoff to TEDO backend. */
export const POST = async (request: Request, context: LeadRouteContext): Promise<Response> => {
    if (!acceptConsultationRequest(request, 5, 60_000)) return Response.json({ error: "rate-limited" }, { status: 429 })
    const { conversationId } = await context.params
    if (!/^[0-9a-f-]{36}$/i.test(conversationId)) return Response.json({ error: "invalid-conversation" }, { status: 400 })
    const input = await request.json().catch(() => null) as QualifyConsultationLeadInput | null
    if (!input) return Response.json({ error: "invalid-body" }, { status: 400 })
    try {
        return Response.json(await qualifyConsultationLead(conversationId, input))
    } catch (error) {
        return toBackendErrorResponse(error)
    }
}
