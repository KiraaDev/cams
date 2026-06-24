"use client"

import { Beneficiary } from "@/types/beneficiary";

type BeneficiaryRecordsProps = {
  data: Beneficiary[];
  onEdit?: (beneficiary: Beneficiary) => void;
  onDelete?: (id: string) => void;
};

export default function BeneficiaryRecords({ 
  data, 
  onEdit, 
  onDelete 
}: BeneficiaryRecordsProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Beneficiary Records
      </h2>

      <p className="text-sm text-slate-600">
        View, search, and manage beneficiary information.
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left font-medium text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Full Name</th>
              <th className="px-4 py-3 font-semibold">Address</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              {/* Added Actions header column alignment */}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {data.length > 0 ? (
              data.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">
                    {b.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                    {b.full_name}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-600">
                    {b.address}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {b.contact_number ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {b.assistance_categories ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {b.assistance_categories.category_name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {b.created_at
                      ? new Date(b.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                  {/* Actions Column Buttons */}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onEdit?.(b)}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                        
                        }}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* Updated colSpan to 7 to match the new Actions column */}
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  No beneficiary records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}