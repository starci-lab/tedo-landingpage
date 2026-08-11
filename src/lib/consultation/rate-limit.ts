interface RateWindow { count: number; resetAt: number }

const windows = new Map<string, RateWindow>()

/** Applies a small single-instance abuse guard before requests can consume model credits. */
export const acceptConsultationRequest = (request: Request, limit = 12, durationMs = 60_000): boolean => {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    const key = `${forwarded ?? request.headers.get("x-real-ip") ?? "local"}:consultation`
    const now = Date.now()
    const current = windows.get(key)
    if (!current || current.resetAt <= now) {
        windows.set(key, { count: 1, resetAt: now + durationMs })
        return true
    }
    if (current.count >= limit) return false
    current.count += 1
    return true
}
