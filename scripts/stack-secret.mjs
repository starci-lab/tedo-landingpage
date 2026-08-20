#!/usr/bin/env node
/** StarCI-compatible SOPS/age secret management for TEDO. Node builtins only. */
import { randomBytes } from "node:crypto"
import { execFileSync, spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, join, relative, resolve, sep } from "node:path"
import { createInterface } from "node:readline"
import { fileURLToPath } from "node:url"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const STACKS = join(ROOT, ".stacks")
const IDENTITY = join(homedir(), ".starci", "master.identity")
const isWindows = process.platform === "win32"

function fail(message) {
  console.error(`\ntedo-secrets: ${message}\n`)
  process.exit(1)
}

function executable(name) {
  const extensions = isWindows ? (process.env.PATHEXT || ".EXE;.CMD;.BAT").split(";") : [""]
  const dirs = (process.env.PATH || "").split(isWindows ? ";" : ":").filter(Boolean)
  if (isWindows && process.env.LOCALAPPDATA) dirs.push(join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links"))
  for (const dir of dirs) for (const extension of extensions) {
    const candidate = join(dir, `${name}${extension}`)
    if (existsSync(candidate)) return candidate
  }
  return null
}

function prerequisites() {
  const sops = executable("sops")
  if (!sops) fail("sops is missing (Windows: winget install Mozilla.SOPS)")
  if (!existsSync(IDENTITY)) fail(`shared age identity is missing: ${IDENTITY}`)
  return sops
}

function formatFor(path) {
  if (path.endsWith(".env")) return "dotenv"
  if (path.endsWith(".json")) return "json"
  if (/\.ya?ml$/.test(path)) return "yaml"
  return "binary"
}

function resolveTarget(input) {
  const normalized = input.replace(/^\.stacks[\\/]/, "").split(/[\\/]/).join(sep)
  const plain = resolve(STACKS, normalized)
  if (plain === STACKS || !plain.startsWith(`${STACKS}${sep}`)) fail("target must be inside .stacks/")
  return plain
}

function encrypt(sops, plain, content) {
  mkdirSync(dirname(plain), { recursive: true })
  writeFileSync(plain, content)
  const format = formatFor(plain)
  const result = spawnSync(sops, [
    "--encrypt", "--input-type", format, "--output-type", format,
    "--output", `${plain}.enc`, plain,
  ], { cwd: ROOT, encoding: "utf8", env: { ...process.env, SOPS_AGE_KEY_FILE: IDENTITY } })
  rmSync(plain, { force: true })
  if (result.status !== 0) fail(`could not encrypt ${relative(ROOT, plain)}: ${(result.stderr || "").trim()}`)
}

function decrypt(sops, plain) {
  try {
    return execFileSync(sops, [
      "--decrypt", "--input-type", formatFor(plain), "--output-type", formatFor(plain), `${plain}.enc`,
    ], { cwd: ROOT, env: { ...process.env, SOPS_AGE_KEY_FILE: IDENTITY } })
  } catch {
    fail(`could not decrypt ${relative(ROOT, plain)}. Check ${IDENTITY}`)
  }
}

function token(bytes = 32) {
  return randomBytes(bytes).toString("base64url")
}

function writeIfMissing(sops, plain, value) {
  if (existsSync(`${plain}.enc`)) return false
  encrypt(sops, plain, Buffer.from(`${value}\n`, "utf8"))
  return true
}

function commandGen(stack) {
  if (stack !== "vps") fail("TEDO currently supports only: npm run secret:gen -- vps")
  const sops = prerequisites()
  const files = join(STACKS, stack, "runtime", "files")
  mkdirSync(files, { recursive: true })
  const userPath = join(files, "postgres-user.txt")
  const passwordPath = join(files, "postgres-password.key")
  const user = existsSync(`${userPath}.enc`) ? decrypt(sops, userPath).toString("utf8").trim() : "tedo"
  const password = existsSync(`${passwordPath}.enc`) ? decrypt(sops, passwordPath).toString("utf8").trim() : token()
  const created = []
  if (writeIfMissing(sops, userPath, user)) created.push("postgres-user.txt")
  if (writeIfMissing(sops, passwordPath, password)) created.push("postgres-password.key")
  const entries = [
    ["database-url.txt", `postgresql://${user}:${password}@postgres:5432/tedo`],
    ["qdrant-api-key.key", token()],
    ["knowledge-admin-token.key", token()],
    ["credential-encryption-key.key", token(48)],
    ["zalo-app-id.txt", ""],
    ["zalo-app-secret.key", ""],
    ["zalo-oa-secret-key.key", ""],
    ["zalo-oa-access-token.key", ""],
    ["zalo-oa-refresh-token.key", ""],
  ]
  for (const [name, value] of entries) if (writeIfMissing(sops, join(files, name), value)) created.push(name)
  console.log(created.length ? `Created ${created.length} encrypted VPS secret(s).` : "All generated VPS secrets already exist.")
  console.log("OpenRouter is never generated; set it with deploy:vps:init or secret:set.")
}

function readHidden(prompt) {
  return new Promise((done) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    const original = rl._writeToOutput.bind(rl)
    let muted = false
    rl._writeToOutput = (value) => { if (!muted || value.includes(prompt)) original(muted ? prompt : value) }
    rl.question(prompt, (answer) => { rl.close(); process.stdout.write("\n"); done(answer) })
    muted = true
  })
}

async function commandSet(target, fromFile) {
  if (!target) fail("usage: npm run secret:set -- vps/runtime/files/name.key [--from-file path]")
  const sops = prerequisites()
  const plain = resolveTarget(target.replace(/\.enc$/, ""))
  let content
  if (fromFile) content = readFileSync(resolve(fromFile))
  else content = Buffer.from(await readHidden(`Value for ${relative(ROOT, plain)} (hidden): `), "utf8")
  if (content.length === 0) fail("empty value; nothing changed")
  const format = formatFor(plain)
  if (format === "binary") content = Buffer.from(content.toString("utf8").replace(/\r?\n+$/, "") + "\n")
  else content = Buffer.from(content.toString("utf8").replace(/\r\n/g, "\n").replace(/\n*$/, "\n"))
  encrypt(sops, plain, content)
  console.log(`Encrypted ${relative(ROOT, plain)}.enc; plaintext removed.`)
}

function commandList() {
  const rows = []
  const walk = (dir) => {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith(".enc")) rows.push(relative(STACKS, full).split(sep).join("/"))
    }
  }
  walk(STACKS)
  console.log(rows.sort().join("\n") || "No encrypted secrets.")
}

const [command, ...args] = process.argv.slice(2)
const fromIndex = args.indexOf("--from-file")
const fromFile = fromIndex >= 0 ? args[fromIndex + 1] : null
const positional = args.filter((value, index) => !value.startsWith("--") && (fromIndex < 0 || index !== fromIndex + 1))
if (command === "gen") commandGen(positional[0])
else if (command === "set") await commandSet(positional[0], fromFile)
else if (command === "list") commandList()
else console.log("Commands: gen vps | set <path> [--from-file <path>] | list")
