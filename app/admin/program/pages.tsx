"use client";

import { FormEvent, useMemo, useState } from "react";

type ProgramStatus = "Active" | "Paused" | "Archived";

type ProgramItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  budget: number;
  beneficiaries: number;
  status: ProgramStatus;
  createdAt: string;
};

type ProgramForm = {
  name: string;
  category: string;
  description: string;
  budget: string;
  beneficiaries: string;
  status: ProgramStatus;
};

const STATUSES: ProgramStatus[] = ["Active", "Paused", "Archived"];


const initialForm: ProgramForm = {
  name: "",
  category: "",
  description: "",
  budget: "",
  beneficiaries: "",
  status: "Active",
};

const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function buildProgramId(items: ProgramItem[]) {
  const maxId = items.reduce((max, item) => {
    const numeric = Number(item.id.replace("PRG-", ""));
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 1000);

  return `PRG-${String(maxId + 1)}`;
}

export default function Programs() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [form, setForm] = useState<ProgramForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProgramStatus | "All">(
    "All",
  );

  const stats = useMemo(() => {
    return {
      total: programs.length,
      active: programs.filter((item) => item.status === "Active").length,
      paused: programs.filter((item) => item.status === "Paused").length,
      archived: programs.filter((item) => item.status === "Archived").length,
      budget: programs.reduce((sum, item) => sum + item.budget, 0),
    };
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return programs.filter((item) => {
      const matchesKeyword =
        keyword.length === 0 ||
        item.id.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [programs, searchText, statusFilter]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const budgetValue = Number(form.budget);
    const beneficiariesValue = Number(form.beneficiaries);

    if (!form.name || !form.category || !form.description) {
      return;
    }

    if (Number.isNaN(budgetValue) || budgetValue <= 0) {
      return;
    }

    if (Number.isNaN(beneficiariesValue) || beneficiariesValue < 0) {
      return;
    }

    if (editingId) {
      setPrograms((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name,
                category: form.category,
                description: form.description,
                budget: budgetValue,
                beneficiaries: beneficiariesValue,
                status: form.status,
              }
            : item,
        ),
      );
      resetForm();
      return;
    }

    const newProgram: ProgramItem = {
      id: buildProgramId(programs),
      name: form.name,
      category: form.category,
      description: form.description,
      budget: budgetValue,
      beneficiaries: beneficiariesValue,
      status: form.status,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setPrograms((current) => [newProgram, ...current]);
    resetForm();
  }

  function onEdit(item: ProgramItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      budget: String(item.budget),
      beneficiaries: String(item.beneficiaries),
      status: item.status,
    });
  }

  function onDelete(id: string) {
    setPrograms((current) => current.filter((item) => item.id !== id));

    if (editingId === id) {
      resetForm();
    }
  }

  function onStatusChange(id: string, status: ProgramStatus) {
    setPrograms((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-700 px-6 py-8 text-white sm:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">
              Admin Module
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Program Management
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-200 sm:text-base">
              Create assistance programs, update details, review utilization,
              and remove inactive programs in one place.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Programs</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {stats.total}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-sm text-emerald-700">Active</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-900">
              {stats.active}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-sm text-amber-700">Paused</p>
            <p className="mt-1 text-2xl font-semibold text-amber-900">
              {stats.paused}
            </p>
          </div>
          <div className="rounded-xl border border-slate-300 bg-slate-100 p-4 shadow-sm">
            <p className="text-sm text-slate-700">Archived</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {stats.archived}
            </p>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
            <p className="text-sm text-indigo-700">Total Budget</p>
            <p className="mt-1 text-xl font-semibold text-indigo-900">
              {money.format(stats.budget)}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId
                ? "Update Program Details"
                : "Create Assistance Program"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Define program details and funding allocation for beneficiaries.
            </p>

            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Program Name
                </label>
                <input
                  id="name"
                  required
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-indigo-400 transition focus:border-indigo-500 focus:ring"
                  placeholder="e.g., Senior Citizen Allowance"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>
                <input
                  id="category"
                  required
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-indigo-400 transition focus:border-indigo-500 focus:ring"
                  placeholder="e.g., Healthcare"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-indigo-400 transition focus:border-indigo-500 focus:ring"
                  placeholder="Briefly describe the program's purpose"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="budget"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Budget (PHP)
                  </label>
                  <input
                    id="budget"
                    required
                    min={1}
                    type="number"
                    value={form.budget}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        budget: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-indigo-400 transition focus:border-indigo-500 focus:ring"
                    placeholder="e.g., 300000"
                  />
                </div>
                <div>
                  <label
                    htmlFor="beneficiaries"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Target Beneficiaries
                  </label>
                  <input
                    id="beneficiaries"
                    required
                    min={0}
                    type="number"
                    value={form.beneficiaries}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        beneficiaries: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-indigo-400 transition focus:border-indigo-500 focus:ring"
                    placeholder="e.g., 150"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Program Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as ProgramStatus,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-indigo-400 transition focus:border-indigo-500 focus:ring"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  {editingId ? "Save Changes" : "Create Program"}
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
            <h2 className="text-lg font-semibold text-slate-900">
              Program Information
            </h2>
            <p className="text-sm text-slate-600">
              Search, filter, update, or remove existing programs.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by ID, name, category, or description"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-indigo-400 transition focus:border-indigo-500 focus:ring"
              />
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as ProgramStatus | "All")
                }
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-indigo-400 transition focus:border-indigo-500 focus:ring"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Program</th>
                    <th className="px-4 py-3 font-semibold">Details</th>
                    <th className="px-4 py-3 font-semibold">Budget</th>
                    <th className="px-4 py-3 font-semibold">Beneficiaries</th>
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
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">{item.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {item.category}
                        </p>
                        <p className="text-xs text-slate-600">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-4 py-3">{money.format(item.budget)}</td>
                      <td className="px-4 py-3">{item.beneficiaries}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "Paused"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{item.createdAt}</td>
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
                            onClick={() => onDelete(item.id)}
                            className="rounded-md border border-rose-300 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                          <select
                            value={item.status}
                            onChange={(event) =>
                              onStatusChange(
                                item.id,
                                event.target.value as ProgramStatus,
                              )
                            }
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPrograms.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No program record matches the current search and filter.
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
