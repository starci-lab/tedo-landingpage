import { brand } from "@/config/brand"
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
 */

const money = (amount: number) => `${formatDong(amount)} đ`

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

type PageProps = { children: React.ReactNode; index: number; total: number }
type HeadingProps = { eyebrow: string; title: string }
type LineBadgeProps = { badge: NonNullable<QuoteLine["badge"]> }
type GroupBlockProps = { group: QuoteGroup }
type NoteTableRow = { label: string; note?: string; cost: string }
type NoteTableProps = { rows: Array<NoteTableRow>; head: [string, string, string] }
type QuoteDocumentProps = { doc: QuoteData }

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

/** One A4 sheet. Fixed size so screen preview and print agree. */
const Page = ({ children, index, total }: PageProps) => (
    <article
        className="quote-page relative mx-auto flex w-[210mm] flex-col bg-canvas px-[16mm] py-[14mm] text-ink-body shadow-[0_1px_3px_rgba(20,48,92,0.12)] print:shadow-none"
        style={{ minHeight: "297mm" }}
    >
        {children}
        <footer className="mt-auto flex items-end justify-between border-t border-line pt-3 text-[8pt] text-ink-faint">
            <span>
                {brand.name} · Thiết kế Web &amp; App
            </span>
            <span>
                Trang {index} / {total}
            </span>
        </footer>
    </article>
)

/** Section heading used on every inner page. */
const Heading = ({ eyebrow, title }: HeadingProps) => (
    <header className="mb-6">
        <p className="font-mono text-[8pt] uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        <h2 className="mt-1.5 font-display text-[19pt] font-semibold leading-tight text-ink">{title}</h2>
    </header>
)

/** Zero-cost lines are marked, never left blank — blank reads as "not priced yet". */
const LineBadge = ({ badge }: LineBadgeProps) => {
    const map = {
        gift: { text: "Quà tặng", className: "bg-accent/12 text-accent-dim" },
        included: { text: "Đã gồm", className: "bg-brand-soft text-brand" },
    } as const
    const style = map[badge]
    return (
        <span className={`inline-block rounded px-1.5 py-0.5 text-[7.5pt] font-medium ${style.className}`}>
            {style.text}
        </span>
    )
}

