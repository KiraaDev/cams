"use client";

import { useMemo, useState } from "react";

import SignOutButton from "@/components/auth/sign-out-button";

type ApplicationStatus = "Pending" | "Approved" | "Rejected" | "Released";

type ApplicationRecord = {
  applicationId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  program: string;
  status: ApplicationStatus;
  requestedAmount: number;
  releasedAmount: number;
  submittedAt: string;
};

const APPLICATIONS: ApplicationRecord[] = [
  {
    applicationId: "APP-1001",
    beneficiaryId: "BEN-201",
    beneficiaryName: "Maria Santos",
    program: "Food Subsidy",
    status: "Released",
    requestedAmount: 5000,
    releasedAmount: 5000,
    submittedAt: "2026-05-10",
  },
  {
    applicationId: "APP-1002",
    beneficiaryId: "BEN-202",
    beneficiaryName: "John Dela Cruz",
    program: "Medical Assistance",
    status: "Approved",
    requestedAmount: 12000,
    releasedAmount: 0,
    submittedAt: "2026-05-13",
  },
  {
    applicationId: "APP-1003",
    beneficiaryId: "BEN-203",
    beneficiaryName: "Liza Ramos",
    program: "Education Grant",
    status: "Pending",
    requestedAmount: 8000,
    releasedAmount: 0,
    submittedAt: "2026-05-19",
  },
  {
    applicationId: "APP-1004",
    beneficiaryId: "BEN-204",
    beneficiaryName: "Noel Garcia",
    program: "Food Subsidy",
    status: "Rejected",
    requestedAmount: 4000,
    releasedAmount: 0,
    submittedAt: "2026-05-20",
  },
  {
    applicationId: "APP-1005",
    beneficiaryId: "BEN-201",
    beneficiaryName: "Maria Santos",
    program: "Medical Assistance",
    status: "Released",
    requestedAmount: 15000,
    releasedAmount: 13000,
    submittedAt: "2026-06-01",
  },
  {
    applicationId: "APP-1006",
    beneficiaryId: "BEN-205",
    beneficiaryName: "Ana Villanueva",
    program: "Education Grant",
    status: "Approved",
    requestedAmount: 9500,
    releasedAmount: 0,
    submittedAt: "2026-06-05",
  },
  {
    applicationId: "APP-1007",
    beneficiaryId: "BEN-206",
    beneficiaryName: "Rico Flores",
    program: "Livelihood Support",
    status: "Released",
    requestedAmount: 18000,
    releasedAmount: 16000,
    submittedAt: "2026-06-09",
  },
];

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );
  const [programFilter, setProgramFilter] = useState<string>("All");
  const [showReport, setShowReport] = useState(false);

  const programs = useMemo(() => {
    return Array.from(
      new Set(APPLICATIONS.map((record) => record.program)),
    ).sort();
  }, []);

  const statuses: Array<ApplicationStatus | "All"> = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
    "Released",
  ];

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return APPLICATIONS.filter((record) => {
      const matchesSearch =
        keyword.length === 0 ||
        record.applicationId.toLowerCase().includes(keyword) ||
        record.beneficiaryId.toLowerCase().includes(keyword) ||
        record.beneficiaryName.toLowerCase().includes(keyword) ||
        record.program.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;
      const matchesProgram =
        programFilter === "All" || record.program === programFilter;

      return matchesSearch && matchesStatus && matchesProgram;
    });
  }, [search, statusFilter, programFilter]);

  const dashboardStats = useMemo(() => {
    const totalBeneficiaries = new Set(
      APPLICATIONS.map((record) => record.beneficiaryId),
    ).size;
    const totalPrograms = new Set(APPLICATIONS.map((record) => record.program))
      .size;
    const totalApplications = APPLICATIONS.length;
    const approvedApplications = APPLICATIONS.filter(
      (record) => record.status === "Approved" || record.status === "Released",
    ).length;
    const releasedAssistance = APPLICATIONS.reduce(
      (total, record) => total + record.releasedAmount,
      0,
    );

    return {
      totalBeneficiaries,
      totalPrograms,
      totalApplications,
      approvedApplications,
      releasedAssistance,
    };
  }, []);

  const statusSummary = useMemo(() => {
    return statuses
      .filter((status) => status !== "All")
      .map((status) => ({
        status,
        count: filteredRecords.filter((record) => record.status === status)
          .length,
      }));
  }, [filteredRecords]);

  const programUtilization = useMemo(() => {
    return programs.map((program) => {
      const items = filteredRecords.filter(
        (record) => record.program === program,
      );
      const totalRequested = items.reduce(
        (sum, record) => sum + record.requestedAmount,
        0,
      );
      const totalReleased = items.reduce(
        (sum, record) => sum + record.releasedAmount,
        0,
      );

      return {
        program,
        applications: items.length,
        totalRequested,
        totalReleased,
      };
    });
  }, [filteredRecords, programs]);

  const statCards = [
    {
      label: "Total Beneficiaries",
      value: dashboardStats.totalBeneficiaries.toLocaleString(),
      accent: "bg-cyan-100 text-cyan-800",
    },
    {
      label: "Total Programs",
      value: dashboardStats.totalPrograms.toLocaleString(),
      accent: "bg-amber-100 text-amber-800",
    },
    {
      label: "Total Applications",
      value: dashboardStats.totalApplications.toLocaleString(),
      accent: "bg-emerald-100 text-emerald-800",
    },
    {
      label: "Approved Applications",
      value: dashboardStats.approvedApplications.toLocaleString(),
      accent: "bg-indigo-100 text-indigo-800",
    },
    {
      label: "Released Assistance",
      value: currency.format(dashboardStats.releasedAssistance),
      accent: "bg-rose-100 text-rose-800",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-cyan-800 px-6 py-8 text-white sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
                  Admin Dashboard
                </p>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  CAMS Assistance Overview
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
                  Monitor applications, track disbursements, and generate
                  summary reports for beneficiaries and programs.
                </p>
              </div>
              <SignOutButton />
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((card) => (
            <article
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {card.value}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${card.accent}`}
              >
                Snapshot
              </span>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Search records
              </label>
              <input
                id="search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by beneficiary, ID, program, or application #"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring"
              />
            </div>

            <div className="w-full lg:w-56">
              <label
                htmlFor="statusFilter"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Filter by status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as ApplicationStatus | "All",
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-64">
              <label
                htmlFor="programFilter"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Filter by program
              </label>
              <select
                id="programFilter"
                value={programFilter}
                onChange={(event) => setProgramFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring"
              >
                <option value="All">All Programs</option>
                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Showing {filteredRecords.length} of {APPLICATIONS.length}{" "}
            application records.
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-100 text-left text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Application #</th>
                  <th className="px-4 py-3 font-semibold">Beneficiary</th>
                  <th className="px-4 py-3 font-semibold">Program</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Requested</th>
                  <th className="px-4 py-3 font-semibold">Released</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {filteredRecords.map((record) => (
                  <tr key={record.applicationId}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {record.applicationId}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {record.beneficiaryName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {record.beneficiaryId}
                      </p>
                    </td>
                    <td className="px-4 py-3">{record.program}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          record.status === "Released"
                            ? "bg-emerald-100 text-emerald-700"
                            : record.status === "Approved"
                              ? "bg-indigo-100 text-indigo-700"
                              : record.status === "Pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {currency.format(record.requestedAmount)}
                    </td>
                    <td className="px-4 py-3">
                      {currency.format(record.releasedAmount)}
                    </td>
                    <td className="px-4 py-3">{record.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRecords.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No records match your search and filters.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Reports</h2>
              <p className="text-sm text-slate-600">
                Generate a report with beneficiary records, application status
                summary, and program utilization summary.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowReport((value) => !value)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              {showReport ? "Hide Report" : "Generate Report"}
            </button>
          </div>

          {showReport && (
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Beneficiary Records
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Distinct beneficiaries in the current filtered result.
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {
                    new Set(
                      filteredRecords.map((record) => record.beneficiaryId),
                    ).size
                  }
                </p>
              </article>

              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Application Status Summary
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {statusSummary.map((item) => (
                    <li
                      key={item.status}
                      className="flex items-center justify-between"
                    >
                      <span>{item.status}</span>
                      <span className="font-semibold">{item.count}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Program Utilization Summary
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {programUtilization.map((item) => (
                    <li key={item.program}>
                      <p className="font-medium text-slate-900">
                        {item.program}
                      </p>
                      <p className="text-xs text-slate-600">
                        {item.applications} apps • Requested{" "}
                        {currency.format(item.totalRequested)} • Released{" "}
                        {currency.format(item.totalReleased)}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
