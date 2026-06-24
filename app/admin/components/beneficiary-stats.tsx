import React, { useMemo } from "react";

export default function BeneficiaryStats() {
  
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Beneficiaries</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {/* {summary.total} */}12
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-700">Assistance Categories</p>
          <p className="mt-1 text-2xl font-semibold text-blue-900">
            {/* {summary.categories}2 */}12
          </p>
        </div>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 shadow-sm">
          <p className="text-sm text-cyan-700">Latest Registration</p>
          <p className="mt-1 text-2xl font-semibold text-cyan-900">
            {/* {summary.latestRegistration} */}12
          </p>
        </div>
      </section>
    </>
  );
}
