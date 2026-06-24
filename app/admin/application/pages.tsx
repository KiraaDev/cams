"use client";

import { FormEvent, useMemo, useState } from "react";

type ApplicationStatus = "Pending" | "Approved" | "Rejected" | "Released";

type ApplicationItem = {
  id: string;
  beneficiaryName: string;
  beneficiaryId: string;
  program: string;
  amount: number;
  status: ApplicationStatus;
  submittedAt: string;
};

type FormState = {
  beneficiaryName: string;
  beneficiaryId: string;
  program: string;
  amount: string;
  status: ApplicationStatus;
};

const STATUSES: ApplicationStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Released",
];

const SAMPLE_APPLICATIONS: ApplicationItem[] = [
  {
    id: "APP-3001",
    beneficiaryName: "Maria Santos",
    beneficiaryId: "BEN-201",
    program: "Food Subsidy",
    amount: 5000,
    status: "Pending",
    submittedAt: "2026-06-02",
  },
  {
    id: "APP-3002",
    beneficiaryName: "Rico Flores",
    beneficiaryId: "BEN-206",
    program: "Livelihood Support",
    amount: 18000,
    status: "Approved",
    submittedAt: "2026-06-04",
  },
  {
    id: "APP-3003",
    beneficiaryName: "Ana Villanueva",
    beneficiaryId: "BEN-205",
    program: "Education Grant",
    amount: 9500,
    status: "Released",
    submittedAt: "2026-06-10",
  },
  {
    id: "APP-3004",
    beneficiaryName: "Noel Garcia",
    beneficiaryId: "BEN-204",
    program: "Medical Assistance",
    amount: 11000,
    status: "Rejected",
    submittedAt: "2026-06-13",
  },
];

const initialForm: FormState = {
  beneficiaryName: "",
  beneficiaryId: "",
  program: "",
  amount: "",
  status: "Pending",
};

const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function buildApplicationId(existing: ApplicationItem[]) {
  const maxId = existing.reduce((max, item) => {
    const numeric = Number(item.id.replace("APP-", ""));
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 3000);

  return `APP-${String(maxId + 1)}`;
}

export default function Application() {
  const [applications, setApplications] =
    useState<ApplicationItem[]>(SAMPLE_APPLICATIONS);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );

  const dashboardStats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((item) => item.status === "Pending").length,
      approved: applications.filter((item) => item.status === "Approved")
        .length,
      rejected: applications.filter((item) => item.status === "Rejected")
        .length,
      released: applications.filter((item) => item.status === "Released")
        .length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return applications.filter((item) => {
      const matchesKeyword =
        keyword.length === 0 ||
        item.id.toLowerCase().includes(keyword) ||
        item.beneficiaryName.toLowerCase().includes(keyword) ||
        item.beneficiaryId.toLowerCase().includes(keyword) ||
        item.program.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [applications, searchText, statusFilter]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountNumber = Number(form.amount);
    if (!form.beneficiaryName || !form.beneficiaryId || !form.program) {
      return;
    }

    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      return;
    }

    if (editingId) {
      setApplications((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                beneficiaryName: form.beneficiaryName,
                beneficiaryId: form.beneficiaryId,
                program: form.program,
                amount: amountNumber,
                status: form.status,
              }
            : item,
        ),
      );
      resetForm();
      return;
    }

    const newItem: ApplicationItem = {
      id: buildApplicationId(applications),
      beneficiaryName: form.beneficiaryName,
      beneficiaryId: form.beneficiaryId,
      program: form.program,
      amount: amountNumber,
      status: form.status,
      submittedAt: new Date().toISOString().slice(0, 10),
    };

    setApplications((current) => [newItem, ...current]);
    resetForm();
  }

  function onEdit(item: ApplicationItem) {
    setEditingId(item.id);
    setForm({
      beneficiaryName: item.beneficiaryName,
      beneficiaryId: item.beneficiaryId,
      program: item.program,
      amount: String(item.amount),
      status: item.status,
    });
  }

  function onDelete(id: string) {
    setApplications((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  }

  function onStatusChange(id: string, newStatus: ApplicationStatus) {
    setApplications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-emerald-700 px-6 py-8 text-white sm:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
              Admin Module
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Application Management
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-200 sm:text-base">
              Create beneficiary applications, maintain records, and track
              application status from Pending through Released.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Applications</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {dashboardStats.total}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-sm text-amber-700">Pending</p>
            <p className="mt-1 text-2xl font-semibold text-amber-900">
              {dashboardStats.pending}
            </p>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
            <p className="text-sm text-indigo-700">Approved</p>
            <p className="mt-1 text-2xl font-semibold text-indigo-900">
              {dashboardStats.approved}
            </p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
            <p className="text-sm text-rose-700">Rejected</p>
            <p className="mt-1 text-2xl font-semibold text-rose-900">
              {dashboardStats.rejected}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-sm text-emerald-700">Released</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-900">
              {dashboardStats.released}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Edit Application" : "New Beneficiary Application"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Fill out beneficiary and program details to create or update an
              application.
            </p>

            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                  htmlFor="beneficiaryName"
                >
                  Beneficiary Name
                </label>
                <input
                  id="beneficiaryName"
                  type="text"
                  required
                  value={form.beneficiaryName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      beneficiaryName: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring"
                  placeholder="e.g., Maria Santos"
                />
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                  htmlFor="beneficiaryId"
                >
                  Beneficiary ID
                </label>
                <input
                  id="beneficiaryId"
                  type="text"
                  required
                  value={form.beneficiaryId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      beneficiaryId: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring"
                  placeholder="e.g., BEN-210"
                />
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                  htmlFor="program"
                >
                  Program
                </label>
                <input
                  id="program"
                  type="text"
                  required
                  value={form.program}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      program: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring"
                  placeholder="e.g., Food Subsidy"
                />
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                  htmlFor="amount"
                >
                  Requested Amount (PHP)
                </label>
                <input
                  id="amount"
                  type="number"
                  required
                  min={1}
                  value={form.amount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring"
                  placeholder="e.g., 10000"
                />
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                  htmlFor="status"
                >
                  Application Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as ApplicationStatus,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring"
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
                  {editingId ? "Update Application" : "Add Application"}
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
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Application Records
                </h2>
                <p className="text-sm text-slate-600">
                  Manage and track application lifecycle.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by app ID, beneficiary, ID, or program"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring"
              />
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as ApplicationStatus | "All",
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring"
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
                    <th className="px-4 py-3 font-semibold">Application</th>
                    <th className="px-4 py-3 font-semibold">Beneficiary</th>
                    <th className="px-4 py-3 font-semibold">Program</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Submitted</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {filteredApplications.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {item.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {item.beneficiaryName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.beneficiaryId}
                        </p>
                      </td>
                      <td className="px-4 py-3">{item.program}</td>
                      <td className="px-4 py-3">{money.format(item.amount)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.status === "Released"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "Approved"
                                ? "bg-indigo-100 text-indigo-700"
                                : item.status === "Pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{item.submittedAt}</td>
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
                                event.target.value as ApplicationStatus,
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

              {filteredApplications.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No application records match your current search or status
                  filter.
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
