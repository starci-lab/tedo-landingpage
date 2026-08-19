import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import starciFe, {
    recommended,
    linterOptions,
    starciFeConfig,
} from "@starci/eslint-canon-fe"
import path from "node:path"
import { fileURLToPath } from "node:url"

const directory = path.dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: directory, recommendedConfig: js.configs.recommended })

const config = [
    { ignores: [".next/**", "coverage/**", "node_modules/**", "public/**", ".artifacts/**", ".claude/**", "next-env.d.ts"] },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    starciFeConfig({
        layout: "single-app",
        plugin: starciFe,
        recommended,
        linterOptions,
    }),
]

export default config
