import React from "react"

const URL_PARTS = /(https?:\/\/[^\s]+)/giu

type UserMessageContentProps = { readonly content: string }

/** Linkifies customer-provided HTTP(S) URLs without interpreting the rest as HTML. */
export const UserMessageContent = ({ content }: UserMessageContentProps) => {
    return (
        <p className="whitespace-pre-wrap">
            {content.split(URL_PARTS).map((part, index) => part.match(/^https?:\/\//iu)
                ? <a key={`${part}-${index}`} href={part} target="_blank" rel="noopener noreferrer" className="underline decoration-white/50 underline-offset-3 hover:decoration-white">{part}</a>
                : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>)}
        </p>
    )
}
