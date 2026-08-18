import Image from "next/image"
import type { ConsultationAttachment } from "@/lib/consultation/types"

interface MessageAttachmentsProps {
    attachments?: ConsultationAttachment[]
    conversationId?: string
}

const formatBytes = (bytes: number): string => bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

/** Renders downloadable files and previewable images attached to a consultation message. */
export const MessageAttachments = ({ attachments, conversationId }: MessageAttachmentsProps) => {
    if (!attachments?.length) return null
    return (
        <div className="mb-3 grid max-w-2xl grid-cols-2 gap-2 first:mt-0 sm:grid-cols-3">
            {attachments.map((attachment) => {
                const href = attachment.previewUrl ?? (conversationId
                    ? `/api/consultations/${conversationId}/attachments/${attachment.id}` : undefined)
                if (attachment.kind === "image" && href) {
                    return <a key={attachment.id} href={href} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-xl border border-white/20 bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                        <Image src={href} alt={attachment.fileName} width={400} height={300} className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.03]" unoptimized />
                        <span className="block truncate px-2 py-1.5 text-xs">{attachment.fileName}</span>
                    </a>
                }
                return <a key={attachment.id} href={href} download={attachment.fileName} className="col-span-2 flex min-h-14 items-center gap-3 rounded-xl border border-current/20 bg-black/5 px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current sm:col-span-1">
                    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current" strokeWidth="1.8"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/></svg>
                    <span className="min-w-0"><span className="block truncate text-xs font-medium">{attachment.fileName}</span><span className="block text-[11px] opacity-70">{formatBytes(attachment.size)}</span></span>
                </a>
            })}
        </div>
    )
}
