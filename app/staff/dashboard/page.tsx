import SignOutButton from "@/components/auth/sign-out-button";
import React from "react";

// Mock staff profile
const staffProfile = {
  name: "Gomer Gaufo",
  role: "Social Welfare Staff",
  department: "CAMS Operations",
};

const stats = [
  { label: "Pending Approvals", value: "3", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Active Beneficiaries", value: "128", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Completed Distributions", value: "24", color: "text-green-600", bg: "bg-green-50" },
];

const pendingApplications = [
  {
    id: "A1",
    name: "Juan Dela Cruz",
    program: "Emergency Livelihood Support",
    status: "For Review",
  },
  {
    id: "A2",
    name: "Maria Santos",
    program: "Educational Financial Aid",
    status: "Missing Requirements",
  },
];

const managedPrograms = [
  {
    id: "P1",
    title: "Emergency Livelihood Support",
    category: "Financial",
    activeApplicants: 45,
    deadline: "July 10, 2026",
  },
  {
    id: "P2",
    title: "Health & Wellness Medical Mission",
    category: "Healthcare",
    activeApplicants: 89,
    deadline: "Ongoing",
  },
];

const upcomingDistributions = [
  {
    id: 1,
    program: "Quarterly Rice Subsidies",
    date: "June 28, 2026",
    time: "8:00 AM - 12:00 PM",
    location: "Barangay 56 Covered Court",
    status: "Confirmed",
  },
];

export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">

      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="text-xl font-bold">CAMS Staff</span>
        </div>
<SignOutButton />
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">{staffProfile.name}</p>
          <p className="text-xs text-slate-500">{staffProfile.role}</p>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold">
            Staff Operations Dashboard
          </h1>
          <p className="text-slate-300 mt-2">
            Manage beneficiaries, review applications, and oversee assistance programs.
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
                    <div className="flex justify-between">
                      <h3 className="font-bold">{app.name}</h3>
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      Program: {app.program}
                    </p>

                    <div className="mt-4 flex gap-2">
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
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-8">

            {/* Distribution */}
            <div>
              <h2 className="text-xl font-bold mb-4">Upcoming Distribution</h2>

              {upcomingDistributions.map((d) => (
                <div key={d.id} className="bg-white p-5 rounded-xl border">
                  <div className="text-sm font-bold">{d.program}</div>
                  <div className="text-xs mt-2 text-slate-600">
                    {d.date} • {d.time}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {d.location}
                  </div>
                </div>
              ))}
            </div>
            {/* Admin Tools */}
            <div className="bg-slate-900 text-white p-5 rounded-xl">
              <h3 className="font-bold text-sm">Staff Tools</h3>
              <p className="text-xs text-slate-400 mt-2">
                Access reporting, export data, and manage barangay assistance records.
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