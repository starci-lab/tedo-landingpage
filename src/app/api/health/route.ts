/** Forces the health endpoint to report the current deployment state. */
export const dynamic = "force-dynamic"

/** Returns a lightweight liveness response for the landing app. */
export const GET = (): Response => {
    return Response.json({ status: "ok", service: "tedo-landing" })
}
