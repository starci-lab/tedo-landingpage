import { buildSystemPrompt, retrieveContext } from "@/lib/tedo-knowledge"

/** Chat message shape exchanged with the client. */
type ChatMessage = { role: "user" | "assistant"; content: string }

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const MAX_MESSAGES = 20
const MAX_CHARS = 2000

export async function POST(request: Request) {
    const key = process.env.OPENROUTER_API_KEY
    if (!key) {
        // Not configured yet — the widget shows a "chưa bật" notice instead of failing hard.
        return Response.json({ error: "not-configured" }, { status: 503 })
    }

    const body = (await request.json().catch(() => null)) as {
        messages?: Array<ChatMessage>
    } | null

    const raw = body?.messages
    if (!Array.isArray(raw) || raw.length === 0) {
        return Response.json({ error: "invalid" }, { status: 400 })
    }

    // Sanitise: keep only valid roles, trim length, cap history.
    const messages: Array<ChatMessage> = raw
        .filter(
            (m): m is ChatMessage =>
                (m?.role === "user" || m?.role === "assistant") &&
                typeof m.content === "string",
        )
        .slice(-MAX_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))

    const lastUser = [...messages].reverse().find((m) => m.role === "user")
    const context = retrieveContext(lastUser?.content ?? "")
    const system = buildSystemPrompt(context)

    const upstream = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            // OpenRouter attribution headers (optional but recommended).
            "HTTP-Referer": process.env.SITE_URL ?? "http://localhost:3020",
            "X-Title": "TEDO",
        },
        body: JSON.stringify({
            model: process.env.OPENROUTER_MODEL ?? "deepseek/deepseek-v4-flash",
            messages: [{ role: "system", content: system }, ...messages],
            stream: true,
            temperature: 0.4,
            max_tokens: 700,
        }),
    }).catch(() => null)

    if (!upstream || !upstream.ok || !upstream.body) {
        return Response.json({ error: "upstream" }, { status: 502 })
    }

    // Transform OpenRouter's SSE into a plain UTF-8 text stream of content deltas,
    // so the client can just append chunks as they arrive.
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    const reader = upstream.body.getReader()
    let buffer = ""

    const stream = new ReadableStream<Uint8Array>({
        async pull(controller) {
            const { done, value } = await reader.read()
            if (done) {
                controller.close()
                return
            }
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() ?? ""
            for (const line of lines) {
                const trimmed = line.trim()
                if (!trimmed.startsWith("data:")) continue
                const data = trimmed.slice(5).trim()
                if (data === "[DONE]") {
                    controller.close()
                    return
                }
                try {
                    const json = JSON.parse(data)
                    const delta: string | undefined = json?.choices?.[0]?.delta?.content
                    if (delta) controller.enqueue(encoder.encode(delta))
                } catch {
                    // ignore keep-alive / non-JSON lines
                }
            }
        },
        cancel() {
            reader.cancel().catch(() => {})
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
        },
    })
}
