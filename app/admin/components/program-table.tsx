import React from "react";

import { Program } from "@/types/program";

interface ProgramTableProps {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (program: Program) => void;
}

const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function ProgramTable({ programs, onEdit, onDelete }: ProgramTableProps) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-100 text-left text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Program Name</th>
            <th className="px-4 py-3 font-semibold">Code</th>
            <th className="px-4 py-3 font-semibold">Details</th>
            <th className="px-4 py-3 font-semibold">Budget</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Created</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
          {programs.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">
                  {item.program_name}
                </p>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {item.program_code || "-"}
              </td>
              <td className="px-4 py-3">
                <p className="text-xs text-slate-600">
                  {item.description || "No description"}
                </p>
              </td>
              <td className="px-4 py-3">{money.format(item.budget ?? 0)}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3">
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {programs.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-slate-500">
          No program records found.
        </div>
      )}
    </div>
  );
}

export default ProgramTable;
