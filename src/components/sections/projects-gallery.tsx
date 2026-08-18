"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineContractProjection, defineLeafComponent } from "@/components/contracts/props"
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
            contract="gallery-band"
            render={defineContractComponent("gallery-band", {
                content: defineContractComponent("page-measure", {
                    content: defineContractProjection("opaque-content-unit", () => (
                        <>
                            <Tree
                                contract="section-intro"
                                render={defineContractComponent("section-intro", {
                                    eyebrow: defineLeafComponent("text", {}, () => (
                                        <Text props={{ content: t("eyebrow"), variant: "eyebrow" }} />
                                    )),
                                    title: defineLeafComponent("heading", {}, () => (
                                        <Heading props={{ content: t("title"), level: 1 }} />
                                    )),
                                    lead: defineLeafComponent("text", {}, () => (
                                        <Text props={{ content: t("subtitle"), variant: "lead" }} />
                                    )),
                                })}
                            />
                            <Tree
                                contract="gallery-filter-row"
                                render={defineContractComponent("gallery-filter-row", {
                                    items: [
                                        defineLeafComponent("filter-chip", {}, () => (
                                            <FilterChip
                                                props={{ content: t("filterAll"), selected: active === null }}
                                                on={{ onPress: () => setActive(null) }}
                                            />
                                        )),
                                        ...categories.map((c) => defineLeafComponent("filter-chip", {}, () => (
                                            <FilterChip
                                                props={{ content: c, selected: active === c }}
                                                on={{ onPress: () => setActive(c) }}
                                            />
                                        ))),
                                    ],
                                })}
                            />
                            <Tree
                                contract="project-card-grid"
                                render={defineContractComponent("project-card-grid", {
                                    items: shown.map((project) => defineContractComponent("project-card", {
                                        media: defineContractComponent("project-card-media", {
                                            content: defineContractProjection("opaque-content-unit", () => (
                                                <>
                                                    {project.image ? (
                                                        <Tree
                                                            contract="project-card-image-slot"
                                                            render={defineContractComponent("project-card-image-slot", {
                                                                content: defineContractProjection("opaque-content-unit", () => (
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
                                                                contract="project-card-dots-layer"
                                                                render={defineContractComponent("project-card-dots-layer", {})}
                                                            />
                                                            <Tree
                                                                contract="project-card-initial-slot"
                                                                render={defineContractComponent("project-card-initial-slot", {
                                                                    value: defineLeafComponent("text", {}, () => (
                                                                        <Text props={{ content: project.title.charAt(0), variant: "stat" }} />
                                                                    )),
                                                                })}
                                                            />
                                                        </>
                                                    )}
                                                    <Tree
                                                        contract="project-card-badge-slot"
                                                        render={defineContractComponent("project-card-badge-slot", {
                                                            badge: defineLeafComponent("chip", {}, () => (
                                                                <Chip props={{ content: project.badge, variant: "secondary", size: "sm" }} />
                                                            )),
                                                        })}
                                                    />
                                                    {project.pending && (
                                                        <Tree
                                                            contract="project-card-pending-note"
                                                            render={defineContractComponent("project-card-pending-note", {
                                                                content: defineLeafComponent("text", {}, () => (
                                                                    <Text props={{ content: t("pendingImage"), variant: "label" }} />
                                                                )),
                                                            })}
                                                        />
                                                    )}
                                                </>
                                            )),
                                        }),
                                        body: defineContractComponent("project-card-body", {
                                            category: defineLeafComponent("text", {}, () => (
                                                <Text props={{ content: project.category, variant: "label" }} />
                                            )),
                                            title: defineLeafComponent("heading", {}, () => (
                                                <Heading props={{ content: project.title, level: 3 }} />
                                            )),
                                            tagline: defineLeafComponent("text", {}, () => (
                                                <Text props={{ content: project.tagline, variant: "body" }} />
                                            )),
                                            body: defineLeafComponent("text", {}, () => (
                                                <Text props={{ content: project.body, variant: "body" }} />
                                            )),
                                            highlights: project.highlights.length > 0
                                                ? defineContractComponent("bullet-list", {
                                                    items: project.highlights.map((h) => defineContractComponent("labelled-bullet-item", {
                                                        mark: defineContractProjection("opaque-content-unit", () => (
                                                            <span aria-hidden className="mt-2 inline-block h-1 w-1 rounded-full bg-brand" />
                                                        )),
                                                        label: defineLeafComponent("text", {}, () => (
                                                            <Text props={{ content: h, variant: "body" }} />
                                                        )),
                                                    })),
                                                })
                                                : undefined,
                                            footer: defineContractComponent("project-card-footer", {
                                                row: defineContractComponent("project-card-footer-row", {
                                                    metric: defineContractComponent("project-card-metric", {
                                                        value: defineLeafComponent("text", {}, () => (
                                                            <Text props={{ content: project.metric, variant: "stat" }} />
                                                        )),
                                                        label: defineLeafComponent("text", {}, () => (
                                                            <Text props={{ content: project.metricLabel, variant: "body" }} />
                                                        )),
                                                    }),
                                                    stack: project.stack.length > 0
                                                        ? defineContractComponent("project-card-stack", {
                                                            label: defineLeafComponent("text", {}, () => (
                                                                <Text props={{ content: t("stackLabel"), variant: "label" }} />
                                                            )),
                                                            chips: defineContractComponent("project-card-stack-row", {
                                                                items: project.stack.map((s) => defineLeafComponent("chip", {}, () => (
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
                                contract="gallery-cta-panel"
                                render={defineContractComponent("gallery-cta-panel", {
                                    title: defineLeafComponent("heading", {}, () => (
                                        <Heading props={{ content: t("ctaTitle"), level: 2 }} />
                                    )),
                                    action: defineContractComponent("gallery-cta-row", {
                                        cta: defineContractProjection("opaque-content-unit", () => (
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
