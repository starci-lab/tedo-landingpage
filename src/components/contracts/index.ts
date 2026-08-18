/**
 * THE REGISTRY.
 *
 * One entry describes ONE node: the classes it wears, the element it opens, and why the things
 * inside it sit that way. Nothing else. What goes inside is the assembling branch's business.
 *
 * A KEY'S NAME MUST FIX ITS CHILDREN. `container` and `section` are not names here - neither says
 * what goes inside, so anything could, and the entry stops constraining anything. `page-measure`
 * says what it holds: the page's own reading width. `page-band` says what it holds: one vertical
 * rhythm unit of the page. That is also what keeps `why` honest: a key drawing anything cannot say
 * why any one thing is there, but the reason a band keeps its neighbour at arm's length is the same
 * reason at every band.
 */

/**
 * The closed set of classes a node may lay its children out with.
 *
 * `gap-[13px]` is not forbidden - it is UNREPRESENTABLE, because it is not a member. That single
 * property is what makes a whole family of patrol rules unnecessary: there is nothing to police
 * when the bad value cannot be typed.
 */
export type LayoutClassName =
    | "flex" | "flex-row" | "flex-col" | "flex-wrap"
    | "items-center" | "items-baseline" | "justify-between"
    | "gap-2" | "gap-3"
    | "mx-auto" | "w-full" | "max-w-6xl" | "px-5" | "sm:px-8"
    | "scroll-mt-20" | "py-20" | "sm:py-28"
    // -- appended for the app-shell/consultation/quote migration wave --
    | "min-h-screen" | "animate-pulse" | "py-12"
    | "grid" | "place-content-center" | "max-w-xl" | "text-center" | "justify-center"
    | "pt-8"
    | "px-6" | "py-3" | "print:hidden" | "gap-4" | "border-b" | "bg-surface"
    | "mb-3" | "max-w-2xl" | "grid-cols-2" | "first:mt-0" | "sm:grid-cols-3"
    | "rounded-2xl" | "border" | "border-brand/25" | "bg-brand-soft/50" | "p-5"
    | "flex-1" | "overflow-y-hidden" | "px-1" | "pb-1" | "pt-2"
    | "bg-white" | "p-2" | "sm:flex-row" | "sm:items-end"
    | "sm:grid-cols-2" | "items-start" | "border-green/30" | "bg-green/10"
    | "min-w-0" | "overflow-x-auto" | "my-3" | "list-disc" | "list-decimal" | "pl-5"
    | "space-y-1" | "marker:text-brand" | "marker:font-semibold"
    // -- consultation-chat wave --
    | "relative" | "bg-surface-2" | "top-0" | "z-30" | "border-line" | "bg-white/95" | "backdrop-blur"
    | "h-16" | "gap-8" | "py-8" | "chat-layout-grid" | "lg:py-12" | "mt-8" | "text-ink"
    | "max-w-chat-bubble" | "px-4" | "text-sm" | "leading-relaxed" | "sm:text-base"
    | "justify-self-end" | "whitespace-pre-wrap" | "bg-ink" | "text-white" | "justify-self-start"
    | "sm:px-5" | "sm:py-4" | "w-fit" | "text-ink-muted" | "rounded-xl" | "border-red-200"
    | "bg-red-50" | "p-3" | "text-red-800" | "p-4" | "mt-3" | "gap-1" | "mb-2" | "sticky"
    | "bottom-3" | "mt-6" | "items-end" | "shrink-0" | "space-y-4" | "lg:sticky" | "lg:top-24"
    | "lg:self-start" | "h-2" | "overflow-hidden" | "rounded-full" | "mt-5" | "border-t" | "pt-4"
    | "bg-brand-soft"
    // -- quote/print document wave --
    | "mt-auto" | "pt-3" | "text-[8pt]" | "mb-6"
    | "quote-root" | "bg-sky" | "print:gap-0" | "print:bg-canvas" | "print:py-0"
    | "items-start" | "mt-10" | "grid-cols-4" | "gap-px" | "rounded-lg" | "bg-line"
    | "gap-x-6" | "gap-y-2" | "text-[9.5pt]" | "leading-snug" | "mt-1"
    | "font-mono" | "text-[8.5pt]" | "font-medium" | "text-brand"
    | "border-line/70" | "last:border-b-0"
    | "text-ink-faint" | "gap-6" | "text-ink-body" | "text-[9pt]" | "break-inside-avoid" | "space-y-3"
    | "max-w-print-a4" | "w-print-a4" | "w-print-col-index" | "w-print-col-wide"
    | "px-print-page" | "py-print-page"
    | "py-print-row" | "mt-print-row" | "max-w-print-wide" | "max-w-print-medium" | "max-w-print-narrow"
    // -- marketing section migration wave: additive only, see report --
    | "z-50" | "bg-white/80" | "backdrop-blur-md" | "hidden" | "lg:flex" | "gap-7" | "p-1" | "sm:flex"
    | "bg-surface-2/60" | "py-14" | "footer-columns-grid" | "gap-10" | "max-w-xs" | "mt-12" | "pt-6"
    | "footer-legal-grid" | "sm:gap-x-10" | "sm:col-span-2"
    | "gap-12" | "py-16" | "sm:py-24" | "hero-visual-grid" | "lg:gap-10"
    | "pointer-events-none" | "inset-0" | "-z-10" | "tedo-sky" | "tedo-dots"
    | "inset-x-0" | "bottom-0" | "z-40" | "transition-transform" | "duration-300" | "md:hidden"
    | "translate-y-0" | "translate-y-full" | "sticky-cta-safe-pad"
    | "bg-surface/30" | "lg:grid-cols-4" | "rounded-3xl" | "md:grid-cols-2" | "md:grid-cols-3"
    | "contact-split-grid" | "lg:gap-16" | "flex-wrap"
    | "gap-5" | "py-5" | "first:pt-0" | "last:border-0" | "last:pb-0" | "h-7" | "w-7" | "bg-brand/10"
    | "lg:mx-auto" | "lg:max-w-4xl" | "ring-2" | "ring-accent/60" | "border-brand" | "bg-brand-soft/40"
    | "border-brand/30"
    | "border-y" | "bg-surface/40" | "sr-only" | "bg-canvas"
    | "border-l-4" | "border-accent" | "bg-accent/6"
    | "sm:py-20" | "card-elevated-shadow" | "aspect-video" | "bg-gradient-to-br" | "from-brand-soft"
    | "to-surface-2" | "opacity-40" | "place-items-center" | "left-4" | "top-4" | "right-4" | "rounded"
    | "bg-white/85" | "px-2" | "py-1" | "uppercase" | "tracking-wide" | "max-w-stack-col" | "text-right"
    | "justify-end" | "mt-14" | "py-10" | "sm:px-10"
    | "absolute" | "fixed" | "grow" | "lg:grid-cols-2" | "mt-2" | "mt-4" | "p-6" | "py-4" | "sm:p-7" | "text-xs"

/** Literal values a contract may require from a child component's data props. */
export type ContractPropValue = string | number | boolean | null

/** A child appears once unless it explicitly declares a repeated run and its resting count. */
export type ContractChildCardinality =
    | { readonly repeats?: false, readonly restingCount?: never }
    | { readonly repeats: true, readonly restingCount: number }

/** One named child slot: a leaf, or another closed contract identity. */
export type ContractChildSpec = ContractChildCardinality & {
    readonly leaf?: string | ReadonlyArray<string>
    readonly contract?: string | ReadonlyArray<string>
    readonly props?: Readonly<Record<string, ContractPropValue>>
    readonly optional?: boolean
}

type ChildProps<S> = S extends { readonly props?: infer P }
    ? P extends Readonly<Record<string, ContractPropValue>> ? P : Readonly<Record<never, never>>
    : Readonly<Record<never, never>>

/**
 * The one child an entry does NOT name: whatever its caller brought.
 *
 * A measure fixes WHERE the content it holds sits and can never fix WHICH node that is - the same
 * band holds a hero layout on one page and a pricing grid on the next - so a literal key in that
 * slot would be a lie in every use but one. The `$` says it is not a member of the vocabulary:
 * nothing may be named this, and `contractSpec` never resolves it.
 */
type CallerContent = "$content"

/**
 * The identity a parent contract needs from one already-validated child contract.
 *
 * The child builder has already checked its own slots. Re-expanding those slots while validating
 * the parent recursively opens the complete registry at every edge; the parent only consumes the
 * closed identity at runtime.
 */
type ContractChild<S> = S extends { readonly contract: infer K }
    ? [K extends ReadonlyArray<infer A> ? A : K] extends [CallerContent]
        ? import("@/components/contracts/props").ContractComponent<ContractKey>
        : (K extends ReadonlyArray<infer A> ? A : K) extends infer C extends ContractKey
            ? import("@/components/contracts/props").ContractComponent<C>
            : never
    : never

type LeafChild<S> = S extends { readonly leaf: infer N }
    ? (N extends ReadonlyArray<infer A> ? A : N) extends infer L extends string
        ? import("@/components/contracts/props").LeafComponent<L, ChildProps<S>>
        : never
    : never

type OneChild<S> = ContractChild<S> | LeafChild<S>

type ChildValue<S> = S extends { readonly repeats: true }
    ? ReadonlyArray<OneChild<S>>
    : OneChild<S>

type RequiredChildNames<K extends ContractKey> = {
    [S in keyof (typeof CONTRACTS)[K]["children"]]:
        (typeof CONTRACTS)[K]["children"][S] extends { readonly optional: true } ? never : S
}[keyof (typeof CONTRACTS)[K]["children"]]

type OptionalChildNames<K extends ContractKey> = Exclude<
    keyof (typeof CONTRACTS)[K]["children"],
    RequiredChildNames<K>
>

/** The exact named render record admitted by one contract key. */
export type ChildrenOf<K extends ContractKey> = {
    readonly [S in RequiredChildNames<K>]: ChildValue<(typeof CONTRACTS)[K]["children"][S]>
} & {
    readonly [S in OptionalChildNames<K>]?: ChildValue<(typeof CONTRACTS)[K]["children"][S]>
}

