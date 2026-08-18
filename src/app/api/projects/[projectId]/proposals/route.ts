import { generateProjectProposal, toBackendErrorResponse } from "@/lib/consultation/graphql"

type ProjectRouteContext = { params: Promise<{ projectId: string }> }

/** Generates immutable requirements and commercial proposal documents. */
export const POST = async (_request: Request, context: ProjectRouteContext): Promise<Response> => {
    const { projectId } = await context.params
    if (!/^[0-9a-f-]{36}$/i.test(projectId)) return Response.json({ error: "invalid-project" }, { status: 400 })
    try {
        return Response.json(await generateProjectProposal(projectId))
    } catch (error) {
        return toBackendErrorResponse(error)
    }
}
