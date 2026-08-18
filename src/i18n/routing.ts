import { defineRouting } from "next-intl/routing"
import { createNavigation } from "next-intl/navigation"

/** Locale routing shared by middleware, links, and route helpers. */
export const routing = defineRouting({
    locales: ["vi", "en"],
    defaultLocale: "vi",
    localeDetection: false,
    localePrefix: "as-needed",
})

/** A locale accepted by the public Tedo routes. */
export type Locale = (typeof routing.locales)[number]

/** Locale-aware navigation helpers bound to the application's routing table. */
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing)
