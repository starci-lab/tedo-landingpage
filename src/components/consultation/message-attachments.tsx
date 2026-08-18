import { Tree } from "@/components/branches/Tree"
import { defineContractComponent, defineLeafComponent } from "@/components/contracts/props"
import { AttachmentLink } from "@/components/leaves/AttachmentLink"
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
        <Tree
            contract="attachment-grid"
            render={defineContractComponent("attachment-grid", {
                items: attachments.map((attachment) => {
                    const href = attachment.previewUrl ?? (conversationId
                        ? `/api/consultations/${conversationId}/attachments/${attachment.id}` : undefined)
                    return defineLeafComponent("attachment-link", {}, () => (
                        <AttachmentLink
                            props={{
                                kind: attachment.kind === "image" ? "image" : "file",
                                href,
                                fileName: attachment.fileName,
                                sizeLabel: formatBytes(attachment.size),
                            }}
                        />
                    ))
                }),
            })}
        />
    )
}
