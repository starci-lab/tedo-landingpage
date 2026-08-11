import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
    // Type errors are gated by `npm run typecheck` + IDE, not by the build —
    // ForkTsChecker inside webpack blows past the 2GB heap on CI builders.
    output: "standalone",
}

export default withNextIntl(nextConfig)
