import { forwardConsultationRequest } from "@/lib/consultation/backend"
import { acceptConsultationRequest } from "@/lib/consultation/rate-limit"

type LeadRouteContext = { params: Promise<{ conversationId: string }> }

/** Proxies an explicitly consented lead handoff to TEDO backend. */
export const POST = async (request: Request, context: LeadRouteContext): Promise<Response> => {
    if (!acceptConsultationRequest(request, 5, 60_000)) return Response.json({ error: "rate-limited" }, { status: 429 })
    const { conversationId } = await context.params
    if (!/^[0-9a-f-]{36}$/i.test(conversationId)) return Response.json({ error: "invalid-conversation" }, { status: 400 })
    return forwardConsultationRequest(`/v1/consultations/${conversationId}/lead`, { method: "POST", body: await request.text() })
}
