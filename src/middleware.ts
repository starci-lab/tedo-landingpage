import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

/** Applies locale routing to browser-facing pages while excluding framework and API paths. */
export const config = {
    matcher: "/((?!api|_next|_vercel|.*[.].*).*)",
}
