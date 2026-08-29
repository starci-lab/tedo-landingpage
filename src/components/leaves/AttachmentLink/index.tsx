import Image from "next/image"
import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `AttachmentLink`: one downloadable or previewable file attached to a consultation message.
 *
 * ONE ATOMIC PRIMITIVE, TWO SHAPES. An image opens a lightbox-style preview thumbnail; anything else
 * opens a plain download row. Both are one `<a>` and nothing structural nests inside it - `<span>`
 * and `<svg>` carry no landmark meaning, so this stays one primitive host exactly as
 * `no-structural-arrangement-in-leaf` requires, never a second component tree.
 *
 * THE HREF IS NOT A STARCI ROUTE. It is a same-origin attachment download endpoint the caller
 * already resolved (a preview URL or `/api/consultations/.../attachments/...`), never a page a
 * visitor navigates the site through - so `no-internal-starci-href`'s policy, written for internal
 * page-to-page navigation, does not describe this control.
 */

/** Which shape this attachment draws: a previewable image, or a plain download row. */
export type AttachmentLinkKind = "image" | "file"

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type AttachmentLinkData = {
    /** Which shape this attachment draws. */
    readonly kind: AttachmentLinkKind
    /** Where the attachment resolves to. Absent when no preview or download endpoint exists. */
    readonly href?: string
    /** The original file name, shown as the caption or the row's label. */
    readonly fileName: string
    /** The already-formatted size string, e.g. `"1.2 MB"`. Only read for `kind: "file"`. */
    readonly sizeLabel?: string
}

/** Props for {@link AttachmentLink}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type AttachmentLinkProps = LeafProps<AttachmentLinkData>

/**
 * Draw one attachment as a preview thumbnail or a download row.
 *
 * @param input - {@link AttachmentLinkProps}
 */
export const AttachmentLink = ({ props }: AttachmentLinkProps) => {
    if (!props.href) return null

    if (props.kind === "image") {
        return (
            <a
                data-tier="leaf"
                data-component="AttachmentLink"
                data-kind="image"
                href={props.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl border border-white/20 bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
                <Image
                    src={props.href}
                    alt={props.fileName}
                    width={400}
                    height={300}
                    className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.03]"
                    unoptimized
                />
                <span className="block truncate px-2 py-1 text-xs">{props.fileName}</span>
            </a>
        )
    }

    return (
        <a
            data-tier="leaf"
            data-component="AttachmentLink"
            data-kind="file"
            href={props.href}
            download={props.fileName}
            className="col-span-2 flex min-h-14 items-center gap-3 rounded-xl border border-current/20 bg-black/5 px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current sm:col-span-1"
        >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current" strokeWidth="1.8">
                <path d="M7 3h7l4 4v14H7z" />
                <path d="M14 3v5h5" />
            </svg>
            <span className="min-w-0">
                <span className="block truncate text-xs font-medium">{props.fileName}</span>
                <span className="block text-xs opacity-70">{props.sizeLabel}</span>
            </span>
        </a>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
