import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import React from "react";

type PendingApplication = {
  id: number;
  name: string;
  program: string;
  status: string;
};

type ManagedProgram = {
  id: number;
  title: string;
  category: string;
  activeApplicants: number;
  deadline: string;
};

type Distribution = {
  id: number;
  program: string;
  date: string;
  time: string;
  location: string;
  status: string;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Ongoing";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Ongoing";
  }

  return parsed.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value: string | null) {
  if (!value) {
    return "Time not specified";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Time not specified";
  }

  return parsed.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function StaffDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    pendingCountResult,
    activeBeneficiariesResult,
    completedDistributionResult,
    pendingApplicationsResult,
    managedProgramsResult,
    applicationCountByProgramResult,
    recentReleasedResult,
  ] = await Promise.all([
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "Pending"),
    supabase.from("beneficiaries").select("id", { count: "exact", head: true }),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "Released"),
    supabase
      .from("applications")
      .select(
        `
        id,
        status,
        beneficiary:beneficiaries ( full_name ),
        program:programs ( program_name )
      `,
      )
      .in("status", ["Pending", "Approved", "Rejected"])
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("programs")
      .select("id, program_name, description, end_date")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("applications").select("program_id, status"),
    supabase
      .from("applications")
      .select(
        `
        id,
        status,
        updated_at,
        program:programs ( program_name )
      `,
      )
      .eq("status", "Released")
      .order("updated_at", { ascending: false })
      .limit(3),
  ]);

  const stats = [
    {
      label: "Pending Approvals",
      value: String(pendingCountResult.count ?? 0),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Active Beneficiaries",
      value: String(activeBeneficiariesResult.count ?? 0),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Completed Distributions",
      value: String(completedDistributionResult.count ?? 0),
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  const pendingApplications: PendingApplication[] =
    pendingApplicationsResult.data?.map((item: any) => ({
      id: item.id,
      name: item.beneficiary?.full_name || "Unknown Beneficiary",
      program: item.program?.program_name || "Unknown Program",
      status: item.status,
    })) ?? [];

  const activeApplicantCountByProgram =
    applicationCountByProgramResult.data?.reduce(
      (
        acc: Record<number, number>,
        item: { program_id: number; status: string },
      ) => {
        if (item.status === "Released" || item.status === "Rejected") {
          return acc;
        }

        acc[item.program_id] = (acc[item.program_id] ?? 0) + 1;
        return acc;
      },
      {},
    ) ?? {};

  const managedPrograms: ManagedProgram[] =
    managedProgramsResult.data?.map((item) => ({
      id: item.id,
      title: item.program_name,
      category: item.description || "General Assistance",
      activeApplicants: activeApplicantCountByProgram[item.id] ?? 0,
      deadline: formatDate(item.end_date),
    })) ?? [];

  const upcomingDistributions: Distribution[] =
    recentReleasedResult.data?.map((item: any) => ({
      id: item.id,
      program: item.program?.program_name || "Unknown Program",
      date: formatDate(item.updated_at),
      time: formatTime(item.updated_at),
      location: "Location not specified",
      status: item.status,
    })) ?? [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold">
            Staff Operations Dashboard
          </h1>
          <p className="text-slate-300 mt-2">
            Manage beneficiaries, review applications, and oversee assistance
            programs.
          </p>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border shadow-sm">
              <span className="text-sm text-slate-500">{stat.label}</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Applications Review */}
            <div>
              <h2 className="text-xl font-bold mb-4">Pending Applications</h2>

              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-5 rounded-xl border shadow-sm"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <h3 className="font-bold">{app.name}</h3>
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded whitespace-nowrap">
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      Program: {app.program}
                    </p>

                    <div className="mt-4 flex gap-2 flex-wrap">
                      <button className="bg-green-50 text-green-600 px-3 py-1 rounded text-xs font-bold">
                        Approve
                      </button>
                      <button className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-bold">
                        Reject
                      </button>
                      <button className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-bold">
                        Review
                      </button>
                    </div>
                  </div>
                ))}

                {pendingApplications.length === 0 && (
                  <div className="bg-white p-5 rounded-xl border shadow-sm text-sm text-slate-500">
                    No pending applications found.
                  </div>
                )}
              </div>
            </div>

            {/* Program Management */}
            <div>
              <h2 className="text-xl font-bold mb-4">Managed Programs</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {managedPrograms.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-5 rounded-xl border shadow-sm"
                  >
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Category: {p.category}
                    </p>
                    <p className="text-sm mt-2">
                      Active Applicants: {p.activeApplicants}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Deadline: {p.deadline}
                    </p>
                  </div>
                ))}

                {managedPrograms.length === 0 && (
                  <div className="bg-white p-5 rounded-xl border shadow-sm text-sm text-slate-500 sm:col-span-2">
                    No programs found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            {/* Distribution */}
            <div>
              <h2 className="text-xl font-bold mb-4">Recent Distributions</h2>

              {upcomingDistributions.map((d) => (
                <div key={d.id} className="bg-white p-5 rounded-xl border">
                  <div className="text-sm font-bold">{d.program}</div>
                  <div className="text-xs mt-2 text-slate-600">
                    {d.date} • {d.time}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {d.location}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-emerald-700">
                    {d.status}
                  </div>
                </div>
              ))}

              {upcomingDistributions.length === 0 && (
                <div className="bg-white p-5 rounded-xl border text-sm text-slate-500">
                  No distribution activity found.
                </div>
              )}
            </div>
            {/* Admin Tools */}
            <div className="bg-slate-900 text-white p-5 rounded-xl">
              <h3 className="font-bold text-sm">Staff Tools</h3>
              <p className="text-xs text-slate-400 mt-2">
                Access reporting, export data, and manage barangay assistance
                records.
              </p>

              <button className="w-full mt-4 bg-slate-800 py-2 rounded text-xs font-semibold">
                Open Admin Panel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
