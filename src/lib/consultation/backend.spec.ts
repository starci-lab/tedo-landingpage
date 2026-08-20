import { afterEach, describe, expect, it, vi } from "vitest"
import { forwardConsultationRequest, getTedoBackendUrl } from "./backend"

describe("TEDO backend forwarding", () => {
    afterEach(() => {
        vi.useRealTimers()
        vi.unstubAllGlobals()
        vi.unstubAllEnvs()
    })

    it("uses the allocated local backend port when no override is configured", () => {
        vi.stubEnv("TEDO_BACKEND_URL", "")
        delete process.env.TEDO_BACKEND_URL

        expect(getTedoBackendUrl()).toBe("http://127.0.0.1:3003")
    })

    it("normalizes an explicit backend URL and preserves the response", async () => {
        vi.stubEnv("TEDO_BACKEND_URL", "http://backend.test/")
        const fetchMock = vi.fn().mockResolvedValue(new Response("ok", {
            status: 202,
            headers: { "content-type": "text/plain" },
        }))
        vi.stubGlobal("fetch", fetchMock)

        const response = await forwardConsultationRequest("/health", {
            headers: { authorization: "Bearer test" },
        })

        expect(fetchMock).toHaveBeenCalledWith("http://backend.test/health", expect.objectContaining({
            cache: "no-store",
            headers: { authorization: "Bearer test", "content-type": "application/json" },
        }))
        expect(response.status).toBe(202)
        expect(response.headers.get("content-type")).toBe("text/plain")
        await expect(response.text()).resolves.toBe("ok")
    })

    it("maps a connection failure to the stable unavailable response", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")))

        const response = await forwardConsultationRequest("/health")

        expect(response.status).toBe(503)
        await expect(response.json()).resolves.toEqual({ error: "backend-unavailable" })
    })

    it("supplies JSON defaults when request and response headers are absent", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(new Uint8Array([123, 125])))
        vi.stubGlobal("fetch", fetchMock)

        const response = await forwardConsultationRequest("/health")

        expect(fetchMock).toHaveBeenCalledWith("http://127.0.0.1:3003/health", expect.objectContaining({
            headers: { "content-type": "application/json" },
        }))
        expect(response.headers.get("content-type")).toBe("application/json")
    })

    it("aborts a backend request after the forwarding timeout", async () => {
        vi.useFakeTimers()
        vi.stubGlobal("fetch", vi.fn((_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
            init.signal?.addEventListener("abort", () => reject(new Error("aborted")))
        })))

        const pending = forwardConsultationRequest("/health")
        await vi.advanceTimersByTimeAsync(55_000)

        await expect(pending.then((response) => response.status)).resolves.toBe(503)
    })
})
