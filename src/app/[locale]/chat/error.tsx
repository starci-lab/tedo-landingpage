"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

type ConsultationErrorProps = { error: Error; reset: () => void }

/** Renders the recovery actions shown when consultation loading fails. */
const ConsultationError = ({ reset }: ConsultationErrorProps) => {
    const t = useTranslations("consultation")
    return (
        <main className="mx-auto grid min-h-screen max-w-xl place-content-center px-5 text-center">
            <h1 className="font-display text-3xl font-bold text-ink">{t("pageErrorTitle")}</h1>
            <p className="mt-3 text-ink-muted">{t("pageErrorBody")}</p>
            <div className="mt-6 flex justify-center gap-3">
                <button type="button" onClick={reset} className="min-h-11 rounded-xl bg-brand px-5 font-medium text-white">{t("retry")}</button>
                <Link href="/" className="inline-flex min-h-11 items-center rounded-xl border border-line-strong px-5 font-medium text-ink">{t("back")}</Link>
            </div>
        </main>
    )
}

export default ConsultationError
