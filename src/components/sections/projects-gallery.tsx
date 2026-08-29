"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Text } from "@/components/leaves/Text"
import { Heading } from "@/components/leaves/Heading"
import { Chip } from "@/components/leaves/Chip"
import { FilterChip } from "@/components/leaves/FilterChip"
import { RouteCtaAction } from "@/components/composites/RouteCtaAction"

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
     * `true` shows the pending-image note.
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
export const ProjectsGallery = () => {
    const t = useTranslations("projects")
    const items = t.raw("items") as Array<Project>

    const categories = useMemo(
        () => Array.from(new Set(items.map((p) => p.category))),
        [items],
    )
    const [active, setActive] = useState<string | null>(null)
    const shown = active ? items.filter((p) => p.category === active) : items

    return (
        <Tree
            grammar="gallery-band"
            render={defineGrammarComponent("gallery-band", {
                content: defineGrammarComponent("page-measure", {
                    content: defineGrammarProjection("opaque-content-unit", () => (
                        <>
                            <Tree
                                grammar="section-intro"
                                render={defineGrammarComponent("section-intro", {
                                    eyebrow: defineGrammarLeaf("text", {}, () => (
                                        <Text props={{ content: t("eyebrow"), variant: "eyebrow" }} />
                                    )),
                                    title: defineGrammarLeaf("heading", {}, () => (
                                        <Heading props={{ content: t("title"), level: 1 }} />
                                    )),
                                    lead: defineGrammarLeaf("text", {}, () => (
                                        <Text props={{ content: t("subtitle"), variant: "lead" }} />
                                    )),
                                })}
                            />
                            <Tree
                                grammar="gallery-filter-row"
                                render={defineGrammarComponent("gallery-filter-row", {
                                    items: [
                                        defineGrammarLeaf("filter-chip", {}, () => (
                                            <FilterChip
                                                props={{ content: t("filterAll"), selected: active === null }}
                                                on={{ onPress: () => setActive(null) }}
                                            />
                                        )),
                                        ...categories.map((c) => defineGrammarLeaf("filter-chip", {}, () => (
                                            <FilterChip
                                                props={{ content: c, selected: active === c }}
                                                on={{ onPress: () => setActive(c) }}
                                            />
                                        ))),
                                    ],
                                })}
                            />
                            <Tree
                                grammar="project-card-grid"
                                render={defineGrammarComponent("project-card-grid", {
                                    items: shown.map((project) => defineGrammarComponent("project-card", {
                                        media: defineGrammarComponent("project-card-media", {
                                            content: defineGrammarProjection("opaque-content-unit", () => (
                                                <>
                                                    {project.image ? (
                                                        <Tree
                                                            grammar="project-card-image-slot"
                                                            render={defineGrammarComponent("project-card-image-slot", {
                                                                content: defineGrammarProjection("opaque-content-unit", () => (
                                                                    <Image
                                                                        src={project.image ?? ""}
                                                                        alt={t("imageAlt", { title: project.title })}
                                                                        fill
                                                                        sizes="(max-width: 640px) 100vw, 50vw"
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                )),
                                                            })}
                                                        />
                                                    ) : (
                                                        <>
                                                            <Tree
                                                                grammar="project-card-dots-layer"
                                                                render={defineGrammarComponent("project-card-dots-layer", {})}
                                                            />
                                                            <Tree
                                                                grammar="project-card-initial-slot"
                                                                render={defineGrammarComponent("project-card-initial-slot", {
                                                                    value: defineGrammarLeaf("text", {}, () => (
                                                                        <Text props={{ content: project.title.charAt(0), variant: "stat" }} />
                                                                    )),
                                                                })}
                                                            />
                                                        </>
                                                    )}
                                                    <Tree
                                                        grammar="project-card-badge-slot"
                                                        render={defineGrammarComponent("project-card-badge-slot", {
                                                            badge: defineGrammarLeaf("chip", {}, () => (
                                                                <Chip props={{ content: project.badge, variant: "secondary", size: "sm" }} />
                                                            )),
                                                        })}
                                                    />
                                                    {project.pending && (
                                                        <Tree
                                                            grammar="project-card-pending-note"
                                                            render={defineGrammarComponent("project-card-pending-note", {
                                                                content: defineGrammarLeaf("text", {}, () => (
                                                                    <Text props={{ content: t("pendingImage"), variant: "label" }} />
                                                                )),
                                                            })}
                                                        />
                                                    )}
                                                </>
                                            )),
                                        }),
                                        body: defineGrammarComponent("project-card-body", {
                                            category: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: project.category, variant: "label" }} />
                                            )),
                                            title: defineGrammarLeaf("heading", {}, () => (
                                                <Heading props={{ content: project.title, level: 3 }} />
                                            )),
                                            tagline: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: project.tagline, variant: "body" }} />
                                            )),
                                            body: defineGrammarLeaf("text", {}, () => (
                                                <Text props={{ content: project.body, variant: "body" }} />
                                            )),
                                            highlights: project.highlights.length > 0
                                                ? defineGrammarComponent("bullet-list", {
                                                    items: project.highlights.map((h) => defineGrammarComponent("labelled-bullet-item", {
                                                        mark: defineGrammarProjection("opaque-content-unit", () => (
                                                            <span aria-hidden className="mt-2 inline-block h-1 w-1 rounded-full bg-brand" />
                                                        )),
                                                        label: defineGrammarLeaf("text", {}, () => (
                                                            <Text props={{ content: h, variant: "body" }} />
                                                        )),
                                                    })),
                                                })
                                                : undefined,
                                            footer: defineGrammarComponent("project-card-footer", {
                                                row: defineGrammarComponent("project-card-footer-row", {
                                                    metric: defineGrammarComponent("project-card-metric", {
                                                        value: defineGrammarLeaf("text", {}, () => (
                                                            <Text props={{ content: project.metric, variant: "stat" }} />
                                                        )),
                                                        label: defineGrammarLeaf("text", {}, () => (
                                                            <Text props={{ content: project.metricLabel, variant: "body" }} />
                                                        )),
                                                    }),
                                                    stack: project.stack.length > 0
                                                        ? defineGrammarComponent("project-card-stack", {
                                                            label: defineGrammarLeaf("text", {}, () => (
                                                                <Text props={{ content: t("stackLabel"), variant: "label" }} />
                                                            )),
                                                            chips: defineGrammarComponent("project-card-stack-row", {
                                                                items: project.stack.map((s) => defineGrammarLeaf("chip", {}, () => (
                                                                    <Chip props={{ content: s, size: "sm" }} />
                                                                ))),
                                                            }),
                                                        })
                                                        : undefined,
                                                }),
                                            }),
                                        }),
                                    })),
                                })}
                            />
                            <Tree
                                grammar="gallery-cta-panel"
                                render={defineGrammarComponent("gallery-cta-panel", {
                                    title: defineGrammarLeaf("heading", {}, () => (
                                        <Heading props={{ content: t("ctaTitle"), level: 2 }} />
                                    )),
                                    action: defineGrammarComponent("gallery-cta-row", {
                                        cta: defineGrammarProjection("opaque-content-unit", () => (
                                            <RouteCtaAction to="/#contact" label={t("cta")} size="md" />
                                        )),
                                    }),
                                })}
                            />
                        </>
                    )),
                }),
            })}
        />
    )
}