/**
 * Elements an entry may name as its own host.
 *
 * A `<section>` is not a `<div>` with a class - a page band is a real landmark region of the
 * document, and only the entry that draws it may say so. Absent means `div`, a node with no
 * meaning of its own.
 */
export type ContractHost = "div" | "section" | "main" | "header" | "footer" | "aside" | "nav" | "ul" | "ol" | "li" | "form" | "dl" | "span"

/** One registry entry: a node's own classes, the element it opens, and why it holds its children that way. */
export interface ContractSpec {
    /** The class string of the node itself. Not a prop, not reachable by a caller. */
    readonly classes: ReadonlyArray<LayoutClassName>
    /** The element this node opens. Absent means `div` - a node with no meaning of its own. */
    readonly host?: ContractHost
    /** Named child grammar. No anonymous `children` hole exists in a contract. */
    readonly children: Readonly<Record<string, ContractChildSpec>>
    /**
     * Why the children of this node sit the way they do, in one sentence.
     *
     * A REASON, never a restatement of the key: "a row of chips" only says the key again; "the
     * tags wrap onto their own line before the title does" is the fact that made the node exist.
     */
    readonly why: string
}

/**
 * Build the registry.
 *
 * A function rather than a bare literal so the keys are checked in one place and stay literal
 * without an `as const` at the call site.
 */
const buildContracts = <const T extends { readonly [K in keyof T]: ContractSpec }>(contracts: T): T =>
    contracts

/**
 * The registry. Every node the frame may draw, and the reason each one holds its children the
 * way it does.
 *
 * KEEP THE NAMES CHILD-FIXING. A key whose name does not say what belongs inside it stops
 * constraining anything, and its `why` decays into a label the moment a second page uses it.
 *
 * `Container` and `Section` are NOT folded into contract keys here. The page's reading measure and
 * its vertical rhythm are real future entries - `page-band`/`page-measure`, shaped exactly like
 * `labelled-surface-section` below - but `starci-fe/no-dead-contract-key` runs against real
 * product source, not against intent recorded in a comment, and neither key has a caller until a
 * marketing section is migrated onto the contract system. That migration is a later wave's own
 * work; it adds the two keys back together with their first real `<Tree>` call in the same change,
 * which is the only way this table has ever grown a member honestly.
 */
