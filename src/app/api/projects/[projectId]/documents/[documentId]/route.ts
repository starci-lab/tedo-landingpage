import { getTedoBackendUrl } from "@/lib/consultation/backend"

type DocumentRouteContext = { params: Promise<{ projectId: string; documentId: string }> }

/** Streams one immutable generated project document from the private backend. */
export const GET = async (
    _request: Request,
    context: DocumentRouteContext,
): Promise<Response> => {
    const { projectId, documentId } = await context.params
    if (!/^[0-9a-f-]{36}$/i.test(projectId) || !/^[0-9a-f-]{36}$/i.test(documentId)) {
        return Response.json({ error: "invalid-document" }, { status: 400 })
    }
    const response = await fetch(`${getTedoBackendUrl()}/v1/projects/${projectId}/documents/${documentId}/download`, { cache: "no-store" }).catch(() => null)
    if (!response) return Response.json({ error: "backend-unavailable" }, { status: 503 })
    return new Response(response.body, {
        status: response.status,
        headers: {
            "content-type": response.headers.get("content-type") ?? "application/octet-stream",
            "content-disposition": response.headers.get("content-disposition") ?? "attachment",
        },
    })
}
