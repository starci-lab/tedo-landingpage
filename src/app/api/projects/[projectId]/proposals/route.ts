import { forwardConsultationRequest } from "@/lib/consultation/backend"

type ProjectRouteContext = { params: Promise<{ projectId: string }> }

/** Generates immutable requirements and commercial proposal documents. */
export const POST = async (_request: Request, context: ProjectRouteContext): Promise<Response> => {
    const { projectId } = await context.params
    if (!/^[0-9a-f-]{36}$/i.test(projectId)) return Response.json({ error: "invalid-project" }, { status: 400 })
    return forwardConsultationRequest(`/v1/projects/${projectId}/proposals`, { method: "POST" })
}