/** A pricing group: tinted header row carrying its own subtotal, then its lines. */
const GroupBlock = ({ group }: GroupBlockProps) => (
    <tbody className="break-inside-avoid">
        <tr className="bg-brand-soft/70">
            <td className="w-[7mm] py-1.5 pl-2 align-middle font-display text-[10pt] font-bold text-brand">
                {group.code}
            </td>
            <td className="py-1.5 pr-3 align-middle font-display text-[10pt] font-semibold text-ink">
                {group.title}
                {group.note ? <span className="ml-2 font-sans text-[8pt] font-normal text-ink-muted">{group.note}</span> : null}
            </td>
            <td className="py-1.5 pr-2 text-right align-middle font-display text-[10pt] font-bold tabular-nums text-ink">
                {money(groupTotal(group))}
            </td>
        </tr>
        {group.lines.map((line) => (
            <tr key={line.label} className="border-b border-line/70 last:border-b-0">
                <td />
                <td className="py-[3px] pr-3">
                    <span className="text-[9pt] text-ink-body">{line.label}</span>
                    {line.detail ? (
                        <span className="block text-[7.5pt] leading-tight text-ink-faint">{line.detail}</span>
                    ) : null}
                </td>
                <td className="py-[3px] pr-2 text-right align-top">
                    {line.amount != null ? (
                        <span className="text-[9pt] tabular-nums text-ink-body">{money(line.amount)}</span>
                    ) : line.badge ? (
                        <LineBadge badge={line.badge} />
                    ) : null}
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
                        className={`pb-1.5 font-display text-[8pt] font-semibold uppercase tracking-wide text-brand ${i === 2 ? "text-right" : ""}`}
                    >
                        {cell}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map((row) => (
                <tr key={row.label} className="border-b border-line/70 last:border-b-0">
                    <td className="py-1.5 pr-3 text-ink-body">{row.label}</td>
                    <td className="py-1.5 pr-3 text-ink-faint">{row.note}</td>
                    <td className="py-1.5 text-right tabular-nums text-ink-body">{row.cost}</td>
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
        <div className="quote-root flex flex-col items-center gap-6 bg-sky py-8 print:gap-0 print:bg-canvas print:py-0">
            {/* ── 1 · Cover ─────────────────────────────────────────────── */}
            <Page index={1} total={pages}>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-display text-[13pt] font-bold tracking-tight text-brand-deep">{brand.name}</p>
                        <p className="mt-0.5 font-mono text-[7.5pt] uppercase tracking-[0.22em] text-ink-faint">
                            Teach · Empower · Do · Optimize
                        </p>
                    </div>
                    <div className="text-right text-[8pt] text-ink-muted">
                        <p>Ngày {formatDate(doc.issuedAt)}</p>
                        <p className="text-ink-faint">Hiệu lực đến {formatDate(expiryDate(doc))}</p>
                        <p className="mt-1 font-mono text-[7.5pt] text-ink-faint">{doc.reference}</p>
                    </div>
                </div>

                <div className="mt-16">
                    <p className="font-mono text-[8pt] uppercase tracking-[0.2em] text-accent">Đề xuất &amp; báo giá dự án</p>
                    <h1 className="mt-3 font-display text-[34pt] font-bold leading-[1.05] tracking-tight text-ink">
                        {doc.client.name}
                    </h1>
                    {doc.client.note ? <p className="mt-1.5 text-[10pt] text-ink-muted">{doc.client.note}</p> : null}

                    <p className="mt-7 max-w-[150mm] font-display text-[14pt] font-medium leading-snug text-brand-deep">
                        {doc.title}
                    </p>
                    <p className="mt-3 max-w-[150mm] text-[10pt] leading-relaxed text-ink-body">{doc.summary}</p>
                </div>

                <dl className="mt-10 grid grid-cols-4 gap-px overflow-hidden rounded-lg border border-line bg-line">
                    {doc.facts.map((fact) => (
                        <div key={fact.label} className="bg-surface px-4 py-3">
                            <dt className="font-mono text-[7pt] uppercase tracking-wider text-ink-faint">{fact.label}</dt>
                            <dd className="mt-1 font-display text-[10.5pt] font-semibold text-ink">{fact.value}</dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-8 rounded-xl bg-brand-deep px-7 py-6 text-white">
                    <p className="font-mono text-[7.5pt] uppercase tracking-[0.2em] text-white/60">
                        Tổng đầu tư trọn gói
                    </p>
                    <p className="mt-1.5 font-display text-[30pt] font-bold leading-none tabular-nums">{money(total)}</p>
                    <p className="mt-2.5 text-[8.5pt] leading-relaxed text-white/70">
                        Đã gồm thiết kế, lập trình, kiểm thử và bàn giao. Bảo hành {doc.warrantyMonths} tháng.
                        Chưa gồm chi phí hạ tầng trả cho nhà cung cấp — bóc tách ở trang 5.
                    </p>
                </div>
            </Page>

            {/* ── 2 · Core features ─────────────────────────────────────── */}
            <Page index={2} total={pages}>
                <Heading eyebrow="Tổng quan" title="Bốn tính năng cốt lõi" />
                <p className="-mt-3 mb-6 max-w-[160mm] text-[9.5pt] leading-relaxed text-ink-muted">
                    Đây là phần lõi mang lại doanh thu và giữ chân khách. Mọi hạng mục khác trong báo giá
                    đều phục vụ bốn việc này.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    {doc.features.map((feature, i) => (
                        <section
                            key={feature.title}
                            className="break-inside-avoid rounded-lg border border-line bg-surface-2/60 p-5"
                        >
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="font-mono text-[8pt] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                                {feature.core ? (
                                    <span className="rounded bg-accent/12 px-1.5 py-0.5 text-[7pt] font-semibold uppercase tracking-wider text-accent-dim">
                                        Cốt lõi
                                    </span>
                                ) : null}
                            </div>
                            <h3 className="mt-2 font-display text-[11.5pt] font-semibold leading-snug text-ink">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-[9pt] leading-relaxed text-ink-body">{feature.body}</p>
                        </section>
                    ))}
                </div>
            </Page>

            {/* ── 3 · Scope ─────────────────────────────────────────────── */}
            <Page index={3} total={pages}>
                <Heading eyebrow="Phạm vi" title="Làm đầy đủ ngay, không chia giai đoạn hai" />

                <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {doc.scope.map((item) => (
                        <li key={item} className="flex gap-2 text-[9.5pt] leading-snug text-ink-body">
                            <span aria-hidden className="mt-[3px] text-green">✓</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>

                {doc.outOfScope.length > 0 ? (
                    <div className="mt-7 rounded-lg border-l-[3px] border-accent bg-accent/6 py-4 pl-4 pr-5">
                        <p className="font-display text-[9.5pt] font-semibold text-accent-dim">Ngoài phạm vi lần này</p>
                        <ul className="mt-1.5 space-y-1">
                            {doc.outOfScope.map((item) => (
                                <li key={item} className="text-[9pt] leading-relaxed text-ink-body">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                <h3 className="mt-9 font-display text-[12pt] font-semibold text-ink">Tiến độ dự kiến</h3>
                <ol className="mt-4">
                    {doc.phases.map((phase) => (
                        <li key={phase.when} className="flex break-inside-avoid gap-4 border-b border-line/70 py-3 last:border-b-0">
                            <span className="w-[26mm] shrink-0 font-mono text-[8.5pt] font-medium text-brand">{phase.when}</span>
                            <div className="min-w-0 flex-1">
                                <p className="font-display text-[10pt] font-semibold text-ink">{phase.title}</p>
                                <p className="mt-1 text-[8.5pt] leading-relaxed text-ink-muted">{phase.body}</p>
                            </div>
                            {phase.tag ? (
                                <span className="h-fit shrink-0 rounded bg-surface-2 px-2 py-0.5 text-[7.5pt] text-ink-faint">
                                    {phase.tag}
                                </span>
                            ) : null}
                        </li>
                    ))}
                </ol>
            </Page>

            {/* ── 4 · Pricing ───────────────────────────────────────────── */}
            <Page index={4} total={pages}>
                <Heading eyebrow="Báo giá" title="Bóc tách theo từng hạng mục" />

                {/* Summary first: the shape of the number before the 25 lines that make it. */}
                <table className="mb-5 w-full border-collapse">
                    <tbody>
                        {doc.groups.map((group) => (
                            <tr key={group.code} className="border-b border-line/70">
                                <td className="w-[7mm] py-1 font-display text-[9pt] font-bold text-brand">{group.code}</td>
                                <td className="py-1 pr-3 text-[9pt] text-ink-body">{group.title}</td>
                                <td className="py-1 text-right text-[9pt] tabular-nums text-ink-body">
                                    {money(groupTotal(group))}
                                </td>
                            </tr>
                        ))}
                        <tr className="border-t-2 border-brand-deep">
                            <td colSpan={2} className="pt-2 font-display text-[10.5pt] font-bold text-ink">
                                Tổng đầu tư trọn gói
                            </td>
                            <td className="pt-2 text-right font-display text-[13pt] font-bold tabular-nums text-brand-deep">
                                {money(total)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p className="mb-2 text-[8.5pt] leading-relaxed text-ink-muted">
                    Đơn vị: đồng. App xây dựng cross-platform — một mã nguồn chạy cả iPhone và Android.
                </p>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-line-strong">
                            <th className="w-[7mm]" />
                            <th className="pb-1.5 text-left font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                Hạng mục
                            </th>
                            <th className="pb-1.5 pr-2 text-right font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                Thành tiền
                            </th>
                        </tr>
                    </thead>
                    {priced.first.map((group) => (
                        <GroupBlock key={group.code} group={group} />
                    ))}
                </table>
            </Page>

            {/* ── 5 · Pricing, continued ────────────────────────────────── */}
            {hasSecondPricingSheet ? (
                <Page index={5} total={pages}>
                    <Heading eyebrow="Báo giá" title="Bóc tách theo từng hạng mục (tiếp)" />
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-line-strong">
                                <th className="w-[7mm]" />
                                <th className="pb-1.5 text-left font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                    Hạng mục
                                </th>
                                <th className="pb-1.5 pr-2 text-right font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                    Thành tiền
                                </th>
                            </tr>
                        </thead>
                        {priced.rest.map((group) => (
                            <GroupBlock key={group.code} group={group} />
                        ))}
                        <tbody>
                            <tr className="border-t-2 border-brand-deep">
                                <td colSpan={2} className="pt-2 font-display text-[10.5pt] font-bold text-ink">
                                    Tổng đầu tư trọn gói
                                </td>
                                <td className="pt-2 pr-2 text-right font-display text-[13pt] font-bold tabular-nums text-brand-deep">
                                    {money(total)}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="mt-5 rounded-lg bg-surface-2/70 px-4 py-3 text-[8.5pt] leading-relaxed text-ink-muted">
                        Đã bao gồm quà tặng: tên miền miễn phí năm đầu · {brand.name} đăng app lên App Store và
                        CH Play · hướng dẫn và đào tạo cho salon.
                    </p>
                </Page>
            ) : null}

            {/* ── Running cost ──────────────────────────────────────────── */}
            <Page index={runningSheet} total={pages}>
                <Heading eyebrow="Vận hành" title="Chi phí hằng tháng và rủi ro khi mở rộng" />

                <div className="mb-2 flex items-baseline gap-2">
                    <h3 className="font-display text-[11pt] font-semibold text-ink">Chi phí vận hành</h3>
                    <span className="rounded bg-brand-soft px-2 py-0.5 text-[7.5pt] font-medium text-brand">
                        Trả cho nhà cung cấp, không phải phí {brand.name}
                    </span>
                </div>
                <NoteTable rows={doc.runningCosts} head={["Khoản mục", "Ghi chú", "Chi phí"]} />

                <h3 className="mb-2 mt-8 font-display text-[11pt] font-semibold text-ink">Khi lượng dùng tăng</h3>
                <p className="mb-2.5 text-[8.5pt] leading-relaxed text-ink-muted">
                    Mức trên phù hợp giai đoạn đầu. Khi đông khách hơn, chi phí hạ tầng có thể tăng —
                    con số dưới đây là ước tính tham khảo, thực tế tuỳ lưu lượng.
                </p>
                <NoteTable rows={doc.scaleNotes} head={["Yếu tố", "Ảnh hưởng", "Chi phí tham khảo"]} />

                <div className="mt-8 rounded-lg border border-line bg-surface-2/70 p-5">
                    <h3 className="font-display text-[11pt] font-semibold text-ink">
                        Bảo hành {doc.warrantyMonths} tháng, sau đó là gói duy trì
                    </h3>
                    <p className="mt-2 text-[9pt] leading-relaxed text-ink-body">
                        {doc.warrantyMonths} tháng đầu kể từ ngày nghiệm thu: bảo đảm hệ thống chạy, bảo mật,
                        sao lưu hằng ngày, tư vấn và đào tạo sử dụng — miễn phí. Tiếp nhận sự cố chậm nhất 12 giờ,
                        xác minh nguyên nhân chậm nhất 48 giờ.
                    </p>
                    {doc.maintenancePercent ? (
                        <p className="mt-2 text-[9pt] leading-relaxed text-ink-body">
                            Hết {doc.warrantyMonths} tháng, salon có thể tiếp tục với gói duy trì hằng năm — khoảng{" "}
                            <strong className="font-semibold text-ink">
                                {doc.maintenancePercent[0]} – {doc.maintenancePercent[1]}% giá trị dự án mỗi năm
                            </strong>
                            , gồm hạ tầng, vá lỗi bảo mật, sao lưu, giám sát và hỗ trợ theo cam kết trên. Không bắt buộc.
                        </p>
                    ) : null}
                </div>
            </Page>

            {/* ── Terms ─────────────────────────────────────────────────── */}
            <Page index={termsSheet} total={pages}>
                <Heading eyebrow="Điều khoản" title="Thanh toán và cam kết" />

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-line-strong">
                            <th className="pb-1.5 text-left font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                Đợt
                            </th>
                            <th className="pb-1.5 text-left font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                Mốc
                            </th>
                            <th className="pb-1.5 text-right font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                Tỷ lệ
                            </th>
                            <th className="pb-1.5 pr-1 text-right font-display text-[8pt] font-semibold uppercase tracking-wide text-brand">
                                Số tiền
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
                                Tổng
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

                <div className="mt-8 space-y-3">
                    {doc.commitments.map((item) => (
                        <section key={item.title} className="break-inside-avoid rounded-lg border-l-[3px] border-brand bg-surface-2/60 py-3.5 pl-4 pr-5">
                            <h3 className="font-display text-[10pt] font-semibold text-ink">{item.title}</h3>
                            <p className="mt-1 text-[9pt] leading-relaxed text-ink-body">{item.body}</p>
                        </section>
                    ))}
                </div>

                <div className="mt-auto rounded-xl bg-brand-deep px-7 py-6 text-white">
                    <p className="font-display text-[13pt] font-semibold">Bước tiếp theo</p>
                    <p className="mt-2 max-w-[140mm] text-[9.5pt] leading-relaxed text-white/75">
                        Sau khi anh/chị duyệt đề xuất, {brand.name} bắt đầu UX/UI trong hai ngày.
                        Báo giá có hiệu lực đến {formatDate(expiryDate(doc))}.
                    </p>
                    <p className="mt-4 text-[9pt] text-white/60">
                        {brand.email} · {brand.domain}
                    </p>
                </div>
            </Page>
        </div>
    )
}
