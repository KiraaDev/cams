"use client";

import React, { useMemo, useState } from "react";

import { Program } from "@/types/program";

interface ProgramTableProps {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (program: Program) => void;
}

type ProgramStatusFilter = "All" | "Active" | "Inactive";

const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function ProgramTable({ programs, onEdit, onDelete }: ProgramTableProps) {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProgramStatusFilter>("All");

  const filteredPrograms = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return programs.filter((item) => {
      const matchesKeyword =
        keyword.length === 0 ||
        String(item.id).includes(keyword) ||
        String(item.program_name ?? "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.program_code ?? "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.description ?? "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.budget ?? "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.created_at ?? "")
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && Boolean(item.is_active)) ||
        (statusFilter === "Inactive" && !Boolean(item.is_active));

      return matchesKeyword && matchesStatus;
    });
  }, [programs, searchText, statusFilter]);

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Program Records
        </h2>
        <p className="text-sm text-slate-600">
          {programs.length} total program records
        </p>
      </div>
      <div className="flex flex-col gap-2 border-b border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by id, name, code, description, budget"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 sm:w-80"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as ProgramStatusFilter)
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

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
          {filteredPrograms.map((item) => (
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

      {filteredPrograms.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-slate-500">
          No program records match your search/filter.
        </div>
      )}
    </div>
  );
}

export default ProgramTable;
