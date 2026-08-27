import Image from "next/image"

type WordmarkProps = { readonly onDark?: boolean }

/**
 * Renders TEDO's supplied original vector mark with its blue, green and orange artwork intact.
 */
export const Wordmark = ({ onDark = false }: WordmarkProps) => {
    return (
        <span data-on-dark={onDark ? "true" : "false"} aria-hidden>
            <Image
                src="/brand/tedo-original.svg"
                alt=""
                width={111}
                height={30}
                className="block h-7 w-auto"
            />
        </span>
    )
}
