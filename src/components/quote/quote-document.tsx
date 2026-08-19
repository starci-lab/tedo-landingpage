import type { ReactNode } from "react"
import { brand } from "@/config/brand"
import { useTranslations } from "next-intl"
import {
    expiryDate,
    formatDate,
    formatDong,
    groupTotal,
    quoteTotal,
    type QuoteDocument as QuoteData,
    type QuoteGroup,
    type QuoteLine,
} from "@/lib/quote/types"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
import type { ContractComponent } from "@/components/contracts/props"
import { Heading } from "@/components/leaves/Heading"

/**
 * The printable proposal. One data object in, a set of A4 sheets out.
 *
 * WHY THIS IS CODE AND NOT A CANVA FILE. A proposal is the only document where the
 * price book, the scope list and the payment terms all appear at once — so it is the
 * one place they can silently disagree with each other. Keeping it as a template the
 * quote system renders means those numbers have exactly one source; a design file
 * edited by hand means every proposal is a fresh chance to send a stale price.
 *
 * PLAIN TAILWIND, NO HEROUI. HeroUI v3 sits on react-aria-components, which is
 * `client-only` — every importing file would need `"use client"`. This document has
 * no interactivity at all, so it stays a server component. It also needs print
 * control that an interactive component library actively fights.
 *
 * PRINT MODEL. Each `<Page>` is a fixed A4 box that maps 1:1 to a sheet, with
 * `break-after: page`. The browser's own "Save as PDF" is the exporter — no PDF
 * dependency, and the client can read it on a phone as a web page instead.
 *
 * ITS OWN TYPE SCALE, NOT THE SHARED `Heading` LEAF'S. Every point size on this page
 * was tuned by hand against the row-budget math in `FIRST_PRICING_SHEET_ROWS` - this
 * is print typesetting, not the marketing site's rem scale. `no-heading-tag-outside-
 * heading-component` still requires every `<h1>`-`<h4>` to come from that one leaf,
 * so headings here render at the leaf's nearest matching level; the surrounding
 * point-sized paragraphs around them keep their exact tuned sizes untouched.
 * `<table>`/`<tr>`/`<td>`/`<th>`/`<article>`/`<dt>`/`<dd>` carry no landmark meaning
 * to the FE canon's structural-host law, so the pricing tables and the card-shaped
 * blocks below keep their literal classes exactly as tuned.
 */

const money = (amount: number) => `${formatDong(amount)} đ` // vn-ok: VND currency symbol is deliberate in every quote locale.

/**
 * How many table rows the FIRST pricing sheet can hold once the summary table and
 * the intro line have taken their share. Groups are packed in order until this is
 * reached, then the rest spill to the next sheet.
 *
 * Measured, not guessed: 27 priced lines across 5 groups overflowed a single A4 to
 * ~1.8 sheets, which is how the original PDF ended up truncating its own last line
 * mid-word. A row budget keeps the split deterministic instead of leaving it to
 * whatever the browser does at the page boundary.
 */
const FIRST_PRICING_SHEET_ROWS = 16

type PageProps = { render: ContractComponent<"opaque-content-unit">; index: number; total: number }
type SectionHeadingProps = { eyebrow: string; title: string }
type LineBadgeProps = { badge: NonNullable<QuoteLine["badge"]> }
type GroupBlockProps = { group: QuoteGroup }
type NoteTableRow = { label: string; note?: string; cost: string }
type NoteTableProps = { rows: Array<NoteTableRow>; head: [string, string, string] }
type QuoteDocumentProps = { doc: QuoteData }
type FeatureMetaRowProps = { index: number; isCore: boolean; coreLabel: string }
type PhaseWhenProps = { value: string }
type PhaseBodyProps = { title: string; body: string }

/** Splits pricing groups across sheets without ever breaking a group in half. */
const splitGroups = (groups: Array<QuoteGroup>) => {
    const first: Array<QuoteGroup> = []
    const rest: Array<QuoteGroup> = []
    let budget = FIRST_PRICING_SHEET_ROWS
    for (const group of groups) {
        const rows = group.lines.length + 1 // + the group's own header row
        if (rest.length === 0 && rows <= budget) {
            first.push(group)
            budget -= rows
        } else {
            rest.push(group)
        }
    }
    return { first, rest }
}

/** Closes already-drawn content into the one checked identity `Page`, `Tree` and `Reveal` all share. */
const opaque = (render: () => ReactNode) => defineContractProjection("opaque-content-unit", render)

