"use client"

export default function ReleaseMonitoringSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 animate-pulse">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-800 px-6 py-8 sm:px-8">
            <div className="h-3 w-28 rounded bg-slate-600" />
            <div className="mt-3 h-8 w-80 rounded bg-slate-600" />
            <div className="mt-3 h-4 w-full max-w-2xl rounded bg-slate-600" />
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="mt-3 h-8 w-20 rounded bg-slate-300" />
            </div>
          ))}
        </section>

        {/* Form + Table */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
          {/* Form Skeleton */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="h-6 w-48 rounded bg-slate-300" />
            <div className="mt-2 h-4 w-full rounded bg-slate-200" />

            <div className="mt-6 space-y-4">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index}>
                  <div className="mb-2 h-4 w-32 rounded bg-slate-200" />
                  <div className="h-11 w-full rounded-lg bg-slate-200" />
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <div className="h-10 w-32 rounded-lg bg-slate-300" />
                <div className="h-10 w-28 rounded-lg bg-slate-200" />
              </div>
            </div>
          </article>

          {/* Table Skeleton */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="h-6 w-40 rounded bg-slate-300" />
            <div className="mt-2 h-4 w-72 rounded bg-slate-200" />

            {/* Search */}
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="h-11 rounded-lg bg-slate-200" />
              <div className="h-11 w-52 rounded-lg bg-slate-200" />
            </div>

            {/* Table */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              {/* Header */}
              <div className="grid grid-cols-7 gap-4 border-b bg-slate-100 p-4">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-4 rounded bg-slate-300"
                  />
                ))}
              </div>

              {/* Rows */}
              {Array.from({ length: 6 }).map((_, row) => (
                <div
                  key={row}
                  className="grid grid-cols-7 gap-4 border-b p-4"
            
            >
                  {Array.from({ length: 7 }).map((_, col) => (
                    <div
                      key={col}
                      className="h-4 rounded bg-slate-200"
                    />
                  ))}
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}