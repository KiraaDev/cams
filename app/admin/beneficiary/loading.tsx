"use client";

export default function BeneficiaryLoading() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 animate-pulse">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        
        {/* Header Section Skeleton */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-900 px-6 py-8 sm:px-8">
            <div className="h-4 w-24 rounded bg-slate-700" />
            <div className="mt-3 h-8 w-64 rounded bg-slate-700 sm:h-9" />
            <div className="mt-3 h-4 max-w-xl rounded bg-slate-700" />
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          
          {/* Stats Skeleton */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="mt-2 h-7 w-16 rounded bg-slate-300" />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="h-4 w-36 rounded bg-slate-200" />
              <div className="mt-2 h-7 w-16 rounded bg-slate-300" />
            </div>
            {/* Added a 3rd hidden/placeholder skeleton card to perfectly match grid-cols-3 layout structure */}
            <div className="hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:block opacity-40">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="mt-2 h-7 w-12 rounded bg-slate-300" />
            </div>
          </section>

          {/* Table / Main Records Skeleton */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="h-5 w-44 rounded bg-slate-300" />
            <div className="mt-2 h-4 w-72 rounded bg-slate-200" />

            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-4 py-3"><div className="h-4 w-8 rounded bg-slate-200" /></th>
                    <th className="px-4 py-3"><div className="h-4 w-20 rounded bg-slate-200" /></th>
                    <th className="px-4 py-3"><div className="h-4 w-16 rounded bg-slate-200" /></th>
                    <th className="px-4 py-3"><div className="h-4 w-16 rounded bg-slate-200" /></th>
                    <th className="px-4 py-3"><div className="h-4 w-20 rounded bg-slate-200" /></th>
                    <th className="px-4 py-3"><div className="h-4 w-16 rounded bg-slate-200" /></th>
                    <th className="px-4 py-3"><div className="h-4 w-12 ml-auto rounded bg-slate-200" /></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {/* Generates 5 mockup rows */}
                  {[...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4"><div className="h-3 w-12 rounded bg-slate-100" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-32 rounded bg-slate-200" /></td>
                      <td className="px-4 py-4"><div className="h-3 w-48 rounded bg-slate-100" /></td>
                      <td className="px-4 py-4"><div className="h-3 w-24 rounded bg-slate-100" /></td>
                      <td className="px-4 py-4"><div className="h-5 w-20 rounded-md bg-slate-100" /></td>
                      <td className="px-4 py-4"><div className="h-3 w-20 rounded bg-slate-100" /></td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <div className="h-7 w-12 rounded-lg bg-slate-100" />
                          <div className="h-7 w-14 rounded-lg bg-slate-100" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

        </div>
      </div>
    </main>
  );
}