import { Fragment, type ReactNode } from "react"
import { grammarNodeProps, grammarSpec, type GrammarKey } from "@/components/grammar"
import type { GrammarComponent, LeafComponent } from "@/components/grammar/props"

/**
 * BRANCH - `Tree`: the smallest branch there is. It draws ONE registry node.
 *
 * Anything needing more than one node is a named branch that nests these. That is the whole of the
 * assembly story: the registry describes a node, a branch describes how nodes stack.
 *
 * IT OWNS NO CLASS OF ITS OWN. Every class on the rendered node comes from the registry entry, so
 * there is no seam here for a caller or a maintainer to quietly adjust.
 *
 * INSPECTABILITY. The node carries `data-node` (which key drew it) and `data-why` (why the things
 * inside it sit that way). The reason travels into the DOM because the place a tree is wrong is
 * the place a reader is looking when they notice.
 */

/** Props for {@link Tree}. */
export interface TreeProps<K extends GrammarKey> {
    /**
     * The registry key. This is the ONLY layout decision an author makes: it fixes the node's
     * classes and, through the key's own name, what belongs inside it.
     */
    grammar: K
    /** Named content whose metadata and source body satisfy this exact grammar. */
    render: GrammarComponent<NoInfer<K>>
}

/** Props for rendering only a grammar's validated content inside a branch-owned host. */
export interface GrammarContentProps<K extends GrammarKey> {
    grammar: K
    render: GrammarComponent<NoInfer<K>>
}

/**
 * Render one already-typed grammar-shaped value: a nested grammar identity, bound either as
 * checked slots or as an already-drawn projection.
 *
 * A projection is a branch that already drew the host for this grammar. Opening another Tree
 * around it changes the DOM and therefore the layout, so it is rendered as-is rather than
 * re-wrapped. Shared by {@link GrammarContent}'s own child loop and by any branch that needs
 * surgical control over WHERE one named child lands - a SurfaceCard-family branch, for one, holds
 * a `labelled-surface-section` grammar's `label` outside its vendor body and its `body` inside,
 * which means it cannot let `GrammarContent` walk the whole node in one pass.
 */
export const renderGrammarValue = <const K extends GrammarKey>(
    value: GrammarComponent<K>,
    key: string | number,
): ReactNode => {
    if (value.kind === "projection") return <Fragment key={key}>{value.project()}</Fragment>
    return <Tree key={key} grammar={value.meta.grammar} render={value} />
}

/** Render validated slots without choosing or opening their host. */
export const GrammarContent = <const K extends GrammarKey>({ grammar, render }: GrammarContentProps<K>) => {
    if (render.kind === "projection") return <>{render.project()}</>
    const spec = grammarSpec(grammar)
    const slots = render.slots
    return Object.keys(spec.children).flatMap((slot) => {
        const value = slots[slot as keyof typeof slots]
        let values: ReadonlyArray<unknown> = []
        if (Array.isArray(value)) values = value
        else if (value !== undefined) values = [value]
        return values.map((component: unknown, index: number) => {
            const child = component as GrammarComponent<GrammarKey> | LeafComponent<string, Readonly<Record<never, never>>>
            if (child.meta.shape === "grammar") {
                return renderGrammarValue(child as GrammarComponent<GrammarKey>, `${slot}-${index}`)
            }
            const leaf = child as LeafComponent<string, Readonly<Record<never, never>>>
            return <Fragment key={`${slot}-${index}`}>{leaf()}</Fragment>
        })
    })
}

/**
 * Draw one registry node.
 *
 * @param props - {@link TreeProps}
 */
export const Tree = <const K extends GrammarKey>({ grammar, render }: TreeProps<K>) => {
    const nodeProps = grammarNodeProps(grammar)
    /*
     * THE ENTRY NAMES THE ELEMENT, NOT THE CALLER. A `<section>` is a real landmark region of the
     * document, which is MEANING, and meaning belongs beside the classes and the children the key
     * already fixes.
     *
     * The alternative was an `as` prop, and it is the wrong door: it hands the element back to the
     * call site, which is the single decision `TreeProps` exists to refuse.
     */
    const spec = grammarSpec(grammar)
    const Host = spec.host ?? "div"
    return (
        <Host data-component="Tree" {...nodeProps}>
            <GrammarContent grammar={grammar} render={render} />
        </Host>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "branch", world: "pure" } as const
