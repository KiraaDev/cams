export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 animate-pulse">
        
        {/* Header Skeleton */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="bg-slate-200 px-6 py-8 sm:px-8">
            <div className="h-3 w-32 rounded bg-slate-300" />
            <div className="mt-4 h-6 w-64 rounded bg-slate-300" />
            <div className="mt-3 h-4 w-full max-w-2xl rounded bg-slate-300" />
          </div>
        </section>

        {/* Button Skeleton */}
        <div className="h-10 w-40 rounded-lg bg-slate-200" />

        {/* Stats Skeleton */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-24 rounded-xl bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-200" />
        </section>

        {/* Form Skeleton */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-4 h-5 w-48 rounded bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-10 rounded bg-slate-200" />
            <div className="h-10 rounded bg-slate-200" />
            <div className="h-10 rounded bg-slate-200" />
            <div className="h-10 rounded bg-slate-200" />
          </div>
          <div className="mt-4 h-10 w-32 rounded bg-slate-300" />
        </section>

        {/* Table Skeleton */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-4 h-5 w-56 rounded bg-slate-200" />

          <div className="space-y-3">
            {/* table header */}
            <div className="grid grid-cols-5 gap-3">
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
            </div>

            {/* rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-3">
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}