import { NextResponse } from "next/server"

type Payload = {
    name?: string
    email?: string
    company?: string
    service?: string
    message?: string
}

export async function POST(request: Request) {
    const body = (await request.json().catch(() => null)) as Payload | null

    if (!body?.name || !body.email || !body.message) {
        return NextResponse.json({ error: "invalid" }, { status: 400 })
    }

    const webhook = process.env.CONTACT_WEBHOOK_URL

    // No delivery target configured yet. Fail loudly rather than returning 200 —
    // a form that silently swallows leads is worse than one that tells the
    // visitor to email directly.
    if (!webhook) {
        console.warn("[contact] CONTACT_WEBHOOK_URL is not set; lead dropped")
        return NextResponse.json({ error: "not-configured" }, { status: 501 })
    }

    const response = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...body, receivedAt: new Date().toISOString() }),
    })

    if (!response.ok) {
        return NextResponse.json({ error: "upstream" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
}
