import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"

const root = process.cwd()
const summaryPath = path.resolve(root, "coverage/coverage-summary.json")
const patchSummaryPath = path.resolve(root, "coverage/patch-summary.json")
const writePatchSummary = (value) => {
  fs.mkdirSync(path.dirname(patchSummaryPath), { recursive: true })
  fs.writeFileSync(patchSummaryPath, JSON.stringify(value, null, 2) + "\n")
}
const base = process.env.COVERAGE_BASE_SHA ?? (process.env.COVERAGE_BASE_REF ? execFileSync("git", ["merge-base", process.env.COVERAGE_BASE_REF, "HEAD"], { encoding: "utf8" }).trim() : "")
if (!base && !process.env.COVERAGE_CHANGED_FILES) throw new Error("Set COVERAGE_BASE_SHA (or COVERAGE_BASE_REF) to measure patch coverage.")
const changed = (process.env.COVERAGE_CHANGED_FILES?.split("\n") ?? execFileSync("git", ["diff", "--name-only", `${base}...HEAD`], { encoding: "utf8" }).split("\n"))
    .map((file) => file.trim()).filter(Boolean).map((file) => path.resolve(root, file))
const production = changed.filter((file) => file.startsWith(path.resolve(root, "src") + path.sep) && /\.(ts|tsx)$/.test(file) && !/(\.spec|\.int-spec|\.e2e-spec)\.(ts|tsx)$/.test(file) && !file.endsWith(".d.ts") && !file.includes(`${path.sep}generated${path.sep}`) && !file.endsWith(`${path.sep}middleware.ts`))
if (production.length === 0) {
  const result = { notApplicable: true, reason: "no changed production files" }
  writePatchSummary(result)
  console.log(JSON.stringify(result))
  process.exit(0)
}
if (!fs.existsSync(summaryPath)) throw new Error(`Missing coverage summary: ${summaryPath}`)
const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"))
const files = production.map((file) => summary[file] ?? summary[path.relative(root, file)]).filter(Boolean)
if (files.length !== production.length) throw new Error(`Missing coverage entries for changed files: ${production.filter((file) => !summary[file] && !summary[path.relative(root, file)]).join(", ")}`)
const metric = (name) => {
  const total = files.reduce((sum, file) => sum + file[name].total, 0)
  const covered = files.reduce((sum, file) => sum + file[name].covered, 0)
  if (total === 0) throw new Error(`Changed production files expose no measurable ${name} coverage`)
  return { total, covered, pct: Math.round(covered / total * 10000) / 100 }
}
const result = { total: { statements: metric("statements"), lines: metric("lines"), functions: metric("functions"), branches: metric("branches") } }
writePatchSummary(result)
if (Object.values(result.total).some((value) => value.pct < 90)) throw new Error(`Patch coverage below 90%: ${JSON.stringify(result.total)}`)
console.log(JSON.stringify(result))