export const CONTRACTS = buildContracts({
    "card-label-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-center", "justify-between", "gap-3"],
        children: {
            title: { leaf: "heading" },
            end: { leaf: "text", optional: true },
        },
        why: "the title reads before the trailing fact, and justify-between keeps the fact pinned to the row's far edge; without it a long title would crowd the fact instead of the fact dropping onto its own line once space runs out.",
    },
    "list-label-row": {
        classes: ["flex", "flex-row", "flex-wrap", "items-baseline", "justify-between", "gap-2"],
        children: {
            label: { leaf: "text" },
            fact: { leaf: "text", optional: true },
        },
        why: "the label and its fact share one baseline so together they read as a single line naming the list below; without it the fact would drop under the label as a second line instead of qualifying it inline.",
    },
    "labelled-surface-section": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            label: { contract: ["card-label-row", "list-label-row"] },
            body: { contract: "$content" },
        },
        why: "the label names the surface below it and is held outside the vendor body so a frameless card or a bare list can drop the surface while the label stays; without this stack the name and the bounded content would compete for one shared edge.",
    },

    // -- appended for the app-shell/consultation/quote migration wave: additive only, see report --

    "loading-panel": {
        /*
         * Deliberately no landmark element named here. This entry is rendered from
         * `chat/loading.tsx`, a Suspense fallback - not a route file (page/layout) and not a
         * page-tier surface - so the landmark-placement law refuses that element name here even
         * though the node reads as a whole-route wait. The real `/chat` route's page file owns it.
         */
        classes: ["mx-auto", "min-h-screen", "max-w-6xl", "animate-pulse", "px-5", "py-12", "sm:px-8"],
        children: {
            bars: { leaf: "placeholder", repeats: true, restingCount: 4 },
        },
        why: "the whole route waits behind one pulsing stack while its data loads, and the fixed reading measure keeps the bars from jumping wide the instant real content settles into the same column.",
    },

    "error-panel": {
        // Not a landmark element here either, for the same route-file-only reason as `loading-panel`.
        classes: ["mx-auto", "grid", "place-content-center", "min-h-screen", "max-w-xl", "px-5", "text-center"],
        children: {
            heading: { leaf: "heading" },
            body: { leaf: "text" },
            actions: { contract: "inline-action-row" },
        },
        why: "the panel centers itself in the empty viewport the failed route leaves behind, with nothing beside it to anchor a left edge, so the title, the explanation and the recovery pair all read from the same middle column.",
    },

    "inline-action-row": {
        classes: ["flex", "justify-center", "gap-3"],
        children: {
            primary: { leaf: "action-button" },
            secondary: { leaf: "action-button", optional: true },
        },
        why: "retry and go-home read as one equally-weighted pair once neither can be reached without seeing the other, which is why they sit in one centered row instead of stacking behind a visual leader.",
    },

    "opaque-content-unit": {
        /*
         * Always bound through `defineContractProjection`, never through checked slots - so its own
         * `classes`/`children` never reach the document. A cross-cutting wrapper such as `Reveal`, or
         * a route that opens on a section it does not own the inside of, needs a contract IDENTITY to
         * satisfy a typed `render` prop without re-describing a shape drawn entirely somewhere else.
         */
        classes: [],
        children: {},
        why: "a cross-cutting wrapper or a thin route sometimes only needs a checked identity to carry content it will never open a host around, and forcing that content through an invented shape would describe a node that nothing here actually draws.",
    },

    "route-body-with-back-nav": {
        classes: [],
        host: "main",
        children: {
            nav: { contract: "back-link-row" },
            content: { contract: "$content" },
        },
        why: "a route with no hero section of its own still needs one predictable way out before its content starts, so the return link sits above whatever the content slot ships rather than each future page deciding for itself.",
    },

    "back-link-row": {
        /*
         * `link` is `$content`, not a leaf. A leaf is pure by policy - see the leaf tier's own
         * "world: pure" marker - and the control here calls a router, which no leaf may do; it is
         * a small connected composite instead, carried through the same opaque-content path
         * `Reveal` uses for a whole section.
         */
        classes: ["mx-auto", "w-full", "max-w-6xl", "px-5", "sm:px-8", "pt-8"],
        children: {
            link: { contract: "$content" },
        },
        why: "the return path reads as its own top strip held to the page's reading column, clear of whatever the route draws immediately under it so a returning visitor is never guessing which control takes them home.",
    },

    "landing-main": {
        classes: [],
        host: "main",
        children: {
            hero: { contract: "$content" },
            sections: { contract: "$content", repeats: true, restingCount: 11 },
        },
        why: "the hero opens the page as the one unread first impression before anything else competes for it, then the buyer-ordered run that follows is a flat stack of already-drawn units the landmark itself never re-arranges.",
    },

    "quote-preview-shell": {
        classes: [],
        host: "main",
        children: {
            toolbar: { contract: "$content" },
            document: { contract: "$content" },
        },
        why: "the screen-only toolbar and the printable proposal beneath it are two independent bodies because the print stylesheet drops the first one whole, and nothing may ride along inside it when it goes.",
    },

    "quote-preview-toolbar": {
        // `w-full` + `border-b` write this as a band, the one ground shape an entry may still paint.
        classes: ["w-full", "border-b", "bg-surface", "px-6", "py-3", "print:hidden"],
        children: {
            row: { contract: "quote-preview-toolbar-row" },
        },
        why: "the toolbar has to vanish as one unit the instant printing starts, so it needs its own full-width banded ground the print stylesheet can hide in a single rule instead of chasing each descendant.",
    },

    "quote-preview-toolbar-row": {
        classes: ["mx-auto", "flex", "items-baseline", "justify-between", "gap-4", "max-w-print-a4"],
        children: {
            details: { contract: "quote-preview-toolbar-details" },
            hint: { leaf: "text" },
        },
        why: "the toolbar previews the printed sheet's own measure so what the reviewer sees on screen already lines up with the page they are about to export, with the export hint pinned to the far edge.",
    },

    "quote-preview-toolbar-details": {
        classes: [],
        children: {
            title: { leaf: "text" },
            meta: { leaf: "text" },
        },
        why: "the printable-document label and the sample dataset it was filled from are two separate facts about one preview, and stacking them keeps a translator from ever needing to split one merged string.",
    },

    "attachment-grid": {
        classes: ["mb-3", "grid", "max-w-2xl", "grid-cols-2", "gap-2", "first:mt-0", "sm:grid-cols-3"],
        children: {
            items: { leaf: "attachment-link", repeats: true, restingCount: 2 },
        },
        why: "a run of attachments reads as thumbnails at a glance rather than a list read top to bottom, so it wraps into a grid the moment more than a couple ship on one message.",
    },

    "proposal-panel": {
        classes: ["rounded-2xl", "border", "border-brand/25", "bg-brand-soft/50", "p-5"],
        children: {
            heading: { leaf: "heading" },
            body: { contract: "$content" },
        },
        why: "the confirm-and-generate step and the finished-documents step are two different bodies under one visual promise, so the panel's ground stays fixed while the content slot swaps what it holds as status changes.",
    },

    "proposal-document-list": {
        classes: ["grid", "gap-2"],
        children: {
            items: { leaf: "proposal-document-link", repeats: true, restingCount: 2 },
        },
        why: "the brief, the spec and the proposal generate together and are meant to be opened in that order, so they stack as one column instead of competing for a reader's eye at once.",
    },

    "proposal-generate-body": {
        classes: [],
        children: {
            description: { leaf: "text" },
            error: { leaf: "text", optional: true },
            action: { leaf: "action-button" },
        },
        why: "the confirm action reads as the last thing on the card because everything above it - the explanation, and the failure message when there is one - is what a reader needs before deciding to press it.",
    },

    "prompt-composer-body": {
        /*
         * The visual card ground lives here rather than on a hand-written `form`. `form` is a
         * SEMANTIC_HOST refused only once it carries a class - see `no-structural-host-outside-
         * contract-frame` - so the real `<form onSubmit=...>` stays bare and this key's Tree node,
         * nested one level inside it, is what actually draws the raised-looking surface. No
         * `shadow-*`: an entry may never carry elevation (`no-interaction-class-in-entry`), and none
         * of the four vendor-mechanic branches this table's own comment names cover a plain `<form>`
         * shape either, so the border alone marks the surface instead.
         */
        classes: ["rounded-2xl", "border", "bg-white", "p-2"],
        children: {
            row: { contract: "prompt-input-row" },
            error: { leaf: "text", optional: true },
            suggestions: { contract: "suggestion-chip-row" },
        },
        why: "the field and its send action sit as one row, a validation message only interrupts that row when there is one to show, and the suggestion chips always follow last because they propose a prompt rather than react to one already typed.",
    },

    "prompt-input-row": {
        classes: ["flex", "flex-col", "gap-2", "sm:flex-row", "sm:items-end"],
        children: {
            field: { contract: "prompt-field-wrap" },
            submit: { leaf: "action-button" },
        },
        why: "the field grows across the whole row while the send control keeps its own fixed width beside it, and the two stack instead once the row is too narrow to hold them side by side.",
    },

    "prompt-field-wrap": {
        classes: ["flex-1", "overflow-y-hidden"],
        children: {
            control: { contract: "$content" },
        },
        why: "the growing field needs a bounded box that clips the textarea's own resize handle at exactly its row's height, which a class on the textarea itself cannot do once the row also holds a sibling button.",
    },

    "suggestion-chip-row": {
        classes: ["flex", "flex-wrap", "gap-2", "px-1", "pb-1", "pt-2"],
        children: {
            items: { leaf: "action-button", repeats: true, restingCount: 3 },
        },
        why: "each suggestion is a shortcut into the same field above it, so they read as one wrapping run of equal choices rather than a ranked list the reader has to scan top to bottom.",
    },

    "lead-form-shell": {
        // Bare `<form>` draws this - see the note on `prompt-composer-body` for why the ground
        // lives on this key's Tree node rather than on the semantic element itself.
        classes: ["grid", "gap-4", "rounded-2xl", "border", "bg-white", "p-5"],
        children: {
            intro: { contract: "$content" },
            name: { contract: "field-row" },
            contactPair: { contract: "two-col-row" },
            company: { contract: "field-row" },
            preferred: { contract: "field-row" },
            consent: { contract: "checkbox-consent-row" },
            consentError: { leaf: "text", optional: true },
            submitError: { leaf: "text", optional: true },
            submit: { leaf: "action-button" },
        },
        why: "the lead form only asks for a way to reach back out after the chat already delivered value, so every field reads as one short vertical run ending in the one action that sends it.",
    },

    "field-row": {
        classes: ["grid", "gap-2"],
        children: {
            control: { contract: "$content" },
        },
        why: "a field's label sits directly above its control with no other rung between them, because the two are read as one question-and-answer pair rather than two separate facts.",
    },

    "two-col-row": {
        classes: ["grid", "gap-4", "sm:grid-cols-2"],
        children: {
            first: { contract: "field-row" },
            second: { contract: "field-row" },
        },
        why: "phone and email are two equally-valid ways to reach the same person, so they sit side by side as a pair once the column is wide enough instead of one reading as the default and the other a fallback.",
    },

    "checkbox-consent-row": {
        classes: ["flex", "items-start", "gap-3"],
        children: {
            control: { contract: "$content" },
        },
        why: "the consent statement runs to two lines on a narrow screen, so the checkbox aligns to its first line rather than drifting to the vertical center of the whole paragraph.",
    },

    "lead-success-panel": {
        classes: ["rounded-2xl", "border", "border-green/30", "bg-green/10", "p-5"],
        children: {
            message: { leaf: "text" },
        },
        why: "the confirmation replaces the whole form rather than sitting beside it, because the fields it asked for no longer have anything left to validate once the submission already succeeded.",
    },

    "markdown-body-shell": {
        classes: ["min-w-0", "overflow-x-auto"],
        children: {
            content: { contract: "$content" },
        },
        why: "the assistant's own reply can carry a table wider than the thread column, so the reply scrolls sideways inside its own bounded box instead of forcing the whole page wider around it.",
    },

    "markdown-unordered-list": {
        classes: ["my-3", "list-disc", "space-y-1", "pl-5", "marker:text-brand"],
        host: "ul",
        children: {
            content: { contract: "$content" },
        },
        why: "the assistant's own bullet list needs breathing room between items that the surrounding paragraph rhythm does not give it, and the branded marker is what tells a bullet apart from ordinary body copy at a glance.",
    },

    "markdown-ordered-list": {
        classes: ["my-3", "list-decimal", "space-y-1", "pl-5", "marker:font-semibold", "marker:text-brand"],
        host: "ol",
        children: {
            content: { contract: "$content" },
        },
        why: "a numbered step list reads as a sequence rather than a set, so its markers carry more weight than a bullet's and the same breathing room between items keeps one step from bleeding into the next.",
    },

    // -- consultation chat workspace: additive only, see report --

    "chat-shell": {
        /*
         * No page-ground colour here. The pale-blue "surface-2" tint the hand-rolled version wore
         * is a raised-object ground by the same test `bg-surface(-|$)` already refuses on a card -
         * `no-interaction-class-in-entry` draws no line between the two, and this node is not
         * banded (no full-width rule along one edge) to earn the exemption a band gets. The page
         * chrome falls back to the ordinary white background instead.
         */
        classes: ["relative", "min-h-screen"],
        children: {
            header: { contract: "$content" },
            main: { contract: "$content" },
        },
        why: "the sticky header and the two-column workspace both need the same positioning root to measure against, so the whole screen opens one relatively-positioned box rather than each child guessing its own.",
    },

    "chat-header": {
        classes: ["sticky", "top-0", "z-30", "border-b", "border-line", "bg-white/95", "backdrop-blur"],
        host: "header",
        children: {
            row: { contract: "chat-header-row" },
        },
        why: "the way back to the marketing site has to stay reachable the whole way down a long consultation thread, so the header pins itself above the scrolling column instead of scrolling away with it.",
    },

    "chat-header-row": {
        classes: ["mx-auto", "flex", "h-16", "max-w-6xl", "items-center", "justify-between", "px-5", "sm:px-8"],
        children: {
            logo: { contract: "$content" },
            back: { contract: "$content" },
        },
        why: "the mark and the exit sit at opposite ends of one fixed-height row so a returning visitor's eye finds either edge in one glance instead of hunting the header's middle.",
    },

    "chat-main": {
        // Deliberately no landmark element named here - this file is a component, not a route
        // file, and the landmark placement law reserves that element for the route that
        // composes the whole screen. See the same note on `loading-panel`.
        classes: ["mx-auto", "grid", "max-w-6xl", "gap-8", "px-5", "py-8", "sm:px-8", "chat-layout-grid", "lg:py-12"],
        children: {
            thread: { contract: "$content" },
            sidebar: { contract: "$content" },
        },
        why: "the conversation and the project profile read as two independent columns once the viewport is wide enough to hold both, and stack in reading order the moment it is not.",
    },

    "chat-thread-section": {
        classes: ["min-w-0"],
        host: "section",
        children: {
            heading: { leaf: "heading" },
            subtitle: { leaf: "text" },
            messages: { contract: "$content" },
            composer: { contract: "$content" },
        },
        why: "the title, the one-line framing under it, the running transcript and the composer are one continuous reading column, so a table or a wide code block inside a reply can shrink to it instead of forcing the whole grid wider.",
    },

    "chat-messages-grid": {
        classes: ["mt-8", "grid", "gap-4"],
        children: {
            body: { contract: "$content" },
        },
        why: "every turn in the thread - a bubble, the thinking indicator, a discovery prompt - is a peer of every other one, so they stack as equal rows rather than any one of them claiming a wider or narrower column.",
    },

    "chat-empty-card": {
        classes: ["rounded-2xl", "border", "bg-white", "p-5", "text-ink"],
        children: {
            message: { leaf: "text" },
        },
        why: "the greeting has to read as the thread's own first turn rather than placeholder chrome, so it wears the same bounded card every real message will use once the conversation starts.",
    },

    "chat-bubble-user": {
        classes: [
            "max-w-chat-bubble", "rounded-2xl", "px-4", "py-3", "text-sm", "leading-relaxed", "sm:text-base",
            "justify-self-end", "whitespace-pre-wrap", "bg-ink", "text-white",
        ],
        children: {
            attachments: { contract: "$content" },
            body: { contract: "$content" },
        },
        why: "a visitor's own words are never mistaken for the assistant's: the solid dark ground and the right edge it pins itself to are the one signal that repeats identically at every turn of the thread.",
    },

    "chat-bubble-assistant": {
        classes: [
            "max-w-chat-bubble", "rounded-2xl", "px-4", "py-3", "text-sm", "leading-relaxed", "sm:text-base",
            "justify-self-start", "border", "bg-white", "text-ink", "sm:px-5", "sm:py-4",
        ],
        children: {
            attachments: { contract: "$content" },
            body: { contract: "$content" },
        },
        why: "the assistant's replies read as the quieter, bounded voice against the visitor's solid one, pinned to the opposite edge so the two speakers never share a column position a reader could confuse.",
    },

    "chat-sending-indicator": {
        classes: ["w-fit", "rounded-2xl", "border", "bg-white", "px-4", "py-3", "text-sm", "text-ink-muted"],
        children: {
            message: { leaf: "text" },
        },
        why: "the thinking indicator shrinks to its own text instead of claiming the assistant bubble's full measure, because it is a transient placeholder for a reply that has not arrived rather than the reply itself.",
    },

    "chat-error-alert": {
        classes: [
            "flex", "flex-wrap", "items-center", "justify-between", "gap-3", "rounded-xl",
            "border", "border-red-200", "bg-red-50", "p-3", "text-sm", "text-red-800",
        ],
        children: {
            message: { leaf: "text" },
            retry: { leaf: "action-button", optional: true },
        },
        why: "a failed send reads as an interruption in the thread's own colour rather than another bubble, and its retry control sits on the same row so recovering never costs a second scroll.",
    },

    "chat-discovery-card": {
        classes: ["rounded-2xl", "border", "bg-white", "p-4"],
        children: {
            question: { leaf: "text" },
            options: { contract: "chat-discovery-options-row" },
        },
        why: "a multiple-choice discovery question is not free text, so it wears its own card with the question stated once above the choices instead of reading as another line the visitor has to type past.",
    },

    "chat-discovery-options-row": {
        classes: ["mt-3", "flex", "flex-wrap", "gap-2"],
        children: {
            items: { leaf: "action-button", repeats: true, restingCount: 3 },
        },
        why: "the choices are mutually exclusive answers to the one question above them, so they wrap as a single run of equal buttons rather than a ranked list implying one is the default.",
    },

    "chat-thread-skeleton": {
        classes: ["grid", "animate-pulse", "gap-4"],
        children: {
            bars: { leaf: "placeholder", repeats: true, restingCount: 2 },
        },
        why: "the loading placeholder mirrors the real transcript's own stack - one wide bar, one narrower and indented - so the layout does not jump the instant real messages replace it.",
    },

    "composer-shell": {
        // Bare `<form>` draws this - same reasoning as `prompt-composer-body`: an entry may never
        // carry `shadow-*`, so this card keeps its border as the surface cue instead.
        classes: ["sticky", "bottom-3", "mt-6", "rounded-2xl", "border", "bg-white", "p-2"],
        children: {
            preview: { contract: "$content", optional: true },
            error: { leaf: "text", optional: true },
            fields: { contract: "$content" },
            controls: { contract: "composer-input-row" },
        },
        why: "the composer stays reachable at the foot of the viewport for the whole scrolling thread above it, with any pending attachments and a validation message surfacing above the input they belong to.",
    },

    "composer-attachment-preview": {
        classes: ["mb-2", "flex", "flex-wrap", "gap-2", "px-1"],
        children: {
            chips: { leaf: "selected-file-chip", repeats: true, restingCount: 2 },
        },
        why: "every attachment picked before sending is an equal peer of every other one, so the pending files wrap as one row of removable chips instead of a queue implying an order they will upload in.",
    },

    "composer-input-row": {
        classes: ["flex", "items-end", "gap-2"],
        children: {
            icons: { contract: "composer-icon-row" },
            field: { contract: "prompt-field-wrap" },
            submit: { leaf: "action-button" },
        },
        why: "the attach triggers, the growing field and the send control all sit on the input's own baseline so pressing any one of them never requires the eye to jump to a different row.",
    },

    "composer-icon-row": {
        classes: ["flex", "shrink-0", "gap-1", "pb-1"],
        children: {
            items: { leaf: "icon-button", repeats: true, restingCount: 2 },
        },
        why: "attaching an image and attaching any other file are the same kind of action at different scopes, so their triggers sit as a fixed-width pair that never grows or shrinks with the field beside it.",
    },

    "chat-sidebar": {
        classes: ["space-y-4", "lg:sticky", "lg:top-24", "lg:self-start"],
        host: "aside",
        children: {
            profileCard: { contract: "chat-profile-card" },
            extras: { contract: "$content" },
        },
        why: "the project profile and whatever comes after it - a proposal's ready documents, the optional lead form - read as one running rail that tracks the viewport once the column is tall enough to outgrow it.",
    },

    "chat-profile-card": {
        classes: ["rounded-2xl", "border", "bg-white", "p-5"],
        children: {
            header: { contract: "chat-profile-header-row" },
            progress: { contract: "chat-progress-track" },
            stats: { contract: "chat-profile-stats" },
            estimate: { contract: "chat-estimate-block", optional: true },
        },
        why: "the completeness percentage, the facts already gathered and the running estimate are all read off the same one profile a visitor can check at a glance without reopening the transcript above.",
    },

    "chat-profile-header-row": {
        classes: ["flex", "items-end", "justify-between"],
        children: {
            title: { leaf: "heading" },
            percent: { leaf: "text" },
        },
        why: "the card's own name and the one number that summarises it share a baseline so the percent reads as a caption on the title rather than a separate fact competing with it.",
    },

    "chat-progress-track": {
        classes: ["mt-3", "h-2", "overflow-hidden", "rounded-full", "bg-brand-soft"],
        children: {
            fill: { contract: "$content" },
        },
        why: "the completeness bar has to clip its own fill at a hard edge the instant the percentage changes, which a border alone cannot do once the fill's width grows past the track's own corner radius.",
    },

    "chat-profile-stats": {
        classes: ["mt-5", "grid", "gap-3", "text-sm"],
        host: "dl",
        children: {
            rows: { contract: "chat-profile-stat-row", repeats: true, restingCount: 2 },
        },
        why: "each already-gathered fact is a real term-and-definition pair a screen reader should announce as one, so the list stays a `dl` rather than a generic stack of styled paragraphs.",
    },

    "chat-profile-stat-row": {
        classes: [],
        children: {
            pair: { contract: "$content" },
        },
        why: "a `dt`/`dd` pair carries meaning only the two of them together express, so nothing named a fourth thing may sit between one fact's term and its own value.",
    },

    "chat-estimate-block": {
        classes: ["mt-5", "border-t", "border-line", "pt-4"],
        children: {
            label: { leaf: "text" },
            amount: { leaf: "text" },
        },
        why: "the running estimate is the one number worth a visual pause before it, so a rule separates it from the facts above rather than letting it read as one more row of the same list.",
    },

    // -- printable quote/proposal document: additive only, see report --

    "quote-page-footer": {
        classes: ["mt-auto", "flex", "items-end", "justify-between", "border-t", "border-line", "pt-3", "text-[8pt]", "text-ink-faint"],
        host: "footer",
        children: {
            left: { leaf: "text" },
            right: { leaf: "text" },
        },
        why: "every sheet closes on the same two facts - who sent it, which page of how many this is - pinned to the bottom of the page's own flex column so the footer never drifts up short pages and never gets pushed off long ones.",
    },

    "quote-section-heading": {
        classes: ["mb-6"],
        host: "header",
        children: {
            eyebrow: { contract: "$content" },
            title: { leaf: "heading" },
        },
        why: "every inner sheet opens on the same two-line pattern - a short label naming the section, then its real title - so a reader flipping pages finds the section name in the same place every time.",
    },

    "quote-document-shell": {
        classes: ["quote-root", "flex", "flex-col", "items-center", "gap-6", "bg-sky", "py-8", "print:gap-0", "print:bg-canvas", "print:py-0"],
        children: {
            pages: { contract: "$content" },
        },
        why: "on screen the sheets float as separate cards over a tinted backdrop so a reviewer can tell where one page ends; in print that backdrop and the gap between sheets both have to disappear so each sheet is the whole visible page.",
    },

    "quote-cover-header-row": {
        classes: ["flex", "items-start", "justify-between"],
        children: {
            identity: { contract: "$content" },
            meta: { contract: "$content" },
        },
        why: "the sender's own mark and the document's date-and-reference facts read as opposite corners of the same masthead, the way a letterhead always splits who-sent-this from when-and-which.",
    },

    "quote-facts-grid": {
        classes: ["mt-10", "grid", "grid-cols-4", "gap-px", "overflow-hidden", "rounded-lg", "border", "border-line", "bg-line"],
        host: "dl",
        children: {
            facts: { contract: "$content" },
        },
        why: "the hairline gap between cells is drawn by the grid's own background showing through a one-pixel gap, which is what keeps four unrelated facts reading as one bordered table instead of four separate boxes.",
    },

    "quote-feature-grid": {
        classes: ["grid", "grid-cols-2", "gap-4"],
        children: {
            cards: { contract: "$content" },
        },
        why: "the feature set is a set, not a ranked list, so every card gets an equal-sized cell in a two-up grid instead of one reading as more important by sitting first in a single column.",
    },

    "quote-feature-meta-row": {
        classes: ["flex", "items-baseline", "justify-between", "gap-2"],
        host: "span",
        children: {
            index: { contract: "$content" },
            badge: { contract: "$content", optional: true },
        },
        why: "the feature's running number and its optional \"core\" flag share one baseline at the top of the card, which is what tells a reader at a glance which features are foundational before reading a single word of the title.",
    },

    "quote-scope-list": {
        classes: ["grid", "grid-cols-2", "gap-x-6", "gap-y-2"],
        host: "ul",
        children: {
            items: { contract: "quote-scope-item", repeats: true, restingCount: 6 },
        },
        why: "the deliverables read as one checked set rather than a ranked sequence, so they fill a two-up grid in the order they were scoped instead of a single tall column that pushes later items off the visible page.",
    },

    "quote-scope-item": {
        classes: ["flex", "gap-2", "text-[9.5pt]", "leading-snug", "text-ink-body"],
        host: "li",
        children: {
            mark: { contract: "$content" },
            label: { contract: "$content" },
        },
        why: "the checkmark and its item read as one unit on one line, so the mark sits beside the text it confirms rather than above it where a reader could misread which item it belongs to.",
    },

    "quote-out-of-scope-list": {
        classes: ["mt-1", "space-y-1"],
        host: "ul",
        children: {
            items: { contract: "quote-note-list-item", repeats: true, restingCount: 3 },
        },
        why: "explicit exclusions are read defensively - a client scanning for what is NOT included - so each one gets its own line with room between them instead of running together as one dense paragraph.",
    },

    "quote-note-list-item": {
        classes: ["text-[9pt]", "leading-relaxed", "text-ink-body"],
        host: "li",
        children: {
            content: { contract: "$content" },
        },
        why: "one excluded item is one fact, so it wears the same quiet body copy as the rest of the document rather than a bullet style that would make the exclusions read as more alarming than they are.",
    },

    "quote-phase-item": {
        classes: ["flex", "break-inside-avoid", "gap-4", "border-b", "border-line/70", "py-3", "last:border-b-0"],
        host: "li",
        children: {
            when: { contract: "$content" },
            body: { contract: "$content" },
            tag: { contract: "$content", optional: true },
        },
        why: "a timeline phase is read left to right - when it happens, what happens, an optional flag - and the rule under each row is what keeps one phase from bleeding into the next across a page break.",
    },

    "quote-phase-when": {
        classes: ["shrink-0", "w-print-col-wide", "font-mono", "text-[8.5pt]", "font-medium", "text-brand"],
        host: "span",
        children: {
            value: { leaf: "text" },
        },
        why: "every phase's timing column holds to the same fixed width regardless of how long its own label runs, so the phase titles beside it start at one shared left edge down the whole timeline.",
    },

    "quote-phase-body": {
        classes: ["min-w-0", "flex-1"],
        children: {
            title: { contract: "$content" },
            body: { contract: "$content" },
        },
        why: "the phase's title and its description grow to fill whatever width the fixed timing column and the optional tag leave behind, instead of a fixed measure that would waste space on a short phase name.",
    },

    "quote-running-title-row": {
        classes: ["mb-2", "flex", "items-baseline", "gap-2"],
        children: {
            title: { leaf: "heading" },
            badge: { contract: "$content" },
        },
        why: "the running-cost heading and the provider badge that qualifies it share one baseline, the same pairing pattern the feature cards use for their own title-plus-flag row.",
    },

    "quote-commitments-list": {
        classes: ["mt-8", "space-y-3"],
        children: {
            items: { contract: "$content" },
        },
        why: "each commitment is a separate promise and is read as one, so they stack with breathing room between them instead of running together as a single undifferentiated policy paragraph.",
    },

    // -- marketing landing page: additive only, see report --

    "page-measure": {
        classes: ["mx-auto", "w-full", "max-w-6xl", "px-5", "sm:px-8"],
        children: {
            content: { contract: "$content" },
        },
        why: "every band on the page reads from the same centred column, so a visitor scanning down the page never sees the left edge of the copy drift as one section hands off to the next.",
    },

    "page-band": {
        host: "section",
        classes: ["scroll-mt-20", "py-20", "sm:py-28"],
        children: {
            content: { contract: "page-measure" },
        },
        why: "each marketing section keeps the same vertical rhythm and the same scroll offset under the sticky header, so jumping to any in-page anchor lands the section's own top clear of the fixed bar.",
    },

    "page-band-tinted": {
        host: "section",
        classes: ["scroll-mt-20", "py-20", "sm:py-28", "bg-surface/30"],
        children: {
            content: { contract: "page-measure" },
        },
        why: "a handful of sections alternate onto a faint tinted ground so a long page of white bands reads as distinct chapters instead of one undifferentiated scroll.",
    },

    "section-intro": {
        classes: ["flex", "flex-col", "gap-4"],
        children: {
            eyebrow: { leaf: "text", optional: true },
            title: { leaf: "heading" },
            lead: { leaf: "text", optional: true },
        },
        why: "the marker, the title and the supporting line read as one introductory run before a section's own content starts, so they share a single uniform gap instead of each one inventing its own margin.",
    },

    "labelled-bullet-item": {
        host: "li",
        classes: ["flex", "gap-3", "text-sm", "text-ink-body"],
        children: {
            mark: { contract: "$content" },
            label: { leaf: "text" },
        },
        why: "the mark and the fact it confirms read as one line, so the mark sits beside the text rather than above it where a reader could lose which item it belongs to - the one row shape a check, a dash or a plain dot bullet all share.",
    },

    "bullet-list": {
        host: "ul",
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            items: { contract: "labelled-bullet-item", repeats: true, restingCount: 3 },
        },
        why: "a run of short marked facts - included work, excluded work, a plan's own points - is read top to bottom as one set, so the rows stack with even breathing room instead of crowding together.",
    },

    // -- header / footer chrome --

    "site-header": {
        host: "header",
        classes: ["sticky", "top-0", "z-50", "border-b", "border-line", "bg-white/80", "backdrop-blur-md"],
        children: {
            bar: { contract: "page-measure" },
        },
        why: "the primary navigation stays reachable the whole way down every page, so it pins itself above the scrolling column instead of scrolling away with the section a visitor is reading.",
    },

    "header-bar": {
        classes: ["flex", "h-16", "items-center", "justify-between", "gap-6"],
        children: {
            logo: { contract: "$content" },
            nav: { contract: "header-nav" },
            actions: { contract: "header-actions" },
        },
        why: "the mark, the primary links and the contact action sit at three fixed points of one row so a visitor's eye finds any of the three without hunting the header's middle.",
    },

    "header-nav": {
        host: "nav",
        classes: ["hidden", "items-center", "gap-7", "lg:flex"],
        children: {
            items: { contract: "$content" },
        },
        why: "the primary section links only fit one row once the viewport is wide enough to hold every label without wrapping, so they stay hidden behind the header's own responsive cutoff rather than crowding a narrow screen.",
    },

    "header-actions": {
        classes: ["flex", "items-center", "gap-4"],
        children: {
            localeSwitcher: { contract: "$content" },
            cta: { contract: "$content" },
        },
        why: "the language choice and the one contact action sit together at the header's own trailing edge because both are page-wide controls, never content of the section beneath them.",
    },

    "locale-switcher-group": {
        classes: ["hidden", "items-center", "rounded-full", "border", "border-line", "p-1", "sm:flex"],
        children: {
            options: { contract: "$content" },
        },
        why: "the locale options read as one bordered pill of equal choices rather than a loose row of links, and it only shows once the header is wide enough that a fourth control does not crowd the primary nav.",
    },

    "site-footer": {
        host: "footer",
        classes: ["w-full", "border-t", "border-line", "bg-surface-2/60", "py-14"],
        children: {
            columns: { contract: "footer-columns" },
            legal: { contract: "footer-legal" },
        },
        why: "the footer closes the page on a quieter tinted ground than the sections above it, with the registered-entity block held below the ordinary navigation columns because it answers a different question than they do.",
    },

    "footer-columns": {
        classes: ["mx-auto", "w-full", "max-w-6xl", "px-5", "sm:px-8", "grid", "gap-10", "sm:grid-cols-2", "footer-columns-grid"],
        children: {
            brand: { contract: "footer-brand-block" },
            sections: { contract: "footer-nav-column" },
            contact: { contract: "footer-contact-column" },
        },
        why: "the brand block reads widest because it carries the tagline's own prose, so the three columns split the row unevenly instead of the ordinary equal thirds a plain grid would draw.",
    },

    "footer-brand-block": {
        classes: ["max-w-xs"],
        children: {
            mark: { contract: "$content" },
            tagline: { leaf: "text" },
        },
        why: "the mark and its one-line tagline are capped to a narrow measure so the sentence wraps onto two short lines instead of stretching the full width of an otherwise empty column.",
    },

    "footer-nav-column": {
        host: "nav",
        classes: [],
        children: {
            label: { leaf: "text" },
            items: { contract: "footer-link-list" },
        },
        why: "the column's own name sits above the links it labels, and the list stays a real `nav` landmark so assistive technology reports it as a second way to reach the same in-page sections the header already offers.",
    },

    "footer-link-list": {
        host: "ul",
        classes: ["mt-4", "flex", "flex-col", "gap-3"],
        children: {
            items: { contract: "$content" },
        },
        why: "the in-page section links read as one short column under their own label, spaced evenly rather than run together as a single dense paragraph of links.",
    },

    "footer-contact-column": {
        classes: [],
        children: {
            label: { leaf: "text" },
            items: { contract: "footer-contact-list" },
        },
        why: "the reachable-by facts sit under their own label the same way the section links do beside them, so the two columns read as one consistent labelled-list pattern rather than two different conventions.",
    },

    "footer-contact-list": {
        host: "ul",
        classes: ["mt-4", "flex", "flex-col", "gap-3"],
        children: {
            email: { contract: "$content" },
            domain: { contract: "$content" },
        },
        why: "the email address and the bare domain are two different ways to reach or verify the same studio, so they stack as two short facts instead of one line trying to carry both.",
    },

    "footer-legal": {
        classes: ["mx-auto", "w-full", "max-w-6xl", "px-5", "sm:px-8", "mt-12", "border-t", "border-line", "pt-6"],
        children: {
            label: { leaf: "text" },
            grid: { contract: "footer-legal-grid-entry" },
            copyright: { leaf: "text" },
        },
        why: "the registered-entity block answers a compliance question, not a navigation one, so a rule sets it apart from the columns above before its own facts and the closing copyright line begin.",
    },

    "footer-legal-grid-entry": {
        classes: ["mt-3", "grid", "gap-2", "sm:grid-cols-2", "footer-legal-grid", "sm:gap-x-10"],
        children: {
            name: { contract: "$content" },
            tax: { contract: "$content" },
            address: { contract: "footer-legal-address" },
        },
        why: "the registered name reads first, the tax id sits beside it once there is room for two columns, and the address gets more of that row's width because a street address is always the longest of the three facts.",
    },

    "footer-legal-address": {
        classes: ["sm:col-span-2"],
        children: {
            content: { contract: "$content" },
        },
        why: "the address is the one fact of the three too long to share a column with a neighbour, so it drops onto its own full-width row under the name and the tax id once the grid has two columns to span.",
    },

    // -- hero --

    "hero-section": {
        host: "section",
        classes: ["relative", "overflow-hidden"],
        children: {
            content: { contract: "hero-measure" },
        },
        why: "the hero's own background glow is pinned to this band and must never bleed past it, so the section clips its overflow instead of letting the decoration spill into the section beneath it.",
    },

    "hero-measure": {
        classes: ["relative", "mx-auto", "w-full", "max-w-6xl", "px-5", "sm:px-8", "grid", "items-center", "gap-12", "py-16", "sm:py-24", "hero-visual-grid", "lg:gap-10"],
        children: {
            message: { contract: "$content" },
            visual: { contract: "$content" },
        },
        why: "the message column keeps a slight lead over the product visual beside it once the viewport is wide enough for both, and stacks message-first on a narrow screen because the promise has to land before the picture that illustrates it.",
    },

    "hero-cta-row": {
        classes: ["mt-4", "flex", "flex-col", "gap-3", "sm:flex-row", "sm:items-end"],
        children: {
            primary: { leaf: "action-link" },
        },
        why: "the secondary call to action sits under the lead prompt with its own breathing room, ready to become a horizontal row once a second control joins it rather than the two ever competing for one line.",
    },

    // -- decorative backdrops --

    "sky-backdrop": {
        classes: ["pointer-events-none", "fixed", "inset-0", "-z-10", "overflow-hidden"],
        children: {
            layers: { contract: "$content" },
        },
        why: "the backdrop sits fixed behind every scrolling section and must never intercept a click meant for the content above it, so it is pinned out of the stacking order and out of the pointer's reach in one node.",
    },

    "sky-wash-layer": {
        classes: ["absolute", "inset-0", "tedo-sky"],
        children: {},
        why: "the soft blue wash bleeds from the page's own top edge, so it fills the whole backdrop box exactly rather than being sized or positioned by anything a caller could get wrong.",
    },

    "sky-dots-layer": {
        classes: ["absolute", "inset-0", "tedo-dots"],
        children: {},
        why: "the dotted texture sits over the wash rather than beside it, so the two layers composite into one backdrop instead of a caller having to stack two differently-sized boxes by hand.",
    },

    // -- sticky mobile CTA --

    "sticky-cta-bar-shown": {
        classes: ["fixed", "inset-x-0", "bottom-0", "z-40", "border-t", "border-line", "bg-white/95", "backdrop-blur", "transition-transform", "duration-300", "md:hidden", "translate-y-0", "sticky-cta-safe-pad"],
        children: {
            actions: { contract: "sticky-cta-actions" },
        },
        why: "the bar has already scrolled into view, so it sits flush against the bottom edge instead of translated away below it - the twin of `sticky-cta-bar-hidden`, which is the same bar before that scroll threshold.",
    },

    "sticky-cta-bar-hidden": {
        classes: ["fixed", "inset-x-0", "bottom-0", "z-40", "border-t", "border-line", "bg-white/95", "backdrop-blur", "transition-transform", "duration-300", "md:hidden", "translate-y-full", "sticky-cta-safe-pad"],
        children: {
            actions: { contract: "sticky-cta-actions" },
        },
        why: "while the hero's own calls to action are still on screen the bar would only cover content to repeat them, so it sits translated fully below the viewport's own bottom edge until that threshold passes.",
    },

    "sticky-cta-actions": {
        classes: ["flex", "items-center", "gap-2", "px-4", "pt-2"],
        children: {
            ask: { contract: "sticky-cta-action-slot" },
            book: { contract: "sticky-cta-action-slot" },
        },
        why: "the ask-a-question and book-a-call actions are the two equally-weighted paths off the bar, so they split its width evenly rather than one reading as the default and the other a fallback.",
    },

    "sticky-cta-action-slot": {
        classes: ["flex-1"],
        children: {
            content: { contract: "$content" },
        },
        why: "each action grows to share exactly half the bar's own width, which a class on the control itself cannot do once the row also holds its sibling.",
    },

    // -- aftercare --

    "stat-card-grid": {
        classes: ["mt-10", "grid", "gap-4", "sm:grid-cols-2", "lg:grid-cols-4"],
        children: {
            items: { contract: "stat-card", repeats: true, restingCount: 4 },
        },
        why: "the four aftercare facts are peers of each other, so they fill an even grid instead of one reading as more important by sitting first in a single column.",
    },

    "stat-card": {
        classes: ["flex", "flex-col", "rounded-3xl", "border", "border-line", "bg-white", "p-6"],
        children: {
            value: { leaf: "text" },
            title: { leaf: "heading" },
            body: { leaf: "text" },
        },
        why: "the checkable number leads the card because it is the fact that answers the objection, with its own short title and the explaining line stacked under it in the order a reader needs them.",
    },

    // -- ai-first --

    "insight-card-grid": {
        classes: ["mt-12", "grid", "gap-4", "md:grid-cols-2"],
        children: {
            items: { contract: "insight-card", repeats: true, restingCount: 4 },
        },
        why: "the AI-first practices are an unranked set, so they fill an even two-up grid instead of a single column implying the first one matters more than the rest.",
    },

    "insight-card": {
        classes: ["flex", "flex-col", "gap-3", "rounded-3xl", "border", "border-line", "bg-white", "p-6"],
        children: {
            index: { leaf: "text" },
            title: { leaf: "heading" },
            body: { leaf: "text" },
        },
        why: "the running number reads first as a light anchor for the eye, then the practice's own name and the explaining line follow in the order a reader scans a card.",
    },

    // -- cases --

    "case-card-grid": {
        classes: ["mt-12", "grid", "gap-4", "md:grid-cols-3"],
        children: {
            items: { contract: "case-card", repeats: true, restingCount: 3 },
        },
        why: "the case studies are an unranked set of proof points, so they fill an even three-up grid instead of a single column that would push the third case below the fold on an ordinary screen.",
    },

    "case-card": {
        classes: ["flex", "flex-col", "rounded-3xl", "border", "border-line", "bg-white", "p-6"],
        children: {
            header: { contract: "case-card-header" },
            footer: { contract: "case-card-footer" },
        },
        why: "the case's own story and the metric that closes it are two different reading beats, so the metric is held to the card's bottom edge by the same `mt-auto` rule regardless of how long the story above it runs.",
    },

    "case-card-header": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            meta: { contract: "case-card-meta-row" },
            title: { leaf: "heading" },
            body: { leaf: "text" },
        },
        why: "the sector and the anonymity badge read first as the case's own context, before the title and the story that follow explain what actually happened.",
    },

    "case-card-meta-row": {
        classes: ["flex", "items-center", "justify-between", "gap-3"],
        children: {
            sector: { leaf: "text" },
            badge: { leaf: "chip" },
        },
        why: "the sector label and the badge share one baseline-centred row pinned to opposite edges, so a reader takes in both facts in one glance before reading the case's own title.",
    },

    "case-card-footer": {
        classes: ["mt-auto", "flex", "flex-col", "gap-3"],
        children: {
            divider: { leaf: "separator" },
            metric: { leaf: "text" },
            metricLabel: { leaf: "text" },
        },
        why: "a rule separates the closing metric from the story above it because the metric is the one number worth a visual pause, and it sits with its own label stacked directly under it.",
    },

    // -- contact --

    "contact-layout": {
        classes: ["grid", "gap-12", "lg:gap-16", "contact-split-grid"],
        children: {
            info: { contract: "contact-info-column" },
            form: { contract: "$content" },
        },
        why: "the copy column reads narrower than the form beside it once there is room for both, so a visitor's eye lands on the form - the one thing this section actually wants pressed - rather than splitting attention evenly.",
    },

    "contact-info-column": {
        classes: ["flex", "flex-col", "gap-6"],
        children: {
            intro: { contract: "section-intro" },
            booking: { contract: "contact-booking-block" },
        },
        why: "the section's own introduction and the alternate way to book a call are two different asks, so a rule and a gap separate them instead of the booking links reading as one more sentence of the intro.",
    },

    "contact-booking-block": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            divider: { leaf: "separator" },
            label: { leaf: "text" },
            links: { contract: "contact-booking-links" },
        },
        why: "the calendar link and the direct email are two equal alternates to the form above them, so a rule sets off the whole block before its own short label and the two links.",
    },

    "contact-booking-links": {
        classes: ["flex", "flex-wrap", "gap-3"],
        children: {
            items: { leaf: "action-link", repeats: true, restingCount: 2 },
        },
        why: "the calendar and the email are read as one interchangeable pair rather than a ranked list, so they wrap onto their own line together instead of one implying it is the preferred path.",
    },

    "contact-form-shell": {
        // Bare `<form>` draws this - see the note on `prompt-composer-body` for why the ground
        // lives on this key's Tree node rather than on the semantic element itself.
        classes: ["flex", "flex-col", "gap-4", "rounded-3xl", "border", "border-line", "bg-white", "p-6", "sm:p-7"],
        children: {
            contactPair: { contract: "two-col-row" },
            company: { contract: "field-row" },
            service: { contract: "field-row" },
            message: { contract: "field-row" },
            submit: { leaf: "action-button" },
            status: { leaf: "text", optional: true },
        },
        why: "name and email are asked together as the two ways to reach back out, then company, the chosen service and the free-text message each get their own full-width row because none of them pairs naturally with a neighbour, and the submit control closes the run with its live status announced right beneath it.",
    },

    // -- design --

    "design-layout": {
        classes: ["grid", "gap-12", "lg:grid-cols-2", "lg:gap-16"],
        children: {
            intro: { contract: "section-intro" },
            steps: { contract: "design-step-list" },
        },
        why: "the introduction and the numbered step list are two equally-weighted halves of the same explanation, so they sit side by side once the viewport is wide enough instead of the steps reading as a footnote under the copy.",
    },

    "design-step-list": {
        host: "ol",
        classes: ["flex", "flex-col"],
        children: {
            items: { contract: "design-step-item", repeats: true, restingCount: 4 },
        },
        why: "the steps happen in a fixed order, so the list stays a real ordered list rather than a styled stack that reads no differently to assistive technology than an unordered set of facts.",
    },

    "design-step-item": {
        host: "li",
        classes: ["flex", "gap-5", "border-b", "border-line", "py-5", "first:pt-0", "last:border-0", "last:pb-0"],
        children: {
            index: { contract: "design-step-index" },
            body: { contract: "design-step-body" },
        },
        why: "a rule separates one step from the next down the whole list, and the first step drops its own top padding while the last drops its rule so the list does not open or close with an orphaned half-gap.",
    },

    "design-step-index": {
        classes: ["mt-1", "flex", "h-7", "w-7", "shrink-0", "items-center", "justify-center", "rounded-full", "bg-brand/10"],
        children: {
            value: { leaf: "text" },
        },
        why: "the step's own number sits in a fixed circular badge that never shrinks regardless of how long the step's title beside it runs, so the numbered sequence stays legible down the whole list.",
    },

    "design-step-body": {
        classes: [],
        children: {
            title: { leaf: "heading" },
            body: { leaf: "text" },
        },
        why: "the step's own name reads first with its explaining line directly under it, the same title-then-detail order every other card on this page already uses.",
    },

    // -- engagement --

    "engagement-card-grid": {
        classes: ["mt-12", "grid", "gap-5", "sm:grid-cols-2", "lg:mx-auto", "lg:max-w-4xl"],
        children: {
            items: { contract: ["engagement-card", "engagement-card-featured"], repeats: true, restingCount: 3 },
        },
        why: "the engagement models read as one compact comparison rather than a wide page-spanning row, so the grid caps its own width and centres once the viewport has more room than three narrow cards need.",
    },

    "engagement-card": {
        classes: ["flex", "flex-col", "rounded-3xl", "border", "border-line", "bg-white", "p-6"],
        children: {
            header: { contract: "engagement-card-header" },
            points: { contract: "engagement-points-block" },
            cta: { leaf: "action-link" },
        },
        why: "the model's own name and pitch read first, the included work follows as the set a visitor is actually comparing, and the call to action closes the card last because it is the one thing a reader needs everything above it to decide first.",
    },

    "engagement-card-featured": {
        classes: ["flex", "flex-col", "rounded-3xl", "border", "border-brand", "bg-brand-soft/40", "ring-2", "ring-accent/60", "p-6"],
        children: {
            header: { contract: "engagement-card-header" },
            points: { contract: "engagement-points-block" },
            cta: { leaf: "action-link" },
        },
        why: "the recommended model carries a visible accent ring precisely because a reader comparing several equal-looking options needs one to be findable at a glance - the twin of `engagement-card`, which is the same shape with nothing to promote.",
    },

    "engagement-card-header": {
        classes: ["flex", "flex-col", "gap-2"],
        children: {
            name: { leaf: "heading" },
            best: { leaf: "text" },
            body: { leaf: "text" },
        },
        why: "the model's name, the one-line fit statement and the fuller pitch are read in that order of commitment, from the shortest fact a scanning reader needs to the paragraph only an interested one reaches.",
    },

    "engagement-points-block": {
        classes: ["flex", "flex-col", "gap-3"],
        children: {
            divider: { leaf: "separator" },
            list: { contract: "bullet-list" },
        },
        why: "a rule separates the included-work list from the pitch above it because the two are read as different kinds of fact - a claim, then the checklist that backs it.",
    },

    // -- faq --

    "faq-list": {
        host: "ul",
        classes: ["mt-10", "flex", "flex-col", "gap-3", "max-w-2xl"],
        children: {
            items: { contract: "faq-item", repeats: true, restingCount: 4 },
        },
        why: "the answers only make sense read one question at a time, so the list caps itself to a narrower reading measure than the page's own full column instead of stretching every answer's line length past comfort.",
    },

    "faq-item": {
        host: "li",
        classes: ["border-b", "border-line", "py-4", "last:border-0"],
        children: {
            content: { contract: "$content" },
        },
        why: "a rule separates one question from the next down the whole list, and the last one drops it so the list does not close on an orphaned half-rule under nothing.",
    },

    // -- fit --

    "fit-comparison-grid": {
        classes: ["mt-10", "grid", "gap-5", "md:grid-cols-2"],
        children: {
            yes: { contract: "fit-column" },
            no: { contract: "fit-column" },
        },
        why: "the fit and not-a-fit lists are read as one deliberate comparison, so they sit side by side in one glance once the viewport allows rather than a visitor scrolling past the second list before ever seeing it named.",
    },

    "fit-column": {
        classes: ["rounded-3xl", "border", "border-line", "bg-white", "p-6", "sm:p-7"],
        children: {
            title: { leaf: "heading" },
            items: { contract: "bullet-list" },
        },
        why: "each column's own heading names which list it is before the marked facts underneath it, the same title-then-list order every other card on this page already uses.",
    },

    // -- metrics --

    "metrics-band": {
        host: "section",
        classes: ["border-y", "border-line", "bg-surface/40", "py-16"],
        children: {
            content: { contract: "page-measure" },
        },
        why: "the proof-point strip is bordered top and bottom on its own tinted ground so it reads as a fixed interruption between the hero and the sections that argue the case in prose, not one more ordinary band.",
    },

    "metrics-block": {
        classes: [],
        children: {
            heading: { contract: "visually-hidden" },
            grid: { contract: "metrics-grid" },
            footnote: { leaf: "text" },
        },
        why: "the strip needs a real heading for the outline a screen reader builds even though the numbers speak for themselves visually, so the title is present but hidden rather than skipped.",
    },

    "visually-hidden": {
        host: "span",
        classes: ["sr-only"],
        children: {
            content: { contract: "$content" },
        },
        why: "a heading a sighted reader never needs to see still has to exist for the outline assistive technology builds, so it is kept in the document and only clipped from the visual layout.",
    },

    "metrics-grid": {
        host: "dl",
        classes: ["grid", "gap-px", "overflow-hidden", "rounded-2xl", "border", "border-line", "bg-line", "sm:grid-cols-2", "lg:grid-cols-4"],
        children: {
            items: { contract: "metric-item", repeats: true, restingCount: 4 },
        },
        why: "the hairline gap between cells is drawn by the grid's own background showing through a one-pixel gap, the same technique the printable quote's own facts grid uses, so four unrelated proof points read as one bordered table instead of four separate cards.",
    },

    "metric-item": {
        classes: ["bg-canvas", "p-6"],
        children: {
            value: { leaf: "text" },
            label: { leaf: "text" },
            detail: { leaf: "text" },
        },
        why: "the number reads first as the fact worth stopping on, with its short label and the fuller explaining line stacked under it for the reader who wants to know what the number actually measures.",
    },

    // -- pricing --

    "pricing-tier-grid": {
        classes: ["mt-10", "grid", "gap-5", "md:grid-cols-2"],
        children: {
            items: { contract: ["pricing-tier-card", "pricing-tier-card-featured"], repeats: true, restingCount: 2 },
        },
        why: "the two price tiers are read side by side as a direct comparison, so they fill an even two-up grid rather than a single column that would force a scroll between them.",
    },

    "pricing-tier-card": {
        classes: ["flex", "flex-col", "rounded-3xl", "border", "border-line", "bg-white", "p-6", "sm:p-7"],
        children: {
            name: { leaf: "heading" },
            price: { leaf: "text" },
            time: { leaf: "text" },
            body: { leaf: "text" },
            points: { contract: "bullet-list" },
        },
        why: "the tier's name, its price range and the delivery time read first as the three facts a budget-filtering visitor scans for, before the fuller pitch and the point list a still-interested reader continues into.",
    },

    "pricing-tier-card-featured": {
        classes: ["flex", "flex-col", "rounded-3xl", "border", "border-brand", "bg-brand-soft/40", "card-elevated-shadow", "p-6", "sm:p-7"],
        children: {
            name: { leaf: "heading" },
            price: { leaf: "text" },
            time: { leaf: "text" },
            body: { leaf: "text" },
            points: { contract: "bullet-list" },
        },
        why: "the recommended tier is lifted off the page with a tinted ground and a real shadow precisely because a budget-filtering visitor comparing two ranges needs one to read as the suggested default - the twin of `pricing-tier-card`, which is the same shape with nothing promoted.",
    },

    "pricing-coverage-panel": {
        classes: ["mt-6", "grid", "gap-5", "rounded-3xl", "border", "border-line", "bg-white", "p-6", "sm:grid-cols-2", "sm:p-7"],
        children: {
            included: { contract: "pricing-coverage-column" },
            excluded: { contract: "pricing-coverage-column" },
        },
        why: "what the number covers and what it deliberately does not are read as one deliberate pair, so they sit side by side in the same bordered panel once the viewport allows instead of the exclusions reading as a buried footnote.",
    },

    "pricing-coverage-column": {
        classes: [],
        children: {
            title: { leaf: "heading" },
            list: { contract: "bullet-list" },
        },
        why: "each column's own short label names which list it is before the marked facts underneath it, matching the title-then-list pattern every other list on this page already uses.",
    },

    "pricing-instalment-panel": {
        classes: ["mt-6", "rounded-3xl", "border-l-4", "border-accent", "bg-accent/6", "p-6", "sm:p-7"],
        children: {
            title: { leaf: "heading" },
            body: { leaf: "text" },
        },
        why: "the instalment option is a distinct offer rather than one more line of the pricing explanation, so its own accent-coloured leading rule marks it apart from the panels above it.",
    },

    // -- process --

    "process-step-grid": {
        classes: ["mt-12", "grid", "gap-px", "overflow-hidden", "rounded-2xl", "border", "border-line", "bg-line", "md:grid-cols-2", "lg:grid-cols-4"],
        children: {
            items: { contract: "process-step-card", repeats: true, restingCount: 4 },
        },
        why: "the delivery steps happen in a fixed sequence but read as one bordered table, so the hairline grid technique the metrics strip already uses keeps four ordered steps visually equal instead of one implying more weight.",
    },

    "process-step-card": {
        classes: ["flex", "flex-col", "bg-canvas", "p-6"],
        children: {
            index: { leaf: "text" },
            title: { leaf: "heading" },
            body: { contract: "process-step-body" },
            duration: { contract: "process-step-duration" },
        },
        why: "the step number, its own title and the explanation grow to fill the card while the indicative duration stays pinned to the bottom edge behind its own rule, so every card in the row closes on the same fact regardless of how long its explanation runs.",
    },

    "process-step-body": {
        classes: ["mt-2", "grow"],
        children: {
            content: { leaf: "text" },
        },
        why: "the explanation grows to fill whatever space is left above the duration line, so a short step's card does not leave the duration floating in the middle of empty space.",
    },

    "process-step-duration": {
        classes: ["mt-5", "border-t", "border-line", "pt-4"],
        children: {
            content: { leaf: "text" },
        },
        why: "a rule separates the indicative duration from the explanation above it because it is a different kind of fact - a claim, then the estimate that scopes it.",
    },

    // -- projects gallery --

    "gallery-band": {
        host: "section",
        classes: ["py-16", "sm:py-20"],
        children: {
            content: { contract: "page-measure" },
        },
        why: "the dedicated gallery route opens on its own vertical rhythm rather than the shared marketing `page-band`, because it is a whole page's own hero, not one more band on the landing page above it.",
    },

    "gallery-filter-row": {
        classes: ["mt-8", "flex", "flex-wrap", "gap-2"],
        children: {
            items: { leaf: "filter-chip", repeats: true, restingCount: 3 },
        },
        why: "the category filters are mutually exclusive choices over the one grid below them, so they wrap as a single run of equal pills rather than a ranked list implying one category is the default.",
    },

    "project-card-grid": {
        classes: ["mt-10", "grid", "gap-6", "sm:grid-cols-2"],
        children: {
            items: { contract: "project-card", repeats: true, restingCount: 2 },
        },
        why: "the filtered projects are an unranked set, so they fill an even two-up grid instead of a single column that would push later projects far below the fold.",
    },

    "project-card": {
        classes: ["flex", "flex-col", "overflow-hidden", "rounded-3xl", "border", "border-line", "bg-white", "card-elevated-shadow"],
        children: {
            media: { contract: "project-card-media" },
            body: { contract: "project-card-body" },
        },
        why: "the screenshot or placeholder reads as its own clipped band above the card's own copy, so a wide or tall source image never breaks the card's own rounded edge.",
    },

    "project-card-media": {
        classes: ["relative", "aspect-video", "overflow-hidden", "bg-gradient-to-br", "from-brand-soft", "to-surface-2"],
        children: {
            content: { contract: "$content" },
        },
        why: "every project keeps the same fixed aspect ratio regardless of whether it ships a real screenshot or the styled placeholder standing in for one not captured yet, so the grid's row heights never depend on which projects have art.",
    },

    "project-card-image-slot": {
        classes: ["absolute", "inset-0"],
        children: {
            content: { contract: "$content" },
        },
        why: "a real screenshot fills the whole media box exactly the way the dotted placeholder it replaces does, so swapping one for the other never has to touch the box's own sizing.",
    },

    "project-card-dots-layer": {
        classes: ["absolute", "inset-0", "opacity-40", "tedo-dots"],
        children: {},
        why: "the placeholder's dotted texture fills the whole media box behind the initial letter, at a fainter opacity than the page's own backdrop because it sits behind opaque card content rather than behind body copy.",
    },

    "project-card-initial-slot": {
        classes: ["absolute", "inset-0", "grid", "place-items-center"],
        children: {
            value: { leaf: "text" },
        },
        why: "the project's own initial centres itself in the placeholder box regardless of the box's own aspect ratio, which a static margin could not guarantee once the ratio changes.",
    },

    "project-card-badge-slot": {
        classes: ["absolute", "left-4", "top-4"],
        children: {
            badge: { leaf: "chip" },
        },
        why: "the category badge reads as a label pinned to the screenshot itself rather than a fact of the card's copy below it, the way a photo caption sits over the photo it names.",
    },

    "project-card-pending-note": {
        classes: ["absolute", "bottom-3", "right-4", "rounded", "bg-white/85", "px-2", "py-1", "text-xs", "uppercase", "tracking-wide", "text-ink-faint"],
        children: {
            content: { leaf: "text" },
        },
        why: "the pending-image note sits over the placeholder it explains rather than in the card's own copy below, so it disappears the instant a real screenshot replaces the placeholder it was pinned to.",
    },

    "project-card-body": {
        classes: ["flex", "flex-1", "flex-col", "p-6"],
        children: {
            category: { leaf: "text" },
            title: { leaf: "heading" },
            tagline: { leaf: "text" },
            body: { leaf: "text" },
            highlights: { contract: "bullet-list", optional: true },
            footer: { contract: "project-card-footer" },
        },
        why: "the category, the project's own name, its one-line tagline and the fuller story read in that scanning order, with the optional highlight list only appearing for the projects that have one to show.",
    },

    "project-card-footer": {
        classes: ["mt-auto", "pt-6"],
        children: {
            row: { contract: "project-card-footer-row" },
        },
        why: "the closing metric row is held to the card's own bottom edge regardless of how long the story above it runs, the same `mt-auto` pattern the case-study cards already use.",
    },

    "project-card-footer-row": {
        classes: ["flex", "items-end", "justify-between", "gap-4", "border-t", "border-line", "pt-4"],
        children: {
            metric: { contract: "project-card-metric" },
            stack: { contract: "project-card-stack", optional: true },
        },
        why: "a rule separates the closing metric from the story above it, and the metric sits opposite the tech stack it shares that row with because the two are read as two independent closing facts, not one continuing the other.",
    },

    "project-card-metric": {
        classes: [],
        children: {
            value: { leaf: "text" },
            label: { leaf: "text" },
        },
        why: "the metric's own number reads first with its label stacked directly under it, the same number-then-label order the case-study cards already use for their own closing metric.",
    },

    "project-card-stack": {
        classes: ["max-w-stack-col", "text-right"],
        children: {
            label: { leaf: "text" },
            chips: { contract: "project-card-stack-row" },
        },
        why: "the tech-stack column stays capped so a long list of chips never crowds out the metric beside it, and it reads right-aligned because it is a secondary fact trailing the metric rather than leading the row.",
    },

    "project-card-stack-row": {
        classes: ["flex", "flex-wrap", "justify-end", "gap-2"],
        children: {
            items: { leaf: "chip", repeats: true, restingCount: 3 },
        },
        why: "the stack items are an unordered set of tools, so they wrap right-aligned as a run of equal chips rather than a ranked list implying one technology mattered more than the rest.",
    },

    "gallery-cta-panel": {
        classes: ["mt-14", "rounded-3xl", "border", "border-line", "bg-brand-soft/50", "px-6", "py-10", "text-center", "sm:px-10"],
        children: {
            title: { leaf: "heading" },
            action: { contract: "gallery-cta-row" },
        },
        why: "the gallery closes on one more invitation to talk, set apart on its own tinted panel so it reads as the page's own closing beat rather than one more project card in the grid above it.",
    },

    "gallery-cta-row": {
        classes: ["mt-6", "flex", "justify-center"],
        children: {
            cta: { contract: "$content" },
        },
        why: "the single closing action centres itself under the panel's own title because there is no second control beside it competing for a left or right edge.",
    },

    // -- services --

    "service-card-grid": {
        classes: ["mt-12", "grid", "gap-4", "md:grid-cols-2"],
        children: {
            items: { contract: "service-card", repeats: true, restingCount: 4 },
        },
        why: "the service offers are an unranked set, so they fill an even two-up grid instead of a single column implying the first one is the recommended starting point.",
    },

    "service-card": {
        classes: ["flex", "flex-col", "rounded-3xl", "border", "border-line", "bg-white", "p-6"],
        children: {
            title: { leaf: "heading" },
            body: { leaf: "text" },
            points: { contract: "service-points-block" },
        },
        why: "the offer's own name and pitch read first, with the concrete points that back the pitch held below a rule because they answer a different question - not what the offer is, but what it actually includes.",
    },

    "service-points-block": {
        classes: ["mt-5", "flex", "flex-col", "gap-3"],
        children: {
            divider: { leaf: "separator" },
            list: { contract: "bullet-list" },
        },
        why: "a rule separates the concrete point list from the pitch above it, the same claim-then-checklist pattern the engagement cards already use for their own included-work list.",
    },

    // -- stack --

    "stack-chip-list": {
        host: "ul",
        classes: ["mt-10", "flex", "flex-wrap", "gap-2"],
        children: {
            items: { contract: "stack-chip-item", repeats: true, restingCount: 6 },
        },
        why: "the technology names are an unordered set, so they wrap as a run of equal chips rather than a ranked list implying one tool matters more than the others.",
    },

    "stack-chip-item": {
        host: "li",
        classes: [],
        children: {
            chip: { leaf: "chip" },
        },
        why: "each technology stays a real list item under the row's own `ul`, so assistive technology reports the stack as one list of tools rather than a run of unrelated inline pills.",
    },
})

/** Every key in the registry. A key not in this union is a compile error at the call site. */
export type ContractKey = keyof typeof CONTRACTS

/**
 * Read one entry, widened to the shared shape.
 *
 * @param name - The registry key to read.
 */
export const contractSpec = (name: ContractKey): ContractSpec => CONTRACTS[name]

/** Resolve one contract into the props its branch places on the real layout node. */
export const contractNodeProps = (name: ContractKey) => {
    const spec = contractSpec(name)
    return {
        "data-tier": "branch",
        "data-node": name,
        "data-why": spec.why,
        className: spec.classes.join(" "),
    }
}

/** Every registry key, in declaration order, so gates and tests can walk the vocabulary. */
export const CONTRACT_KEYS: ReadonlyArray<ContractKey> = Object.keys(CONTRACTS) as Array<ContractKey>
