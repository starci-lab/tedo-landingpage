import { forwardConsultationRequest } from "@/lib/consultation/backend"

/** Loads a durable consultation through the private backend origin. */
export async function GET(_request: Request, context: { params: Promise<{ conversationId: string }> }): Promise<Response> {
    const { conversationId } = await context.params
    if (!/^[0-9a-f-]{36}$/i.test(conversationId)) return Response.json({ error: "invalid-conversation" }, { status: 400 })
    return forwardConsultationRequest(`/v1/consultations/${conversationId}`)
}
