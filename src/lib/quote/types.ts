/**
 * Shape of one quote/proposal document.
 *
 * Everything the template renders comes from here — the layout owns no copy of its
 * own. That is the whole point: a proposal is DATA, so the quote system can generate
 * one, a human can edit it, and two proposals sent a month apart cannot drift into
 * different shapes the way hand-edited Canva files do.
 *
 * Money is stored in Vietnamese dong as a plain number. No decimals exist in VND pricing, and
 * keeping it integral avoids float drift when the template sums group totals.
 */

/** One billable line inside a pricing group. */
export interface QuoteLine {
    /** What the client is buying, in their words. */
    label: string
    /** Sub-note under the label — scope detail, not a second heading. */
    detail?: string
    /** Vietnamese dong. Omit for lines that carry no charge (see `badge`). */
    amount?: number
    /**
     * Marks a zero-cost line as something deliberate rather than unpriced:
     * `gift` for a giveaway, `included` for work folded into the group price.
     * Rendered as a chip so the eye separates free-of-charge from has-a-number.
     */
    badge?: "gift" | "included"
}

/** A lettered pricing group (A · DESIGN, B · CUSTOMER APP, ...). */
export interface QuoteGroup {
    /** Single letter shown in the group rule and the summary table. */
    code: string
    title: string
    /** Optional duration note shown beside the title, e.g. "2–3 days". */
    note?: string
    lines: Array<QuoteLine>
}

/** One row of the delivery timeline. */
export interface QuotePhase {
    /** Day range as the client reads it, e.g. "Day 1–3". */
    when: string
    title: string
    body: string
    /** Short tag on the right rail — "Code", "Deploy", "Deadline". */
    tag?: string
}

/** One payment instalment. */
export interface QuoteInstalment {
    label: string
    milestone: string
    /** Percent of the total, 0–100. The template derives the amount from `total`. */
    percent: number
}

/** A recurring or third-party cost the client pays someone else. */
export interface QuoteRunningCost {
    label: string
    note?: string
    /** Free text because these are ranges and periods, not single figures. */
    cost: string
}

/** A feature bullet in the "what you get" grid. */
export interface QuoteFeature {
    title: string
    body: string
    /** `true` marks it as one of the load-bearing features. */
    core?: boolean
}

/** The whole document. */
export interface QuoteDocument {
    /** Internal reference, also used in the filename when printed. */
    reference: string
    client: {
        name: string
        /** Optional line under the client name on the cover. */
        note?: string
    }
    /** ISO date the quote was issued. */
    issuedAt: string
    /** How many days the price holds. Rendered as an explicit expiry date. */
    validDays: number

    /** Cover headline and the paragraph under it. */
    title: string
    summary: string

    /** Facts strip on the cover: platform, duration, who does it. */
    facts: Array<{ label: string; value: string }>

    /** The load-bearing features, shown as the second page. */
    features: Array<QuoteFeature>

    /** Everything inside the fixed price. */
    scope: Array<string>
    /** Explicitly NOT inside the price — stated up front, never discovered later. */
    outOfScope: Array<string>

    phases: Array<QuotePhase>
    groups: Array<QuoteGroup>

    /** Costs paid to providers, not to TEDO. Kept visually separate for that reason. */
    runningCosts: Array<QuoteRunningCost>
    /** How infrastructure cost moves if the client grows. */
    scaleNotes: Array<QuoteRunningCost>

    instalments: Array<QuoteInstalment>

    /** Warranty months included at no charge. */
    warrantyMonths: number
    /** Annual maintenance as a percent band of project value, e.g. [15, 20]. */
    maintenancePercent?: [number, number]

    /** Free-text commitments block at the end. */
    commitments: Array<{ title: string; body: string }>
}

/** Sum of every priced line in a group. */
export const groupTotal = (group: QuoteGroup): number =>
    group.lines.reduce((sum, line) => sum + (line.amount ?? 0), 0)

/** Sum across every group — the number on the cover. */
export const quoteTotal = (doc: QuoteDocument): number =>
    doc.groups.reduce((sum, group) => sum + groupTotal(group), 0)

/** `25000000` → `25.000.000`. Grouped with dots, the Vietnamese convention. */
export const formatDong = (amount: number): string => amount.toLocaleString("vi-VN")

/** Issue date + validity, as a date the client can read off the page. */
export const expiryDate = (doc: QuoteDocument): Date => {
    const date = new Date(doc.issuedAt)
    date.setDate(date.getDate() + doc.validDays)
    return date
}

/** `2026-08-06` → `06/08/2026`. */
export const formatDate = (value: Date | string): string => {
    const date = typeof value === "string" ? new Date(value) : value
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}