/** One A4 sheet. Fixed size so screen preview and print agree. */
const Page = ({ render, index, total }: PageProps) => {
    const t = useTranslations("quote")
    return (
        <article
            className="quote-page mx-auto w-print-a4 bg-canvas px-print-page py-print-page text-ink-body shadow-[0_1px_3px_rgba(20,48,92,0.12)] print:shadow-none"
            style={{ minHeight: "var(--print-a4-height)" }}
        >
            {render.kind === "projection" ? render.project() : null}
            <Tree
                contract="quote-page-footer"
                render={defineContractComponent("quote-page-footer", {
                    left: defineLeafComponent("text", {}, () => (
                        <span>{brand.name} · {t("footer.service")}</span>
                    )),
                    right: defineLeafComponent("text", {}, () => <span>{t("footer.page", { index, total })}</span>),
                })}
            />
        </article>
    )
}

/** Section heading used on every inner page. */
const SectionHeading = ({ eyebrow, title }: SectionHeadingProps) => (
    <Tree
        contract="quote-section-heading"
        render={defineContractComponent("quote-section-heading", {
            eyebrow: opaque(() => (
                <p className="font-mono text-[8pt] uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
            )),
            title: defineLeafComponent("heading", {}, () => <Heading props={{ content: title, level: 2 }} />),
        })}
    />
)

const FeatureMetaRow = ({ index, isCore, coreLabel }: FeatureMetaRowProps) => (
    <Tree
        contract="quote-feature-meta-row"
        render={defineContractComponent("quote-feature-meta-row", {
            index: opaque(() => (
                <span className="font-mono text-[8pt] text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
            )),
            badge: isCore
                ? opaque(() => (
                    <span className="rounded bg-accent/12 px-1 py-1 text-[7pt] font-semibold uppercase tracking-wider text-accent-dim">
                        {coreLabel}
                    </span>
                ))
                : undefined,
        })}
    />
)

const PhaseWhen = ({ value }: PhaseWhenProps) => (
    <Tree
        contract="quote-phase-when"
        render={defineContractComponent("quote-phase-when", {
            value: defineLeafComponent("text", {}, () => <span>{value}</span>),
        })}
    />
)

const PhaseBody = ({ title, body }: PhaseBodyProps) => (
    <Tree
        contract="quote-phase-body"
        render={defineContractComponent("quote-phase-body", {
            title: opaque(() => <p className="font-display text-[10pt] font-semibold text-ink">{title}</p>),
            body: opaque(() => <p className="mt-1 text-[8.5pt] leading-relaxed text-ink-muted">{body}</p>),
        })}
    />
)

const renderMaintenanceStrong = (chunks: ReactNode) => <strong className="font-semibold text-ink">{chunks}</strong>

const lineAmount = (line: QuoteLine): ReactNode => {
    if (line.amount != null) return <span className="text-[9pt] tabular-nums text-ink-body">{money(line.amount)}</span>
    if (line.badge) return <LineBadge badge={line.badge} />
    return null
}

/** Zero-cost lines are marked, never left blank — blank reads as "not priced yet". */
const LineBadge = ({ badge }: LineBadgeProps) => {
    const t = useTranslations("quote")
    const BADGE_CLASSES = {
        gift: "inline-block rounded px-1 py-1 text-[7.5pt] font-medium bg-accent/12 text-accent-dim",
        included: "inline-block rounded px-1 py-1 text-[7.5pt] font-medium bg-brand-soft text-brand",
    } as const
    const BADGE_TEXT = {
        gift: t("badge.gift"),
        included: t("badge.included"),
    } as const
    return <span className={BADGE_CLASSES[badge]}>{BADGE_TEXT[badge]}</span>
}

