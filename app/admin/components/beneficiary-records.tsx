"use client";

import { useState, useMemo } from "react";
import { Beneficiary } from "@/types/beneficiary";

type BeneficiaryRecordsProps = {
  data: Beneficiary[];
  onEdit?: (beneficiary: Beneficiary) => void;
  onDelete: (beneficiary: Beneficiary) => void;
};

export default function BeneficiaryRecords({ 
  data, 
  onEdit, 
  onDelete 
}: BeneficiaryRecordsProps) {
  // 1. Setup states for filtering and searching
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 2. Extract unique categories dynamically from the data for the dropdown options
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    data.forEach((b) => {
      if (b.assistance_categories?.category_name) {
        categories.add(b.assistance_categories.category_name);
      }
    });
    return Array.from(categories);
  }, [data]);

// 3. Filter and search the data efficiently in memory
  const filteredData = useMemo(() => {
    return data.filter((b) => {
      // Safely convert ID to string, default to empty string if missing
      const beneficiaryId = b.id !== undefined && b.id !== null ? String(b.id) : "";

      const matchesSearch =
        b.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiaryId.includes(searchQuery); // IDs don't have casing, plain .includes works great

      const itemCategory = b.assistance_categories?.category_name || "Unassigned";
      const matchesCategory =
        selectedCategory === "all" || itemCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Beneficiary Records
          </h2>
          <p className="text-sm text-slate-600">
            View, search, and manage beneficiary information.
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTER CONTROLS */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name, address, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Dropdown Filter */}
        <div className="sm:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/></svg>")`, backgroundPosition: 'right 12px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat', paddingRight: '36px' }}
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            <option value="Unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* TABLE SECTION */}
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
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {/* Swapped `data.length` for `filteredData.length` */}
            {filteredData.length > 0 ? (
              filteredData.map((b) => (
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
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onEdit?.(b)}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete?.(b)}
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
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  {data.length === 0 
                    ? "No beneficiary records found." 
                    : "No records match your search criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}