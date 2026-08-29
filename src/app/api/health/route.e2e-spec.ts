import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { spawn, type ChildProcess } from "node:child_process"

let server: ChildProcess
const port = 3127

describe("health endpoint e2e grammar", () => {
    beforeAll(async () => {
        server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], { stdio: "ignore" })
        for (let attempt = 0; attempt < 40; attempt += 1) {
            try { if ((await fetch(`http://localhost:${port}/api/health`)).ok) return } catch { /* server is still starting */ }
            await new Promise((resolve) => setTimeout(resolve, 250))
        }
        throw new Error("Next production server did not become ready")
    })
    afterAll(() => server.kill())

    it("returns the public liveness payload", async () => {
        const response = await fetch(`http://localhost:${port}/api/health`)
        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ status: "ok", service: "tedo-landing" })
    })
})
