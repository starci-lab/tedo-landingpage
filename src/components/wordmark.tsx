/**
 * TEXT-ONLY placeholder for the TEDO logo. It borrows the real mark's colour
 * story (blue letters, green "D", an orange Saturn ring on the "O") so the page
 * reads on-brand today — but it is a stand-in. When the real logo asset lands,
 * replace this whole component with the <Image>/<svg>; nothing else references
 * the letter styling.
 */
export function Wordmark({ onDark = false }: { onDark?: boolean }) {
    const base = onDark ? "text-white" : "text-brand-deep"
    return (
        <span
            className={`font-display text-2xl font-extrabold tracking-[-0.03em] ${base}`}
            aria-hidden
        >
            <span className="text-brand">TE</span>
            <span className="text-green">D</span>
            <span className="relative">
                O
                {/* orange ring nod to the logo's Saturn swoosh */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-1 top-1/2 h-[1.35em] -translate-y-1/2 -rotate-[18deg] rounded-[50%] border-[2px] border-accent/80"
                />
            </span>
        </span>
    )
}
