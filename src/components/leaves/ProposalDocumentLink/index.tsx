import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `ProposalDocumentLink`: one generated document a confirmed proposal made available.
 *
 * ONE ATOMIC PRIMITIVE. The row is a single `<a>` with a filename and a download glyph; nothing
 * inside it carries landmark meaning, so it stays one primitive host - see the same note on
 * {@link ../AttachmentLink}. Its `href` is a same-origin generated-document endpoint the caller
 * already resolved, never a page a visitor navigates the site through, so `no-internal-starci-href`
 * does not describe this control either.
 */

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type ProposalDocumentLinkData = {
    /** Where the generated document downloads from. */
    readonly href: string
    /** The generated document's file name. */
    readonly fileName: string
}

/** Props for {@link ProposalDocumentLink}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type ProposalDocumentLinkProps = LeafProps<ProposalDocumentLinkData>

/**
 * Draw one link to a generated proposal document.
 *
 * @param input - {@link ProposalDocumentLinkProps}
 */
export const ProposalDocumentLink = ({ props }: ProposalDocumentLinkProps) => {
    return (
        <a
            data-tier="leaf"
            data-component="ProposalDocumentLink"
            href={props.href}
            className="flex min-h-11 items-center justify-between rounded-xl bg-white px-3 text-sm text-brand transition-colors hover:text-brand-deep"
        >
            <span>{props.fileName}</span>
            <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                <path d="M10 3v10m0 0 4-4m-4 4-4-4M4 16h12" />
            </svg>
        </a>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
