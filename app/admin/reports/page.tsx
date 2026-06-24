import React from 'react'
import { getApplicationStatusSummary, getBeneficiaryReport, getProgramUtilizationReport } from './actions';

export default async function ReportsPage() {
  const beneficiaries = await getBeneficiaryReport();
  const status = await getApplicationStatusSummary();
  const programs = await getProgramUtilizationReport();

  // Calculate overall application stats for summary cards if needed
  const totalApplications = Object.values(status).reduce((a: any, b: any) => a + b, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor beneficiaries, real-time application pipelines, and program utilization statistics.</p>
      </div>

      {/* Top Level Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Beneficiaries Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Total Reach</span>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{beneficiaries?.length || 0}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-4">Active registered beneficiaries across all regions.</p>
        </div>

        {/* Total Pipeline Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Total Pipeline</span>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalApplications}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-4">Total processing applications submitted to date.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left/Main Column: Program Utilization */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Program Utilization</h2>
            <p className="text-xs text-slate-500">Allocation breakdown and pipeline state for each active program.</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Program Name</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Total</th>
                    <th className="py-3.5 px-4 font-semibold text-center text-amber-600 bg-amber-50/30">Pending</th>
                    <th className="py-3.5 px-4 font-semibold text-center text-blue-600 bg-blue-50/30">Approved</th>
                    <th className="py-3.5 px-4 font-semibold text-center text-emerald-600 bg-emerald-50/30">Released</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {Object.entries(programs).map(([program, stats]: any) => (
                    <tr key={program} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900">{program}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-600">{stats.total}</td>
                      <td className="py-3.5 px-4 text-center text-amber-700 bg-amber-50/10 font-medium">{stats.Pending}</td>
                      <td className="py-3.5 px-4 text-center text-blue-700 bg-blue-50/10 font-medium">{stats.Approved}</td>
                      <td className="py-3.5 px-4 text-center text-emerald-700 bg-emerald-50/10 font-medium">{stats.Released}</td>
                    </tr>
                  ))}
                  {Object.keys(programs).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">No program utilization data found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Application Status Sidebar */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Application Pipeline</h2>
            <p className="text-xs text-slate-500">Current systemic status counts.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="space-y-3">
              {Object.entries(status).map(([key, value]: any) => {
                // Color mapping for status items
                const colors: Record<string, { bg: string, text: string, bar: string }> = {
                  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' },
                  Approved: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
                  Released: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
                  Rejected: { bg: 'bg-rose-50', text: 'text-rose-700', bar: 'bg-rose-500' },
                };

                const config = colors[key] || { bg: 'bg-slate-50', text: 'text-slate-700', bar: 'bg-slate-400' };
                const percentage = totalApplications > 0 ? (value / totalApplications) * 100 : 0;

                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${config.bar}`} />
                        {key}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${config.bg} ${config.text}`}>
                        {value}
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${config.bar} transition-all duration-500`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}