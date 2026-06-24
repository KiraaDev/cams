import React, { useEffect, useState } from 'react'
import { getApplications } from "@/app/admin/applications/action";
import { Application } from '@/types/application';


function ApplicationStats() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    async function fetchApplications() {
      const data = await getApplications();
      setApplications(data);
    }

    fetchApplications();
  }, []);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Total Applications</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">
          {applications.length}
        </p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
        <p className="text-sm text-amber-700">Pending</p>
        <p className="mt-1 text-2xl font-semibold text-amber-900">
          {applications.filter((app) => app.status === "Pending").length}
        </p>
      </div>
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
        <p className="text-sm text-indigo-700">Approved</p>
        <p className="mt-1 text-2xl font-semibold text-indigo-900">
          {applications.filter((app) => app.status === "Approved").length}
        </p>
      </div>
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
        <p className="text-sm text-rose-700">Rejected</p>
        <p className="mt-1 text-2xl font-semibold text-rose-900">
          {applications.filter((app) => app.status === "Rejected").length}
        </p>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
        <p className="text-sm text-emerald-700">Released</p>
        <p className="mt-1 text-2xl font-semibold text-emerald-900">
          {applications.filter((app) => app.status === "Released").length}
        </p>
      </div>
    </section>
  );
}

export default ApplicationStats