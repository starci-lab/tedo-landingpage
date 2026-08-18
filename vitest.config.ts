import path from "node:path"
import { defineConfig } from "vitest/config"

/**
 * Vitest has no build step of its own to read `tsconfig.json`'s `paths`, so `@/*` resolved
 * nowhere until now - every existing `.spec.tsx` happened to import only by relative path.
 * This mirrors the same `@/*` → `src/*` mapping `tsconfig.json` already declares, so a spec
 * that reaches into the component tree (as `assistant-markdown.spec.tsx` now does through
 * `AssistantMarkdown`'s `Tree`/leaf imports) resolves the same way the app itself does.
 */
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    /*
     * The app's own build (Next/SWC) reads `tsconfig.json`'s `jsx: "preserve"` and lowers it to the
     * automatic runtime itself; esbuild - what Vitest transforms through - has no such reading and
     * defaults to the classic runtime, which expects a `React` global no file here provides on
     * purpose. Every leaf and branch already assumes the automatic runtime; this says so explicitly
     * for the one tool that does not infer it from the Next config.
     */
    esbuild: {
        jsx: "automatic",
    },
})
