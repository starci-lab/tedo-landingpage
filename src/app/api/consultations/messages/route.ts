import { forwardConsultationRequest } from "@/lib/consultation/backend"
import { acceptConsultationRequest } from "@/lib/consultation/rate-limit"

/** Proxies public web consultation turns to the durable TEDO backend. */
export async function POST(request: Request): Promise<Response> {
    if (!acceptConsultationRequest(request)) return Response.json({ error: "rate-limited" }, { status: 429 })
    const contentLength = Number(request.headers.get("content-length") ?? 0)
    if (contentLength > 52_500_000) return Response.json({ error: "payload-too-large" }, { status: 413 })
    return forwardConsultationRequest("/v1/consultations/messages", {
        method: "POST",
        headers: { "content-type": request.headers.get("content-type") ?? "multipart/form-data" },
        body: await request.arrayBuffer(),
    })
}
