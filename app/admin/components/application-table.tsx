"use client";

import { useEffect, useMemo, useState } from "react";

import { getApplications } from "@/app/admin/applications/action";
import { ApplicationProps } from "@/types/application";

type ApplicationStatus = "Pending" | "Approved" | "Rejected" | "Released";

type ApplicationsProps = {
  onEdit?: (item: ApplicationProps) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: ApplicationStatus) => void;
};

function normalizeStatus(status: string): ApplicationStatus {
  if (status === "Approved" || status === "Rejected" || status === "Released") {
    return status;
  }

  return "Pending";
}

function formatDateTime(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ApplicationTable({
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationsProps) {
  const [applications, setApplications] = useState<ApplicationProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );

  useEffect(() => {
    let active = true;

    async function loadApplications() {
      try {
        setLoading(true);
        setError("");

        const data = await getApplications();

        if (active) {
          setApplications(data as ApplicationProps[]);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load applications.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadApplications();

    return () => {
      active = false;
    };
  }, []);

  const filteredApplications = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return applications.filter((item) => {
      const matchesKeyword =
        keyword.length === 0 ||
        String(item.id).includes(keyword) ||
        String(item.beneficiary_id).includes(keyword) ||
        String(item.program_id).includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        (item.remarks ?? "").toLowerCase().includes(keyword) ||
        item.created_by_user_id.toLowerCase().includes(keyword) ||
        (item.reviewed_by_user_id ?? "").toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" || normalizeStatus(item.status) === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [applications, searchText, statusFilter]);

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Application Records
          </h2>
          <p className="text-sm text-slate-600">
            Loaded from getApplications and matched to your database schema.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by ID, status, remarks, or user"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring sm:w-72"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as ApplicationStatus | "All")
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring"
          >
            <option value="All">All Statuses</option>
            {(["Pending", "Approved", "Rejected", "Released"] as const).map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Beneficiary ID</th>
              <th className="px-4 py-3 font-semibold">Program ID</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Remarks</th>
              <th className="px-4 py-3 font-semibold">Reviewed By</th>
              <th className="px-4 py-3 font-semibold">Created At</th>
              <th className="px-4 py-3 font-semibold">Updated At</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
            {filteredApplications.map((item) => {
              const currentStatus = normalizeStatus(item.status);

              return (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {item.id}
                  </td>
                  <td className="px-4 py-3">
                    {item.beneficiary?.full_name ||
                      item.beneficiary?.name ||
                      `#${item.beneficiary_id}`}
                  </td>
                  <td className="px-4 py-3">
                    {item.program?.program_name ||
                      item.program?.name ||
                      `#${item.program_id}`}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        currentStatus === "Released"
                          ? "bg-emerald-100 text-emerald-700"
                          : currentStatus === "Approved"
                            ? "bg-indigo-100 text-indigo-700"
                            : currentStatus === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.remarks || "-"}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {item.reviewed_by_user_id || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDateTime(item.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDateTime(item.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="rounded-md border border-rose-300 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      )}
                      {onStatusChange && (
                        <select
                          value={currentStatus}
                          onChange={(event) =>
                            onStatusChange(
                              item.id,
                              event.target.value as ApplicationStatus,
                            )
                          }
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
                        >
                          {(
                            [
                              "Pending",
                              "Approved",
                              "Rejected",
                              "Released",
                            ] as const
                          ).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && filteredApplications.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            No application records match your current search or status filter.
          </div>
        )}

        {loading && (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            Loading applications from Supabase...
          </div>
        )}
      </div>
    </div>
  );
}
