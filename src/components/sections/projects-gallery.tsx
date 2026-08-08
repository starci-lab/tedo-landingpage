"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Chip } from "@heroui/react"
import { Link } from "@/i18n/routing"
import { Container, Eyebrow } from "../ui"

type Project = {
    category: string
    badge: string
    title: string
    tagline: string
    body: string
    metric: string
    metricLabel: string
    stack: string[]
    highlights: string[]
    /** Path under `public/`. Omitted while a project has no shot we may publish. */
    image?: string
    /**
     * `true` shows the "ảnh sắp cập nhật" note.
     *
     * Its own flag on purpose: this used to be inferred from `stack.length === 0`,
     * which quietly mislabels any finished project whose stack we chose not to list —
     * and per `biz.md` the cards now lead with the business problem, so an empty
     * stack is a normal editorial choice rather than a sign of missing work.
     */
    pending?: boolean
}

/**
 * Dedicated projects gallery (`/du-an`). Real work only — CatMoc stays ANONYMOUS
 * ("B2B business system") until written consent lands; see MO-HINH §7.3. Cards
 * use a styled placeholder in place of screenshots we do not have rights to /
 * have not captured yet.
 */
export function ProjectsGallery() {
    const t = useTranslations("projects")
    const items = t.raw("items") as Array<Project>

    const categories = useMemo(
        () => Array.from(new Set(items.map((p) => p.category))),
        [items],
    )
    const [active, setActive] = useState<string | null>(null)
    const shown = active ? items.filter((p) => p.category === active) : items

    return (
        <section className="py-16 sm:py-20">
            <Container>
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <h1 className="max-w-3xl text-balance font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                    {t("title")}
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
                    {t("subtitle")}
                </p>

                {/* filter */}
                <div className="mt-8 flex flex-wrap gap-2">
                    <FilterChip
                        label={t("filterAll")}
                        active={active === null}
                        onClick={() => setActive(null)}
                    />
                    {categories.map((c) => (
                        <FilterChip
                            key={c}
                            label={c}
                            active={active === c}
                            onClick={() => setActive(c)}
                        />
                    ))}
                </div>

                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                    {shown.map((project) => (
                        <ProjectCard
                            key={project.title}
                            project={project}
                            pendingImage={t("pendingImage")}
                            stackLabel={t("stackLabel")}
                        />
                    ))}
                </div>

                {/* bottom CTA */}
                <div className="mt-14 rounded-3xl border border-line bg-brand-soft/50 px-6 py-10 text-center sm:px-10">
                    <h2 className="mx-auto max-w-xl text-balance font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                        {t("ctaTitle")}
                    </h2>
                    <div className="mt-6 flex justify-center">
                        <Link
                            href="/#contact"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-base font-medium text-accent-ink shadow-[0_6px_18px_-6px_rgba(245,130,32,0.6)] transition-colors hover:bg-accent-dim"
                        >
                            {t("cta")}
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    )
}

function FilterChip({
    label,
    active,
    onClick,
}: {
    label: string
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-white text-ink-muted hover:border-brand hover:text-brand"
            }`}
        >
            {label}
        </button>
    )
}

function ProjectCard({
    project,
    pendingImage,
    stackLabel,
}: {
    project: Project
    pendingImage: string
    stackLabel: string
}) {
    const initial = project.title.charAt(0)
    return (
        <article className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_24px_50px_-40px_rgba(20,48,92,0.5)]">
            <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-soft to-surface-2">
                {project.image ? (
                    <img
                        src={project.image}
                        alt={`Giao diện ${project.title}`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <>
                        <div className="tedo-dots absolute inset-0 opacity-40" />
                        <span
                            aria-hidden
                            className="absolute inset-0 grid place-items-center font-display text-7xl font-extrabold text-brand/15"
                        >
                            {initial}
                        </span>
                    </>
                )}
                <span className="absolute left-4 top-4">
                    <Chip size="sm" variant="secondary">
                        {project.badge}
                    </Chip>
                </span>
                {project.pending && (
                    <span className="absolute bottom-3 right-4 rounded bg-white/85 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                        {pendingImage}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-6">
                <p className="font-mono text-[11px] uppercase tracking-wide text-brand">
                    {project.category}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-ink">
                    {project.title}
                </h3>
                <p className="text-sm font-medium text-ink-muted">
                    {project.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {project.body}
                </p>

                {project.highlights.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2">
                        {project.highlights.map((h) => (
                            <li
                                key={h}
                                className="flex gap-2.5 text-sm text-ink-body"
                            >
                                <span
                                    aria-hidden
                                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand"
                                />
                                {h}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-auto pt-6">
                    <div className="flex items-end justify-between gap-4 border-t border-line pt-4">
                        <div>
                            <p className="font-display text-2xl font-bold text-brand">
                                {project.metric}
                            </p>
                            <p className="text-xs text-ink-faint">
                                {project.metricLabel}
                            </p>
                        </div>
                        {project.stack.length > 0 && (
                            <div className="max-w-[62%] text-right">
                                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                                    {stackLabel}
                                </p>
                                <div className="flex flex-wrap justify-end gap-1.5">
                                    {project.stack.map((s) => (
                                        <span
                                            key={s}
                                            className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-ink-muted"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    )
}
