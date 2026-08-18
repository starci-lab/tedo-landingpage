import { forwardConsultationRequest } from "@/lib/consultation/backend"

type ConsultationRouteContext = { params: Promise<{ conversationId: string }> }

/** Loads a durable consultation through the private backend origin. */
export const GET = async (_request: Request, context: ConsultationRouteContext): Promise<Response> => {
    const { conversationId } = await context.params
    if (!/^[0-9a-f-]{36}$/i.test(conversationId)) return Response.json({ error: "invalid-conversation" }, { status: 400 })
    return forwardConsultationRequest(`/v1/consultations/${conversationId}`)
}
