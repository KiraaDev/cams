
"use client"

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen bg-slate-50 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-64 bg-slate-200 rounded" />
        <div className="h-4 w-96 bg-slate-200 rounded" />
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-28 bg-white rounded-xl border border-slate-200" />
        <div className="h-28 bg-white rounded-xl border border-slate-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-3 w-72 bg-slate-200 rounded" />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-5 gap-4 p-4 bg-slate-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded" />
              ))}
            </div>

            {/* Rows */}
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-4 bg-slate-200 rounded" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-3 w-64 bg-slate-200 rounded" />
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-4 w-10 bg-slate-200 rounded" />
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}