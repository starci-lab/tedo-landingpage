import { getTedoBackendUrl } from "@/lib/consultation/backend"

export async function GET(_request: Request, context: { params: Promise<{ conversationId: string; attachmentId: string }> }): Promise<Response> {
    const { conversationId, attachmentId } = await context.params
    const response = await fetch(`${getTedoBackendUrl()}/v1/consultations/${encodeURIComponent(conversationId)}/attachments/${encodeURIComponent(attachmentId)}`, { cache: "no-store" })
    const headers = new Headers({
        "content-type": response.headers.get("content-type") ?? "application/octet-stream",
        "content-disposition": response.headers.get("content-disposition") ?? "attachment",
        "x-content-type-options": "nosniff",
    })
    const contentLength = response.headers.get("content-length")
    if (contentLength) headers.set("content-length", contentLength)
    return new Response(response.body, {
        status: response.status,
        headers,
    })
}