/** A pricing group: tinted header row carrying its own subtotal, then its lines. */
const GroupBlock = ({ group }: GroupBlockProps) => (
    <tbody className="break-inside-avoid">
        <tr className="bg-brand-soft/70">
            <td className="w-print-col-index py-1 pl-2 align-middle font-display text-[10pt] font-bold text-brand">
                {group.code}
            </td>
            <td className="py-1 pr-3 align-middle font-display text-[10pt] font-semibold text-ink">
                {group.title}
                {group.note ? <span className="ml-2 font-sans text-[8pt] font-normal text-ink-muted">{group.note}</span> : null}
            </td>
            <td className="py-1 pr-2 text-right align-middle font-display text-[10pt] font-bold tabular-nums text-ink">
                {money(groupTotal(group))}
            </td>
        </tr>
        {group.lines.map((line) => (
            <tr key={line.label} className="border-b border-line/70 last:border-b-0">
                <td />
                <td className="py-print-row pr-3">
                    <span className="text-[9pt] text-ink-body">{line.label}</span>
                    {line.detail ? (
                        <span className="block text-[7.5pt] leading-tight text-ink-faint">{line.detail}</span>
                    ) : null}
                </td>
                <td className="py-print-row pr-2 text-right align-top">
                    {lineAmount(line)}
                </td>
            </tr>
        ))}
    </tbody>
)

