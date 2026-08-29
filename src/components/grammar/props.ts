import type { ComponentType, ReactNode } from "react"
import type { ChildrenOf, GrammarKey, GrammarPropValue } from "@/components/grammar"

/**
 * THE SLOT SHAPES, as types rather than as a convention.
 *
 * Every component below a block takes a FIXED set of named slots and no others. Written as a type
 * alias, a fourth slot is not discouraged - it does not compile, because the alias is the whole
 * shape and there is nowhere to put one.
 *
 * This is the difference between a rule and a fence. `interface XProps { props: XData }` is a
 * rule: correct today, and one `extends` away from carrying a `className` next month.
 * `type XProps = LeafProps<XData>` is a fence.
 */

/**
 * What DATA is: anything a JSON document could hold.
 *
 * A function does not satisfy it, and that is the only thing stopping a component being smuggled
 * through `props` - which is why handlers travel in their own slot rather than beside the data.
 *
 * NOTE FOR AUTHORS: a leaf's data must be declared with `type`, not `interface`. TypeScript gives
 * an implicit index signature to a type alias and not to an interface, so an interface silently
 * fails this constraint. That is not a quirk to work around - it is the constraint doing its job.
 */
export type DataValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | ReadonlyArray<DataValue>
    | { readonly [key: string]: DataValue }

/** The shape any leaf's or branch's data must have: data all the way down. */
export type ComponentData = { readonly [key: string]: DataValue }

/** The shape any component's handlers must have: functions, kept apart from the data. */
export type ComponentActions = { readonly [key: string]: ((...args: Array<never>) => void) | undefined }

/**
 * A LEAF's props. Three slots, no fourth.
 *
 * `props` - what it draws. `on` - what it does. `isLoading` - handed down, never decided here.
 * No `children`: only a branch assembles. No `className`: a caller who can restyle a node has
 * become its second owner.
 */
export type LeafProps<D extends ComponentData, A extends ComponentActions = ComponentActions> = {
    readonly props: D
    readonly on?: A
    readonly isLoading?: boolean
}

/** Source identity carried by a leaf implementation, separate from its runtime data. */
export type LeafComponentMeta<N extends string, P extends Readonly<Record<string, GrammarPropValue>>> = {
    readonly shape: "leaf"
    readonly name: N
    readonly props: P
}

/** A closed leaf render whose identity and grammar-relevant literals survive import boundaries. */
export type LeafComponent<N extends string, P extends Readonly<Record<string, GrammarPropValue>>> = {
    (): ReactNode
    readonly meta: LeafComponentMeta<N, P>
}

/** Close runtime data over one leaf while exposing only the literals the grammar constrains. */
export const defineGrammarLeaf = <
    const N extends string,
    const P extends Readonly<Record<string, GrammarPropValue>>,
>(
        name: N,
        props: P,
        render: () => ReactNode,
    ): LeafComponent<N, P> => Object.assign(render, {
        meta: { shape: "leaf", name, props } as const,
    })

/** Source identity carried by every grammar value admitted by a grammar branch. */
export type GrammarComponentMeta<K extends GrammarKey> = {
    readonly shape: "grammar"
    readonly grammar: K
}

/** A checked slot record. It carries content; it is deliberately not callable. */
export type GrammarSlots<K extends GrammarKey> = {
    readonly kind: "slots"
    readonly meta: GrammarComponentMeta<K>
    readonly slots: ChildrenOf<K>
}

/** A branch-owned projection that has already drawn the host a grammar cannot express. */
export type GrammarProjection<K extends GrammarKey> = {
    readonly kind: "projection"
    readonly meta: GrammarComponentMeta<K>
    readonly project: () => ReactNode
}

/** A real component type whose runtime input remains separate from its grammar identity. */
export type GrammarRenderComponent<
    K extends GrammarKey,
    P,
> = ComponentType<P> & {
    readonly kind: "component"
    readonly meta: GrammarComponentMeta<K>
}

/** Checked bound content used by Tree and aggregate grammar projections. */
export type BoundGrammarComponent<K extends GrammarKey> = GrammarSlots<K> | GrammarProjection<K>

/**
 * One grammar identity with either bound slots or a real component input.
 *
 * Omitting `P` selects the bound lane used by Tree. Supplying `P` selects the component-type lane
 * used by a host that passes runtime `props` without closing them into slot callbacks.
 */
export type GrammarComponent<
    K extends GrammarKey,
    P = undefined,
> = [P] extends [undefined]
    ? BoundGrammarComponent<K>
    : GrammarRenderComponent<K, P>

/** The two supported builder calls: checked bound slots, or a real component type. */
type DefineGrammarComponent = {
    <const K extends GrammarKey>(grammar: K, slots: ChildrenOf<K>): GrammarSlots<K>
    <
        const K extends GrammarKey,
        P,
    >(
        grammar: K,
        render: ComponentType<P>,
    ): GrammarRenderComponent<K, P>
}

/**
 * Bind either checked named slots or one real component type to an exact grammar identity.
 *
 * The component overload keeps runtime `props` outside the grammar metadata. A host can therefore
 * pass changing data into a stable component type without rebuilding a forest of closed callbacks.
 */
export const defineGrammarComponent = ((grammar: GrammarKey, input: unknown) => {
    if (typeof input === "function") {
        return Object.assign(input, {
            kind: "component" as const,
            meta: { shape: "grammar", grammar } as const,
        })
    }
    return {
        kind: "slots" as const,
        meta: { shape: "grammar", grammar } as const,
        slots: input,
    }
}) as DefineGrammarComponent

/** Brand the complete node produced by a branch that owns wrappers a grammar cannot express. */
export const defineGrammarProjection = <const K extends GrammarKey>(
    grammar: K,
    render: () => ReactNode,
): GrammarProjection<K> => ({
        kind: "projection",
        meta: { shape: "grammar", grammar } as const,
        project: render,
    })

/** A branch that projects one typed grammar component into its own wrapper mechanics. */
export type GrammarBranchProps<K extends GrammarKey> = {
    readonly grammar: K
    readonly render: GrammarComponent<NoInfer<K>>
    readonly isLoading?: boolean
}
