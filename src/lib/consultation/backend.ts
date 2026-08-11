const LOCAL_BACKEND_URL = "http://127.0.0.1:3030"

/** Returns the private server-to-server TEDO backend origin. */
export const getTedoBackendUrl = (): string =>
    (process.env.TEDO_BACKEND_URL ?? LOCAL_BACKEND_URL).replace(/\/$/, "")

/** Forwards one JSON request while preserving the backend status and response body. */
export const forwardConsultationRequest = async (path: string, init?: RequestInit): Promise<Response> => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 55_000)
    try {
        const response = await fetch(`${getTedoBackendUrl()}${path}`, {
            ...init,
            headers: { "content-type": "application/json", ...init?.headers },
            cache: "no-store",
            signal: controller.signal,
        })
        return new Response(await response.arrayBuffer(), {
            status: response.status,
            headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
        })
    } catch {
        return Response.json({ error: "backend-unavailable" }, { status: 503 })
    } finally {
        clearTimeout(timeout)
    }
}
