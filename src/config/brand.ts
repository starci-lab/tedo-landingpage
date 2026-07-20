/**
 * Single source of truth for brand identity. Renaming the company should never
 * require touching more than this file plus the `brand.*` keys in messages/.
 */
export const brand = {
    name: "Tedo",
    domain: "tedo.dev",
    email: "hello@tedo.dev",
    calendarUrl: "https://cal.com/tedo/discovery",
} as const
