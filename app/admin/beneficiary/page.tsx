"use client";

import { FormEvent, useMemo, useState } from "react";

type AssistanceCategory =
  | "Food Subsidy"
  | "Medical Assistance"
  | "Education Grant"
  | "Livelihood Support"
  | "Senior Citizen Aid";

type BeneficiaryRecord = {
  beneficiaryId: string;
  fullName: string;
  address: string;
  contactNumber: string;
  assistanceCategory: AssistanceCategory;
  registeredAt: string;
};

type BeneficiaryForm = {
  beneficiaryId: string;
  fullName: string;
  address: string;
  contactNumber: string;
  assistanceCategory: AssistanceCategory;
};

const CATEGORIES: AssistanceCategory[] = [
  "Food Subsidy",
  "Medical Assistance",
  "Education Grant",
  "Livelihood Support",
  "Senior Citizen Aid",
];

const SAMPLE_BENEFICIARIES: BeneficiaryRecord[] = [
  {
    beneficiaryId: "BEN-201",
    fullName: "Maria Santos",
    address: "Purok 3, Barangay San Isidro",
    contactNumber: "09171234567",
    assistanceCategory: "Food Subsidy",
    registeredAt: "2026-04-08",
  },
  {
    beneficiaryId: "BEN-202",
    fullName: "John Dela Cruz",
    address: "Mabini Street, Barangay Mabini",
    contactNumber: "09181234567",
    assistanceCategory: "Medical Assistance",
    registeredAt: "2026-04-12",
  },
  {
    beneficiaryId: "BEN-203",
    fullName: "Liza Ramos",
    address: "Zone 1, Barangay Sto. Nino",
    contactNumber: "09221234567",
    assistanceCategory: "Education Grant",
    registeredAt: "2026-05-02",
  },
  {
    beneficiaryId: "BEN-204",
    fullName: "Rico Flores",
    address: "Rizal Avenue, Barangay San Jose",
    contactNumber: "09991234567",
    assistanceCategory: "Livelihood Support",
    registeredAt: "2026-05-18",
  },
];

const initialForm: BeneficiaryForm = {
  beneficiaryId: "",
  fullName: "",
  address: "",
  contactNumber: "",
  assistanceCategory: "Food Subsidy",
};

export default function Beneficiary() {
  const [records, setRecords] = useState<BeneficiaryRecord[]>(SAMPLE_BENEFICIARIES);
  const [form, setForm] = useState<BeneficiaryForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<AssistanceCategory | "All">("All");

  const summary = useMemo(() => {
    return {
      total: records.length,
      categories: new Set(records.map((item) => item.assistanceCategory)).size,
      latestRegistration:
        records
          .map((item) => item.registeredAt)
          .sort((a, b) => (a < b ? 1 : -1))[0] ?? "N/A",
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return records.filter((item) => {
      const matchesKeyword =
        keyword.length === 0 ||
        item.beneficiaryId.toLowerCase().includes(keyword) ||
        item.fullName.toLowerCase().includes(keyword) ||
        item.address.toLowerCase().includes(keyword) ||
        item.contactNumber.toLowerCase().includes(keyword) ||
        item.assistanceCategory.toLowerCase().includes(keyword);

      const matchesCategory =
        categoryFilter === "All" || item.assistanceCategory === categoryFilter;

      return matchesKeyword && matchesCategory;
    });
  }, [records, searchText, categoryFilter]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.beneficiaryId.trim() ||
      !form.fullName.trim() ||
      !form.address.trim() ||
      !form.contactNumber.trim()
    ) {
      return;
    }

    if (editingId) {
      setRecords((current) =>
        current.map((item) =>
          item.beneficiaryId === editingId
            ? {
                ...item,
                beneficiaryId: form.beneficiaryId.trim(),
                fullName: form.fullName.trim(),
                address: form.address.trim(),
                contactNumber: form.contactNumber.trim(),
                assistanceCategory: form.assistanceCategory,
              }
            : item,
        ),
      );
      resetForm();
      return;
    }

    const newRecord: BeneficiaryRecord = {
      beneficiaryId: form.beneficiaryId.trim(),
      fullName: form.fullName.trim(),
      address: form.address.trim(),
      contactNumber: form.contactNumber.trim(),
      assistanceCategory: form.assistanceCategory,
      registeredAt: new Date().toISOString().slice(0, 10),
    };

    setRecords((current) => [newRecord, ...current]);
    resetForm();
  }

  function onEdit(item: BeneficiaryRecord) {
    setEditingId(item.beneficiaryId);
    setForm({
      beneficiaryId: item.beneficiaryId,
      fullName: item.fullName,
      address: item.address,
      contactNumber: item.contactNumber,
      assistanceCategory: item.assistanceCategory,
    });
  }

  function onDelete(beneficiaryId: string) {
    setRecords((current) =>
      current.filter((item) => item.beneficiaryId !== beneficiaryId),
    );
    if (editingId === beneficiaryId) {
      resetForm();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-blue-700 px-6 py-8 text-white sm:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Admin Module</p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Beneficiary Management</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-200 sm:text-base">
              Register beneficiaries, keep records current, and manage assistance category
              assignments.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Beneficiaries</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.total}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <p className="text-sm text-blue-700">Assistance Categories</p>
            <p className="mt-1 text-2xl font-semibold text-blue-900">{summary.categories}</p>
          </div>
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 shadow-sm">
            <p className="text-sm text-cyan-700">Latest Registration</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-900">{summary.latestRegistration}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_1.95fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Update Beneficiary" : "Register Beneficiary"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Fill in beneficiary details to create or update records.
            </p>

            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="beneficiaryId"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Beneficiary ID
                </label>
                <input
                  id="beneficiaryId"
                  required
                  type="text"
                  value={form.beneficiaryId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      beneficiaryId: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
                  placeholder="e.g., BEN-210"
                />
              </div>

              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  id="fullName"
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
                  placeholder="e.g., Maria Santos"
                />
              </div>

              <div>
                <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Address
                </label>
                <textarea
                  id="address"
                  required
                  rows={2}
                  value={form.address}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, address: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
                  placeholder="Street, Barangay, City"
                />
              </div>

              <div>
                <label
                  htmlFor="contactNumber"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  required
                  type="tel"
                  value={form.contactNumber}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      contactNumber: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
                  placeholder="e.g., 09171234567"
                />
              </div>

              <div>
                <label
                  htmlFor="assistanceCategory"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Assistance Category
                </label>
                <select
                  id="assistanceCategory"
                  value={form.assistanceCategory}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      assistanceCategory: event.target.value as AssistanceCategory,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  {editingId ? "Update Beneficiary" : "Register Beneficiary"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Beneficiary Records</h2>
            <p className="text-sm text-slate-600">
              View, search, and manage beneficiary information.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by ID, name, address, contact, or category"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
              />
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value as AssistanceCategory | "All")
                }
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Beneficiary ID</th>
                    <th className="px-4 py-3 font-semibold">Full Name</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                    <th className="px-4 py-3 font-semibold">Contact Number</th>
                    <th className="px-4 py-3 font-semibold">Assistance Category</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {filteredRecords.map((item) => (
                    <tr key={item.beneficiaryId}>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.beneficiaryId}</td>
                      <td className="px-4 py-3">{item.fullName}</td>
                      <td className="px-4 py-3">{item.address}</td>
                      <td className="px-4 py-3">{item.contactNumber}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {item.assistanceCategory}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(item.beneficiaryId)}
                            className="rounded-md border border-rose-300 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRecords.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No beneficiary record matches your current search and filter.
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}