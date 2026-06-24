"use client"

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 animate-pulse">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-800 px-6 py-8 sm:px-8">
            <div className="h-3 w-28 rounded bg-slate-600" />
            <div className="mt-4 h-8 w-64 rounded bg-slate-600" />
            <div className="mt-3 h-4 w-full max-w-2xl rounded bg-slate-600" />
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="mt-3 h-8 w-16 rounded bg-slate-300" />
            </article>
          ))}
        </section>

        {/* Add Button */}
        <div className="flex justify-end">
          <div className="h-10 w-40 rounded-lg bg-slate-300" />
        </div>

        {/* Table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-6 w-40 rounded bg-slate-300" />
            <div className="h-10 w-52 rounded bg-slate-200" />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 border-b bg-slate-100 p-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-4 rounded bg-slate-300" />
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 border-b p-4 last:border-b-0"
              >
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-4 rounded bg-slate-200"
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}