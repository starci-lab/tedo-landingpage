import { Tree } from "@/components/branches/Tree"
import { defineGrammarComponent, defineGrammarLeaf } from "@/components/grammar/props"
import type { PlaceholderData } from "@/components/leaves/Placeholder"
import { Placeholder } from "@/components/leaves/Placeholder"

/** One placeholder bar, closed over its own size so the slot only carries a leaf identity. */
const bar = (data: PlaceholderData) => defineGrammarLeaf("placeholder", {}, () => <Placeholder props={data} />)

/** Renders the consultation page loading skeleton. */
const ConsultationLoading = () => {
    return (
        <Tree
            grammar="loading-panel"
            render={defineGrammarComponent("loading-panel", {
                bars: [
                    bar({ height: "sm", width: "wide", tone: "brand" }),
                    bar({ height: "xs", width: "full", tone: "neutral" }),
                    bar({ height: "xl", width: "threeQuarters", tone: "brand" }),
                    bar({ height: "lg", width: "twoThirds", tone: "neutral", align: "end" }),
                ],
            })}
        />
    )
}

export default ConsultationLoading