/** Simple two-or-three column reference table used for running costs and scale notes. */
const NoteTable = ({ rows, head }: NoteTableProps) => (
    <table className="w-full border-collapse text-[8.5pt]">
        <thead>
            <tr className="border-b border-line-strong text-left">
                {head.map((cell, i) => (
                    <th
                        key={cell}
                        className={
                            i === 2
                                ? "pb-1 text-right font-display text-[8pt] font-semibold uppercase tracking-wide text-brand"
                                : "pb-1 font-display text-[8pt] font-semibold uppercase tracking-wide text-brand"
                        }
                    >
                        {cell}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map((row) => (
                <tr key={row.label} className="border-b border-line/70 last:border-b-0">
                    <td className="py-1 pr-3 text-ink-body">{row.label}</td>
                    <td className="py-1 pr-3 text-ink-faint">{row.note}</td>
                    <td className="py-1 text-right tabular-nums text-ink-body">{row.cost}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

/**
 * Renders one proposal.
 *
 * @param doc - the proposal data; see `lib/quote/types.ts`
 */
export const QuoteDocument = ({ doc }: QuoteDocumentProps) => {
    const t = useTranslations("quote")
    const total = quoteTotal(doc)
    const priced = splitGroups(doc.groups)
    const hasSecondPricingSheet = priced.rest.length > 0
    // Sheet numbers shift by one when pricing needs a second sheet, so they are
    // derived rather than written in — a hand-numbered footer is exactly the kind
    // of thing that silently goes wrong the first time a quote gets one line longer.
    const runningSheet = hasSecondPricingSheet ? 6 : 5
    const termsSheet = runningSheet + 1
    const pages = termsSheet

    return (
        <Tree
            contract="quote-document-shell"
            render={defineContractComponent("quote-document-shell", {
                pages: opaque(() => (
                    <>
                        {/* ── 1 · Cover ─────────────────────────────────────────────── */}
                        <Page index={1} total={pages} render={opaque(() => (
                            <>
                                <Tree
                                    contract="quote-cover-header-row"
                                    render={defineContractComponent("quote-cover-header-row", {
                                        identity: opaque(() => (
                                            <span>
                                                <p className="font-display text-[13pt] font-bold tracking-tight text-brand-deep">{brand.name}</p>
                                                <p className="mt-1 font-mono text-[7.5pt] uppercase tracking-[0.22em] text-ink-faint">{t("cover.tagline")}</p>
                                            </span>
                                        )),
                                        meta: opaque(() => (
                                            <span className="block text-right text-[8pt] text-ink-muted">
                                                <p>{t("cover.date", { date: formatDate(doc.issuedAt) })}</p>
                                                <p className="text-ink-faint">{t("cover.expiry", { date: formatDate(expiryDate(doc)) })}</p>
                                                <p className="mt-1 font-mono text-[7.5pt] text-ink-faint">{doc.reference}</p>
                                            </span>
                                        )),
                                    })}
                                />

                                <span className="mt-16 block">
                                    <p className="font-mono text-[8pt] uppercase tracking-[0.2em] text-accent">{t("cover.eyebrow")}</p>
                                    <Heading props={{ content: doc.client.name, level: 1 }} />
                                    {doc.client.note ? <p className="mt-2 text-[10pt] text-ink-muted">{doc.client.note}</p> : null}

                                    <p className="mt-7 max-w-print-medium font-display text-[14pt] font-medium leading-snug text-brand-deep">
                                        {doc.title}
                                    </p>
                                    <p className="mt-3 max-w-print-medium text-[10pt] leading-relaxed text-ink-body">{doc.summary}</p>
                                </span>

                                <Tree
                                    contract="quote-facts-grid"
                                    render={defineContractComponent("quote-facts-grid", {
                                        facts: opaque(() => (
                                            <>
                                                {doc.facts.map((fact) => (
                                                    <span key={fact.label} className="block bg-surface px-4 py-3">
                                                        <dt className="font-mono text-[7pt] uppercase tracking-wider text-ink-faint">{fact.label}</dt>
                                                        <dd className="mt-1 font-display text-[10.5pt] font-semibold text-ink">{fact.value}</dd>
                                                    </span>
                                                ))}
                                            </>
                                        )),
                                    })}
                                />

                                <span className="mt-8 block rounded-xl bg-brand-deep px-7 py-6 text-white">
                                    <p className="font-mono text-[7.5pt] uppercase tracking-[0.2em] text-white/60">
                                        {t("totalLabel")}
                                    </p>
                                    <p className="mt-2 font-display text-[30pt] font-bold leading-none tabular-nums">{money(total)}</p>
                                    <p className="mt-3 text-[8.5pt] leading-relaxed text-white/70">
                                        {t("cover.totalDescription", { months: doc.warrantyMonths, page: runningSheet })}
                                    </p>
                                </span>
                            </>
                        ))} />

                        {/* ── 2 · Core features ─────────────────────────────────────── */}
                        <Page index={2} total={pages} render={opaque(() => (
                            <>
                                <SectionHeading eyebrow={t("features.eyebrow")} title={t("features.title")} />
                                <p className="-mt-3 mb-6 max-w-print-wide text-[9.5pt] leading-relaxed text-ink-muted">
                                    {t("features.description")}
                                </p>

                                <Tree
                                    contract="quote-feature-grid"
                                    render={defineContractComponent("quote-feature-grid", {
                                        cards: opaque(() => (
                                            <>
                                                {doc.features.map((feature, i) => (
                                                    <article
                                                        key={feature.title}
                                                        className="break-inside-avoid rounded-lg border border-line bg-surface-2/60 p-5"
                                                    >
                                                        <FeatureMetaRow index={i} isCore={feature.core === true} coreLabel={t("features.core")} />
                                                        <span className="mt-2 block">
                                                            <Heading props={{ content: feature.title, level: 3 }} />
                                                        </span>
                                                        <p className="mt-2 text-[9pt] leading-relaxed text-ink-body">{feature.body}</p>
                                                    </article>
                                                ))}
                                            </>
                                        )),
                                    })}
                                />
                            </>
                        ))} />

                        {/* ── 3 · Scope ─────────────────────────────────────────────── */}
                        <Page index={3} total={pages} render={opaque(() => (
                            <>
                                <SectionHeading eyebrow={t("scope.eyebrow")} title={t("scope.title")} />

                                <Tree
                                    contract="quote-scope-list"
                                    render={defineContractComponent("quote-scope-list", {
                                        items: doc.scope.map((item) => defineContractComponent("quote-scope-item", {
                                            mark: opaque(() => <span aria-hidden className="mt-print-row block text-green">✓</span>),
                                            label: opaque(() => <span>{item}</span>),
                                        })),
                                    })}
                                />

                                {doc.outOfScope.length > 0 ? (
                                    <span className="mt-7 block rounded-lg border-l-[3px] border-accent bg-accent/6 py-4 pl-4 pr-5">
                                        <p className="font-display text-[9.5pt] font-semibold text-accent-dim">{t("scope.outOfScope")}</p>
                                        <Tree
                                            contract="quote-out-of-scope-list"
                                            render={defineContractComponent("quote-out-of-scope-list", {
                                                items: doc.outOfScope.map((item) => defineContractComponent("quote-note-list-item", {
                                                    content: opaque(() => <>{item}</>),
                                                })),
                                            })}
                                        />
                                    </span>
                                ) : null}

                                <span className="mt-9 block">
                                    <Heading props={{ content: t("scope.timeline"), level: 3 }} />
                                </span>
                                <span className="mt-4 block">
                                    <ol>
                                        {doc.phases.map((phase) => (
                                            <Tree
                                                key={phase.when}
                                                contract="quote-phase-item"
                                                render={defineContractComponent("quote-phase-item", {
                                                    when: opaque(() => <PhaseWhen value={phase.when} />),
                                                    body: opaque(() => <PhaseBody title={phase.title} body={phase.body} />),
                                                    tag: phase.tag
                                                        ? opaque(() => (
                                                            <span className="rounded bg-surface-2 px-2 py-1 text-[7.5pt] text-ink-faint">
                                                                {phase.tag}
                                                            </span>
                                                        ))
                                                        : undefined,
                                                })}
                                            />
                                        ))}
                                    </ol>
                                </span>
                            </>
                        ))} />

                        {/* ── 4 · Pricing ───────────────────────────────────────────── */}
                        <Page index={4} total={pages} render={opaque(() => (
                            <>
                                <SectionHeading eyebrow={t("pricing.eyebrow")} title={t("pricing.title")} />

                                {/* Summary first: the shape of the number before the 25 lines that make it. */}
                                <table className="mb-5 w-full border-collapse">
                                    <tbody>
                                        {doc.groups.map((group) => (
                                            <tr key={group.code} className="border-b border-line/70">
                                                <td className="w-print-col-index py-1 font-display text-[9pt] font-bold text-brand">{group.code}</td>
                                                <td className="py-1 pr-3 text-[9pt] text-ink-body">{group.title}</td>
                                                <td className="py-1 text-right text-[9pt] tabular-nums text-ink-body">
                                                    {money(groupTotal(group))}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="border-t-2 border-brand-deep">
                                            <td colSpan={2} className="pt-2 font-display text-[10.5pt] font-bold text-ink">
                                                {t("totalLabel")}
                                            </td>
                                            <td className="pt-2 text-right font-display text-[13pt] font-bold tabular-nums text-brand-deep">
                                                {money(total)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <p className="mb-2 text-[8.5pt] leading-relaxed text-ink-muted">
                                    {t("pricing.unitDescription")}
                                </p>

                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-line-strong">
                                            <th className="w-print-col-index" />
                                            <th className="pb-1 text-left font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                                {t("pricing.item")}
                                            </th>
                                            <th className="pb-1 pr-2 text-right font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                                {t("pricing.amount")}
                                            </th>
                                        </tr>
                                    </thead>
                                    {priced.first.map((group) => (
                                        <GroupBlock key={group.code} group={group} />
                                    ))}
                                </table>
                            </>
                        ))} />

                        {/* ── 5 · Pricing, continued ────────────────────────────────── */}
                        {hasSecondPricingSheet ? (
                            <Page index={5} total={pages} render={opaque(() => (
                                <>
                                    <SectionHeading eyebrow={t("pricing.eyebrow")} title={t("pricing.continuedTitle")} />
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-line-strong">
                                                <th className="w-print-col-index" />
                                                <th className="pb-1 text-left font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                                    {t("pricing.item")}
                                                </th>
                                                <th className="pb-1 pr-2 text-right font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                                    {t("pricing.amount")}
                                                </th>
                                            </tr>
                                        </thead>
                                        {priced.rest.map((group) => (
                                            <GroupBlock key={group.code} group={group} />
                                        ))}
                                        <tbody>
                                            <tr className="border-t-2 border-brand-deep">
                                                <td colSpan={2} className="pt-2 font-display text-[10.5pt] font-bold text-ink">
                                                    {t("totalLabel")}
                                                </td>
                                                <td className="pt-2 pr-2 text-right font-display text-[13pt] font-bold tabular-nums text-brand-deep">
                                                    {money(total)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <p className="mt-5 rounded-lg bg-surface-2/70 px-4 py-3 text-[8.5pt] leading-relaxed text-ink-muted">
                                        {t("pricing.includedNote", { brand: brand.name })}
                                    </p>
                                </>
                            ))} />
                        ) : null}

                        {/* ── Running cost ──────────────────────────────────────────── */}
                        <Page index={runningSheet} total={pages} render={opaque(() => (
                            <>
                                <SectionHeading eyebrow={t("running.eyebrow")} title={t("running.title")} />

                                <Tree
                                    contract="quote-running-title-row"
                                    render={defineContractComponent("quote-running-title-row", {
                                        title: defineLeafComponent("heading", {}, () => (
                                            <Heading props={{ content: t("running.costTitle"), level: 3 }} />
                                        )),
                                        badge: opaque(() => (
                                            <span className="rounded bg-brand-soft px-2 py-1 text-[7.5pt] font-medium text-brand">
                                                {t("running.providerBadge", { brand: brand.name })}
                                            </span>
                                        )),
                                    })}
                                />
                                <NoteTable rows={doc.runningCosts} head={[t("running.item"), t("running.note"), t("running.cost")]} />

                                <span className="mb-2 mt-8 block">
                                    <Heading props={{ content: t("running.scaleTitle"), level: 3 }} />
                                </span>
                                <p className="mb-3 text-[8.5pt] leading-relaxed text-ink-muted">
                                    {t("running.scaleDescription")}
                                </p>
                                <NoteTable rows={doc.scaleNotes} head={[t("running.factor"), t("running.impact"), t("running.estimatedCost")]} />

                                <span className="mt-8 block rounded-lg border border-line bg-surface-2/70 p-5">
                                    <Heading props={{ content: t("running.warrantyTitle", { months: doc.warrantyMonths }), level: 3 }} />
                                    <p className="mt-2 text-[9pt] leading-relaxed text-ink-body">
                                        {t("running.warrantyDescription", { months: doc.warrantyMonths })}
                                    </p>
                                    {doc.maintenancePercent ? (
                                        <p className="mt-2 text-[9pt] leading-relaxed text-ink-body">
                                            {t.rich("running.maintenanceDescription", {
                                                months: doc.warrantyMonths,
                                                min: doc.maintenancePercent[0],
                                                max: doc.maintenancePercent[1],
                                                strong: renderMaintenanceStrong,
                                            })}
                                        </p>
                                    ) : null}
                                </span>
                            </>
                        ))} />

                        {/* ── Terms ─────────────────────────────────────────────────── */}
                        <Page index={termsSheet} total={pages} render={opaque(() => (
                            <>
                                <SectionHeading eyebrow={t("terms.eyebrow")} title={t("terms.title")} />

                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-line-strong">
                                            <th className="pb-1 text-left font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                                {t("terms.installment")}
                                            </th>
                                            <th className="pb-1 text-left font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                                {t("terms.milestone")}
                                            </th>
                                            <th className="pb-1 text-right font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                                {t("terms.percent")}
                                            </th>
                                            <th className="pb-1 pr-1 text-right font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                                {t("terms.amount")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doc.instalments.map((item) => (
                                            <tr key={item.label} className="border-b border-line/70">
                                                <td className="py-2 pr-3 text-[9.5pt] font-medium text-ink">{item.label}</td>
                                                <td className="py-2 pr-3 text-[9pt] text-ink-muted">{item.milestone}</td>
                                                <td className="py-2 text-right text-[9.5pt] tabular-nums text-ink-body">{item.percent}%</td>
                                                <td className="py-2 pr-1 text-right text-[9.5pt] font-medium tabular-nums text-ink">
                                                    {money(Math.round((total * item.percent) / 100))}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="border-t-2 border-brand-deep">
                                            <td colSpan={2} className="pt-2 font-display text-[10pt] font-bold text-ink">
                                                {t("terms.total")}
                                            </td>
                                            <td className="pt-2 text-right font-display text-[10pt] font-bold tabular-nums text-ink">
                                                {doc.instalments.reduce((sum, i) => sum + i.percent, 0)}%
                                            </td>
                                            <td className="pt-2 pr-1 text-right font-display text-[11pt] font-bold tabular-nums text-brand-deep">
                                                {money(total)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <Tree
                                    contract="quote-commitments-list"
                                    render={defineContractComponent("quote-commitments-list", {
                                        items: opaque(() => (
                                            <>
                                                {doc.commitments.map((item) => (
                                                    <article key={item.title} className="break-inside-avoid rounded-lg border-l-[3px] border-brand bg-surface-2/60 py-4 pl-4 pr-5">
                                                        <Heading props={{ content: item.title, level: 4 }} />
                                                        <p className="mt-1 text-[9pt] leading-relaxed text-ink-body">{item.body}</p>
                                                    </article>
                                                ))}
                                            </>
                                        )),
                                    })}
                                />

                                <span className="mt-auto block rounded-xl bg-brand-deep px-7 py-6 text-white">
                                    <p className="font-display text-[13pt] font-semibold">{t("terms.nextStep")}</p>
                                    <p className="mt-2 max-w-print-narrow text-[9.5pt] leading-relaxed text-white/75">
                                        {t("terms.nextStepDescription", { brand: brand.name, date: formatDate(expiryDate(doc)) })}
                                    </p>
                                    <p className="mt-4 text-[9pt] text-white/60">
                                        {brand.email} · {brand.domain}
                                    </p>
                                </span>
                            </>
                        ))} />
                    </>
                )),
            })}
        />
    )
}
