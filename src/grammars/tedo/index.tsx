"use client"

import { useEffect, useState } from "react"
import { defineGrammarComponent, defineGrammarProjection, defineGrammarLeaf } from "@/components/grammar/props"
import { Tree } from "@/components/branches/Tree"
import { Wordmark } from "@/components/leaves/Wordmark"
import { Heading } from "@/components/leaves/Heading"
import { LeadPrompt } from "@/components/consultation/lead-prompt"
import { useRouter } from "@/i18n/routing"
import { copy, type Copy } from "@/content/tedo-v6-copy"
import styles from "./tedo-v6.module.css"

type TedoV6Props = { readonly locale: string }
type ContentProps = { readonly content: Copy }
type WorkflowIllustrationProps = { readonly stage: number }

/** Draws the persistent delivery route behind the page. */
export const ExecutionRail = () => (
    <Tree grammar="tedo-execution-rail" render={defineGrammarComponent("tedo-execution-rail", {
        rail: defineGrammarProjection("opaque-content-unit", () => <svg className={styles.globalRail} viewBox="0 0 1440 3600" preserveAspectRatio="none">
        <defs>
            <linearGradient id="tedo-rail-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b8ae0" /><stop offset=".46" stopColor="#f58220" /><stop offset="1" stopColor="#43b04a" /></linearGradient>
            <filter id="tedo-rail-glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path className={styles.railGhost} d="M1110 0 C1270 410 820 690 1040 1040 S1320 1590 780 1900 S490 2590 990 2920 S1120 3370 810 3600" />
        <path className={styles.railBranch} d="M1040 1040 C850 980 720 1090 590 1240" />
        <path className={styles.railBranch} d="M780 1900 C1030 1880 1120 2050 1260 2180" />
        <path className={styles.railBranch} d="M990 2920 C760 2860 620 3000 510 3170" />
        <path id="tedo-global-route" className={styles.railActive} d="M1110 0 C1270 410 820 690 1040 1040 S1320 1590 780 1900 S490 2590 990 2920 S1120 3370 810 3600" />
        {[0, 1, 2, 3].map(index => <circle className={styles.railPacket} r={index === 0 ? "7" : "4"} filter="url(#tedo-rail-glow)" key={index}><animateMotion dur="14s" begin={`${index * -3.5}s`} repeatCount="indefinite"><mpath href="#tedo-global-route" /></animateMotion></circle>)}
    </svg>),
        signalA: defineGrammarProjection("opaque-content-unit", () => <span className={styles.flowSignalA}><i />SCOPE.APPROVED</span>),
        signalB: defineGrammarProjection("opaque-content-unit", () => <span className={styles.flowSignalB}><i />DESIGN.ROUTED</span>),
        signalC: defineGrammarProjection("opaque-content-unit", () => <span className={styles.flowSignalC}><i />RELEASE.VERIFIED</span>),
    })} />
)

