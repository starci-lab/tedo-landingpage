export default function ConsultationLoading() {
    return (
        <main className="mx-auto min-h-screen max-w-6xl animate-pulse px-5 py-12 sm:px-8" aria-busy="true">
            <div className="h-8 w-52 rounded-lg bg-brand-soft" />
            <div className="mt-4 h-5 w-full max-w-xl rounded bg-line" />
            <div className="mt-12 h-24 w-3/4 rounded-2xl bg-brand-soft" />
            <div className="ml-auto mt-4 h-20 w-2/3 rounded-2xl bg-line" />
        </main>
    )
}
