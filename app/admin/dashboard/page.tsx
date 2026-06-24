"use client";

import { useMemo, useState, useEffect } from "react";
// Ensure you have configured your supabase client utility file
import SignOutButton from "@/components/auth/sign-out-button";
import { createClient } from "@/lib/supabase/client";

type ApplicationStatus = "Pending" | "Approved" | "Rejected" | "Released";

type ApplicationRecord = {
  applicationId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  program: string;
  status: ApplicationStatus;
  requestedAmount: number;
  submittedAt: string;
};

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export default function AdminDashboard() {
  const supabase = createClient();

  // State management for database records
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );
  const [programFilter, setProgramFilter] = useState<string>("All");
  const [showReport, setShowReport] = useState(false);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchApplications() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false });

        if (supabaseError) throw supabaseError;

        // Map snake_case database fields to camelCase typescript types
        const mappedData: ApplicationRecord[] = (data || []).map(
          (row: any) => ({
            applicationId: row.application_id,
            beneficiaryId: row.beneficiary_id,
            beneficiaryName: row.beneficiary_name,
            program: row.program,
            status: row.status as ApplicationStatus,
            requestedAmount: Number(row.requested_amount),
            submittedAt: row.submitted_at,
          }),
        );

        setApplications(mappedData);
      } catch (err: any) {
        console.error("Error fetching applications:", err);
        setError(
          err.message || "An unexpected error occurred while loading data.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
  }, [supabase]);

  // Dynamic values extracted from the fetched data
  const programs = useMemo(() => {
    return Array.from(
      new Set(applications.map((record) => record.program)),
    ).sort();
  }, [applications]);

  const statuses: Array<ApplicationStatus | "All"> = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
    "Released",
  ];

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return applications.filter((record) => {
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
  }, [search, statusFilter, programFilter, applications]);

  const dashboardStats = useMemo(() => {
    const totalBeneficiaries = new Set(
      applications.map((record) => record.beneficiaryId),
    ).size;
    const totalPrograms = new Set(applications.map((record) => record.program))
      .size;
    const totalApplications = applications.length;
    const approvedApplications = applications.filter(
      (record) => record.status === "Approved" || record.status === "Released",
    ).length;

    return {
      totalBeneficiaries,
      totalPrograms,
      totalApplications,
      approvedApplications,
    };
  }, [applications]);

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

      return {
        program,
        applications: items.length,
        totalRequested,
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

        {/* Global Loading / Error State Banners */}
        {isLoading && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-center text-blue-700">
            <p className="animate-pulse font-medium">
              Loading application records from database...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
            <p className="font-semibold">Failed to retrieve records</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Reports
                  </h2>
                  <p className="text-sm text-slate-600">
                    Generate a report with beneficiary records, application
                    status summary, and program utilization summary.
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
                          </p>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
