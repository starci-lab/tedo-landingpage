import { forwardConsultationRequest } from "@/lib/consultation/backend"

/** Confirms the current complete requirements revision before document generation. */
export async function POST(_request: Request, context: { params: Promise<{ projectId: string }> }): Promise<Response> {
    const { projectId } = await context.params
    if (!/^[0-9a-f-]{36}$/i.test(projectId)) return Response.json({ error: "invalid-project" }, { status: 400 })
    return forwardConsultationRequest(`/v1/projects/${projectId}/requirements/confirm`, { method: "POST" })
}