/** Renders the primary V6 navigation and project action. */
export const TedoNav = ({ content }: ContentProps) => {
    const router = useRouter()
    return <Tree grammar="tedo-navigation" render={defineGrammarComponent("tedo-navigation", {
        logo: defineGrammarProjection("opaque-content-unit", () => <button type="button" className={styles.logoButton} aria-label="TEDO home" onClick={() => router.push("/")}><Wordmark onDark /></button>),
        links: defineGrammarComponent("tedo-navigation-links", {
            links: defineGrammarProjection("opaque-content-unit", () => <>{content.nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</>),
        }),
        action: defineGrammarProjection("opaque-content-unit", () => <button type="button" className={styles.navCta} onClick={() => router.push("/chat")}>{content.navCta}<span aria-hidden>Open</span></button>),
    })} />
}

const runwayJobs = [
    ["01", "BOOKING / SCOPE", "READY", "blue"],
    ["02", "CUSTOMER APP / UX/UI", "APPROVED", "orange"],
    ["03", "SALON OPS / BUILD", "RUNNING", "blue"],
    ["04", "QA / HANDOVER", "VERIFIED", "green"],
] as const

const runwayGrammar = () => defineGrammarComponent("tedo-agent-runway", {
    header: defineGrammarComponent("tedo-runway-boundary", {
        leading: defineGrammarLeaf("text", {}, () => <span>AI-FIRST DELIVERY / YABAI NAIL</span>),
        trailing: defineGrammarLeaf("text", {}, () => <span><i />PEOPLE + AGENTS ACTIVE</span>),
    }),
    body: defineGrammarComponent("tedo-runway-body", {
        approval: defineGrammarComponent("tedo-runway-gate", {
            gateLabel: defineGrammarLeaf("text", {}, () => <span>CLIENT GATE / APPROVAL</span>),
        }),
        lanes: runwayJobs.map(([index, job, state, tone]) => defineGrammarComponent("tedo-runway-lane", {
            laneIndex: defineGrammarLeaf("text", {}, () => <span>{index}</span>),
            routeLine: defineGrammarLeaf("decoration", {}, () => <i />),
            movingJob: defineGrammarLeaf("text", {}, () => <b data-tone={tone}><i />{job}<small>{state}</small></b>),
        })),
    }),
    footer: defineGrammarComponent("tedo-runway-boundary", {
        leading: defineGrammarLeaf("text", {}, () => <span>INPUT / CLIENT OUTCOME</span>),
        trailing: defineGrammarLeaf("text", {}, () => <span>OUTPUT / SHIPPED PRODUCT</span>),
    }),
})

const AgentRunway = () => <Tree grammar="tedo-agent-runway" render={runwayGrammar()} />

/** Presents the outcome-led hero and delivery preview. */
export const HarnessHero = ({ content }: ContentProps) => (
    <Tree grammar="tedo-harness-hero" render={defineGrammarComponent("tedo-harness-hero", {
        eyebrow: defineGrammarLeaf("text", {}, () => <p id="tedo-v6-title" className={styles.eyebrow}>{content.eyebrow}</p>),
        title: defineGrammarLeaf("heading", {}, () => <Heading props={{ content: content.titleA, accent: content.titleB, level: 1, tone: "onDark" }} />),
        grid: defineGrammarComponent("tedo-hero-grid", {
            copy: defineGrammarComponent("tedo-hero-copy", {
                lead: defineGrammarLeaf("text", {}, () => <p className={styles.lead}>{content.heroCopy}</p>),
                prompt: defineGrammarComponent("tedo-hero-prompt", {
                    composer: defineGrammarProjection("opaque-content-unit", () => <LeadPrompt />),
                }),
                secondary: defineGrammarProjection("opaque-content-unit", () => <a className={styles.textAction} href="#runtime">{content.heroSecondary}<span aria-hidden>↓</span></a>),
            }),
            receipt: defineGrammarComponent("tedo-hero-receipt", {
                meta: defineGrammarComponent("tedo-hero-receipt-meta", {
                    left: defineGrammarLeaf("text", {}, () => <span>{content.live}</span>),
                    right: defineGrammarLeaf("text", {}, () => <span>LIVE / 00:41</span>),
                }),
                name: defineGrammarLeaf("text", {}, () => <strong>{content.receipt}</strong>),
                copy: defineGrammarLeaf("text", {}, () => <p>{content.receiptCopy}</p>),
            }),
        }),
        runway: defineGrammarProjection("opaque-content-unit", () => <AgentRunway />),
    })} />
)

/** Shows the active project route and delivery stages. */
export const MissionRuntime = ({ content }: ContentProps) => (
    <Tree grammar="tedo-runtime-section" render={defineGrammarComponent("tedo-runtime-section", {
        anchor: defineGrammarLeaf("anchor", {}, () => <span id="runtime" />),
        meta: defineGrammarComponent("tedo-section-meta", {
            label: defineGrammarLeaf("text", {}, () => <span>{content.runtimeKicker}</span>),
            aside: defineGrammarLeaf("text", {}, () => <span>ONE PROJECT · PEOPLE + AGENTS</span>),
        }),
        heading: defineGrammarComponent("tedo-chapter-heading", {
            chapterTitle: defineGrammarLeaf("heading", {}, () => <Heading props={{ content: content.runtimeTitle, level: 2, tone: "onDark" }} />),
            chapterSummary: defineGrammarLeaf("text", {}, () => <p>{content.runtimeCopy}</p>),
        }),
        theatre: defineGrammarComponent("tedo-mission-theatre", {
            statusHeader: defineGrammarComponent("tedo-mission-header", {
                missionIdentity: defineGrammarComponent("tedo-mission-identity", {
                    missionLabel: defineGrammarLeaf("text", {}, () => <span>{content.missionLabel}</span>),
                    missionStep: defineGrammarLeaf("text", {}, () => <strong>{content.missionStep}</strong>),
                }),
                missionStatus: defineGrammarLeaf("text", {}, () => <span className={styles.running}><i />{content.missionStatus}</span>),
            }),
            routeDrawing: defineGrammarProjection("opaque-content-unit", () => <svg className={styles.missionLane} viewBox="0 0 1120 250" role="img" aria-label="Project routed through discovery, design, engineering, verification, and handover"><defs><linearGradient id="mission-gradient"><stop stopColor="#2b8ae0" /><stop offset=".7" stopColor="#f58220" /><stop offset="1" stopColor="#43b04a" /></linearGradient></defs><path id="mission-route" className={styles.missionGhost} d="M45 132 H210 C275 132 272 65 338 65 H505 C566 65 565 190 628 190 H790 C850 190 850 105 910 105 H1070" /><path className={styles.missionActive} d="M45 132 H210 C275 132 272 65 338 65 H505 C566 65 565 190 628 190 H790 C850 190 850 105 910 105 H1070" />{[45, 338, 628, 910, 1070].map((cx, index) => <circle key={cx} cx={cx} cy={[132, 65, 190, 105, 105][index]} r="12" className={styles.missionNode} />)}<circle className={styles.missionPacket} r="5"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#mission-route" /></animateMotion></circle></svg>),
            stageLabels: defineGrammarComponent("tedo-runtime-steps", {
                stepLabels: content.runtimeSteps.map((step, index) => defineGrammarLeaf("text", {}, () => <span>0{index + 1} · {step}</span>)),
            }),
        }),
    })} />
)

const WorkflowIllustration = ({ stage }: WorkflowIllustrationProps) => {
    const common = <><path className={styles.workflowGridLine} d="M24 28H296M24 68H296M24 108H296M24 148H296M64 16V164M128 16V164M192 16V164M256 16V164" /><circle className={styles.workflowPacket} cx="28" cy="148" r="4" /></>
    if (stage === 0) return <svg viewBox="0 0 320 180" aria-hidden="true">{common}<rect className={styles.workflowPanel} x="52" y="36" width="216" height="108" rx="12" /><path className={styles.workflowLine} d="M76 64h102M76 82h150" /><rect className={styles.workflowAccent} x="76" y="103" width="104" height="20" rx="10" /><circle className={styles.workflowDot} cx="238" cy="113" r="9" /></svg>
    if (stage === 1) return <svg viewBox="0 0 320 180" aria-hidden="true">{common}<circle className={styles.workflowRing} cx="160" cy="90" r="58" /><circle className={styles.workflowRing} cx="160" cy="90" r="34" /><circle className={styles.workflowAccentDot} cx="160" cy="90" r="9" /><path className={styles.workflowLine} d="M58 53l47 20M216 110l48 27M94 134l30-22" /><circle className={styles.workflowDot} cx="52" cy="50" r="7" /><circle className={styles.workflowDot} cx="270" cy="140" r="7" /></svg>
    if (stage === 2) return <svg viewBox="0 0 320 180" aria-hidden="true">{common}<rect className={styles.workflowPanel} x="38" y="28" width="108" height="124" rx="8" /><rect className={styles.workflowPanelStrong} x="174" y="28" width="108" height="124" rx="8" /><path className={styles.workflowLine} d="M56 50h70M56 69h42M56 98h70M56 116h54M192 50h70M192 70h70M192 95h30v34h-30zM230 95h32v14h-32z" /><path className={styles.workflowTransfer} d="M146 90h28" /></svg>
    if (stage === 3) return <svg viewBox="0 0 320 180" aria-hidden="true">{common}<rect className={styles.workflowPanel} x="35" y="32" width="250" height="116" rx="10" /><path className={styles.workflowLine} d="M58 58h66M58 79h112M58 100h88M58 121h128" /><path className={styles.workflowAccentLine} d="M204 56l22 22-22 22M255 56l-22 22 22 22" /><circle className={styles.workflowAgent} cx="246" cy="123" r="13" /><path className={styles.workflowTransfer} d="M190 123h37" /></svg>
    if (stage === 4) return <svg viewBox="0 0 320 180" aria-hidden="true">{common}<circle className={styles.workflowRing} cx="160" cy="88" r="56" /><path className={styles.workflowCheck} d="M126 89l22 22 48-51" /><path className={styles.workflowLine} d="M87 151h146" /><circle className={styles.workflowDot} cx="96" cy="151" r="6" /><circle className={styles.workflowAccentDot} cx="160" cy="151" r="6" /><circle className={styles.workflowDot} cx="224" cy="151" r="6" /></svg>
    return <svg viewBox="0 0 320 180" aria-hidden="true">{common}<path className={styles.workflowPanelStrong} d="M103 61l57-29 57 29v66l-57 29-57-29z" /><path className={styles.workflowLine} d="M103 61l57 31 57-31M160 92v64" /><path className={styles.workflowAccentLine} d="M73 92H28M292 92h-45" /><circle className={styles.workflowAgent} cx="160" cy="92" r="11" /></svg>
}

/** Presents the scroll-driven packaged workflow. */
export const SkillSequence = ({ content }: ContentProps) => {
    const [activeStage, setActiveStage] = useState(0)

    useEffect(() => {
        let frame = 0
        const updateStage = () => {
            const track = document.querySelector<HTMLElement>('[data-node="tedo-workflow-scroll"]')
            if (!track) return
            const rect = track.getBoundingClientRect()
            const travel = Math.max(rect.height - window.innerHeight, 1)
            const progress = Math.min(1, Math.max(0, -rect.top / travel))
            const nextStage = Math.min(content.skills.length - 1, Math.floor(progress * content.skills.length))
            setActiveStage(nextStage)
        }
        const onScroll = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(updateStage)
        }
        updateStage()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [content.skills.length])

    const [, activeName, activeJob, activeState, activeTone] = content.skills[activeStage]

    return (
        <Tree grammar="tedo-workflow-section" render={defineGrammarComponent("tedo-workflow-section", {
            anchor: defineGrammarLeaf("anchor", {}, () => <span id="workflow" />),
            meta: defineGrammarComponent("tedo-section-meta", {
                label: defineGrammarLeaf("text", {}, () => <span>{content.skillsKicker}</span>),
                aside: defineGrammarLeaf("text", {}, () => <span>SCROLL TO RUN · SIX PACKAGED STAGES</span>),
            }),
            heading: defineGrammarComponent("tedo-chapter-heading", {
                chapterTitle: defineGrammarLeaf("heading", {}, () => <Heading props={{ content: content.skillsTitle, level: 2, tone: "onDark" }} />),
                chapterSummary: defineGrammarLeaf("text", {}, () => <p>{content.skillsCopy}</p>),
            }),
            scrollTrack: defineGrammarComponent("tedo-workflow-scroll", {
                stickyFrame: defineGrammarComponent("tedo-workflow-sticky", {
                    dashboard: defineGrammarComponent("tedo-workflow-dashboard", {
                        stateMarker: defineGrammarLeaf("state", {}, () => <span className={styles.workflowStateMarker} data-stage={activeStage} data-tone={activeTone} />),
                        stageNavigation: defineGrammarComponent("tedo-workflow-stage-list", {
                            stages: content.skills.map(([index, name, , state], stage) => defineGrammarComponent("tedo-workflow-stage-item", {
                                stageIndex: defineGrammarLeaf("text", {}, () => <span data-active={stage === activeStage}>{index}</span>),
                                stageDetail: defineGrammarComponent("tedo-workflow-stage-detail", {
                                    stageName: defineGrammarLeaf("text", {}, () => <b>{name}</b>),
                                    stageState: defineGrammarLeaf("text", {}, () => <small>{state}</small>),
                                }),
                            })),
                        }),
                        activeCanvas: defineGrammarComponent("tedo-workflow-canvas", {
                            canvasMeta: defineGrammarComponent("tedo-workflow-canvas-meta", {
                                flowName: defineGrammarLeaf("text", {}, () => <span>TEDO / DELIVERY FLOW</span>),
                                flowPosition: defineGrammarLeaf("text", {}, () => <span>0{activeStage + 1} OF 06</span>),
                            }),
                            illustration: defineGrammarProjection("opaque-content-unit", () => <span className={styles.workflowCanvasArt} key={activeName}><WorkflowIllustration stage={activeStage} /></span>),
                            progressRail: defineGrammarComponent("tedo-workflow-progress", {
                                completedTrack: defineGrammarLeaf("decoration", {}, () => <i />),
                                activeKnob: defineGrammarLeaf("decoration", {}, () => <b />),
                            }),
                        }),
                        narrative: defineGrammarComponent("tedo-workflow-narrative", {
                            activeState: defineGrammarLeaf("text", {}, () => <span>{activeState}</span>),
                            activeTitle: defineGrammarLeaf("heading", {}, () => <Heading props={{ content: activeName, level: 3, tone: "onDark" }} />),
                            activeSummary: defineGrammarLeaf("text", {}, () => <p>{activeJob}</p>),
                            continueCue: defineGrammarLeaf("text", {}, () => <small>SCROLL TO CONTINUE <i>↓</i></small>),
                        }),
                    }),
                }),
            }),
        })} />
    )
}

/** Shows delivery proof and outcome metrics. */
export const ExecutionReceipt = ({ content }: ContentProps) => (
    <Tree grammar="tedo-proof-section" render={defineGrammarComponent("tedo-proof-section", {
        anchor: defineGrammarLeaf("anchor", {}, () => <span id="proof" />),
        meta: defineGrammarComponent("tedo-section-meta", {
            label: defineGrammarLeaf("text", {}, () => <span>{content.proofKicker}</span>),
            aside: defineGrammarLeaf("text", {}, () => <span>TRACEABLE DELIVERY · SAMPLE RUN</span>),
        }),
        content: defineGrammarComponent("tedo-proof-content", {
            outcomeMetric: defineGrammarComponent("tedo-proof-metric", {
                resultValue: defineGrammarLeaf("text", {}, () => <strong className={styles.metric}>{content.metric}</strong>),
                resultExplanation: defineGrammarLeaf("text", {}, () => <p className={styles.metricCopy}>{content.metricCopy}</p>),
            }),
            deliveryReceipt: defineGrammarComponent("tedo-proof-receipt", {
                receiptMeta: defineGrammarComponent("tedo-proof-receipt-meta", {
                    receiptId: defineGrammarLeaf("text", {}, () => <span>{content.receiptId}</span>),
                    verificationTime: defineGrammarLeaf("text", {}, () => <span>VERIFIED 14:32:08</span>),
                }),
                receiptTitle: defineGrammarLeaf("heading", {}, () => <span id="proof-title"><Heading props={{ content: content.proofTitle, level: 2, tone: "onDark" }} /></span>),
                receiptExplanation: defineGrammarLeaf("text", {}, () => <p>{content.proofCopy}</p>),
                receiptStats: defineGrammarComponent("tedo-proof-stats", {
                    measures: content.stats.map(([label, value]) => defineGrammarComponent("tedo-proof-stat", {
                        measureLabel: defineGrammarLeaf("text", {}, () => <dt>{label}</dt>),
                        measureValue: defineGrammarLeaf("text", {}, () => <dd>{value}</dd>),
                    })),
                }),
            }),
        }),
    })} />
)

/** Provides the primary project-conversation action. */
export const MissionCta = ({ content }: ContentProps) => {
    const router = useRouter()
    return (
        <Tree grammar="tedo-mission-cta" render={defineGrammarComponent("tedo-mission-cta", {
            copy: defineGrammarComponent("tedo-mission-cta-copy", {
                kicker: defineGrammarLeaf("text", {}, () => <span>{content.ctaKicker}</span>),
                heading: defineGrammarLeaf("heading", { content: content.ctaTitle, level: 2, tone: "onDark" }, () => <Heading props={{ content: content.ctaTitle, level: 2, tone: "onDark" }} />),
            }),
            action: defineGrammarComponent("tedo-mission-cta-action", {
                body: defineGrammarLeaf("text", {}, () => <p>{content.ctaCopy}</p>),
                action: defineGrammarProjection("opaque-content-unit", () => <button type="button" onClick={() => router.push("/chat")}>{content.ctaButton}<span aria-hidden>Open</span></button>),
            }),
        })} />
    )
}

/** Closes the V6 surface with brand accountability copy. */
export const TedoFooter = ({ content }: ContentProps) => (
    <Tree grammar="tedo-footer" render={defineGrammarComponent("tedo-footer", {
        mark: defineGrammarProjection("opaque-content-unit", () => <Wordmark onDark />),
        copy: defineGrammarLeaf("text", {}, () => <span>{content.footer}</span>),
        year: defineGrammarLeaf("text", {}, () => <span>Year {new Date().getFullYear()} TEDO</span>),
    })} />
)

/** Renders the complete V6 operating-model landing surface. */
export const TedoV6 = ({ locale }: TedoV6Props) => {
    const content: Copy = locale === "en" ? copy.en : copy.vi
    return <Tree grammar="tedo-operating-page" render={defineGrammarComponent("tedo-operating-page", {
        styleMarker: defineGrammarLeaf("state", {}, () => <span className={styles.grammarScope} />),
        navigation: defineGrammarProjection("opaque-content-unit", () => <TedoNav content={content} />),
        routeRail: defineGrammarProjection("opaque-content-unit", () => <ExecutionRail />),
        hero: defineGrammarProjection("opaque-content-unit", () => <HarnessHero content={content} />),
        runtime: defineGrammarProjection("opaque-content-unit", () => <MissionRuntime content={content} />),
        workflow: defineGrammarProjection("opaque-content-unit", () => <SkillSequence content={content} />),
        proof: defineGrammarProjection("opaque-content-unit", () => <ExecutionReceipt content={content} />),
        cta: defineGrammarProjection("opaque-content-unit", () => <MissionCta content={content} />),
        footer: defineGrammarProjection("opaque-content-unit", () => <TedoFooter content={content} />),
    })} />
}

/** The public V6 operating-model band, embedded inside TEDO's existing consultation-led landing. */
export const TedoV6FeatureBand = ({ locale }: TedoV6Props) => {
    const content: Copy = locale === "en" ? copy.en : copy.vi
    return <Tree grammar="tedo-feature-band" render={defineGrammarComponent("tedo-feature-band", {
        styleMarker: defineGrammarLeaf("state", {}, () => <span className={styles.grammarScope} />),
        routeRail: defineGrammarProjection("opaque-content-unit", () => <ExecutionRail />),
        runtime: defineGrammarProjection("opaque-content-unit", () => <MissionRuntime content={content} />),
        workflow: defineGrammarProjection("opaque-content-unit", () => <SkillSequence content={content} />),
        proof: defineGrammarProjection("opaque-content-unit", () => <ExecutionReceipt content={content} />),
    })} />
}

/** Agent delivery visual sized for the original split hero. */
export const AiFirstDeliveryVisual = () => <Tree grammar="tedo-delivery-visual" render={defineGrammarComponent("tedo-delivery-visual", {
    styleMarker: defineGrammarLeaf("state", {}, () => <span className={styles.grammarScope} />),
    runway: defineGrammarProjection("opaque-content-unit", () => <AgentRunway />),
})} />
