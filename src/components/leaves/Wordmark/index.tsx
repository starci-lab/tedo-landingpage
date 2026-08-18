type WordmarkProps = { readonly onDark?: boolean }

/**
 * Renders the temporary text-only Tedo mark until the final logo asset replaces it.
 */
export const Wordmark = ({ onDark = false }: WordmarkProps) => {
    const tone = onDark ? "text-white" : "text-brand-deep"
    return (
        <span className={`font-display text-2xl font-extrabold tracking-[-0.03em] ${tone}`} aria-hidden>
            <span className="text-brand">TE</span>
            <span className="text-green">D</span>
            <span className="relative">
                O
                <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-1 top-1/2 h-[1.35em] -translate-y-1/2 -rotate-[18deg] rounded-[50%] border-[2px] border-accent/80"
                />
            </span>
        </span>
    )
}
