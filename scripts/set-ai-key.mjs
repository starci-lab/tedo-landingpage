/**
 * Set the OpenRouter key for the quote chatbot into .env.local (git-ignored).
 *
 *   node scripts/set-ai-key.mjs <OPENROUTER_KEY> [MODEL]
 *
 * Example:
 *   node scripts/set-ai-key.mjs sk-or-v1-xxxxxxxx
 *   node scripts/set-ai-key.mjs sk-or-v1-xxxxxxxx deepseek/deepseek-v4-flash
 *
 * The key is written ONLY to .env.local on this machine and never printed back.
 * Restart the dev server afterwards so Next.js reloads the env.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"

const [key, model] = process.argv.slice(2)
const ENV = ".env.local"

if (!key) {
    console.error("Thiếu key. Dùng: node scripts/set-ai-key.mjs <OPENROUTER_KEY> [MODEL]")
    process.exit(1)
}

let text = existsSync(ENV) ? readFileSync(ENV, "utf8") : ""

function upsert(name, value) {
    const line = `${name}=${value}`
    const re = new RegExp(`^${name}=.*$`, "m")
    if (re.test(text)) {
        text = text.replace(re, line)
    } else {
        text += (text && !text.endsWith("\n") ? "\n" : "") + line + "\n"
    }
}

upsert("OPENROUTER_API_KEY", key)
upsert("OPENROUTER_MODEL", model || "deepseek/deepseek-v4-flash")
if (!/^SITE_URL=/m.test(text)) upsert("SITE_URL", "http://localhost:3020")

writeFileSync(ENV, text)

const masked = key.length > 10 ? `${key.slice(0, 6)}…${key.slice(-4)}` : "•••"
console.log(`✓ Đã ghi vào ${ENV}`)
console.log(`  OPENROUTER_API_KEY = ${masked}`)
console.log(`  OPENROUTER_MODEL   = ${model || "deepseek/deepseek-v4-flash"}`)
console.log("→ Khởi động lại dev server: npm run dev")
