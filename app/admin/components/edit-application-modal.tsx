"use client";

import { useEffect, useTransition, useState } from "react";

import { getBeneficiaries } from "../beneficiary/actions";
import { getPrograms } from "../program/action";
import { updateApplication } from "../applications/action";

import { Application, ApplicationStatus } from "@/types/application";
import { Beneficiary } from "@/types/beneficiary";
import { Program } from "@/types/program";

type EditApplicationModalProps = {
  application: Application;
  onClose: () => void;
  onUpdated?: () => Promise<void> | void;
};

const STATUSES: ApplicationStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Released",
];

export default function EditApplicationModal({
  application,
  onClose,
  onUpdated,
}: EditApplicationModalProps) {
  const [isPending, startTransition] = useTransition();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [form, setForm] = useState({
    beneficiaryId: String(application.beneficiary_id),
    programId: String(application.program_id),
    remarks: application.remarks ?? "",
    status: application.status,
  });

  useEffect(() => {
    setForm({
      beneficiaryId: String(application.beneficiary_id),
      programId: String(application.program_id),
      remarks: application.remarks ?? "",
      status: application.status,
    });
  }, [application]);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [beneficiaryData, programData] = await Promise.all([
          getBeneficiaries(),
          getPrograms(),
        ]);

        setBeneficiaries(beneficiaryData);
        setPrograms(programData);
      } catch (error) {
        console.error("Failed to load application edit options:", error);
      }
    }

    loadOptions();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("beneficiary_id", form.beneficiaryId);
    formData.append("program_id", form.programId);
    formData.append("remarks", form.remarks);
    formData.append("status", form.status);

    startTransition(async () => {
      try {
        formData.append("id", String(application.id));

        const result = await updateApplication(formData);
        if (!result.success) {
          console.error(result.error ?? "Failed to update application.");
          return;
        }

        if (onUpdated) {
          await onUpdated();
        }

        onClose();
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-blue-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-blue-200">
                Application Management
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                Edit Application
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              x
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Beneficiary Name
            </label>
            <select
              name="beneficiary_id"
              value={form.beneficiaryId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  beneficiaryId: event.target.value,
                }))
              }
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="" className="text-slate-500">
                Select Beneficiary
              </option>
              {beneficiaries.map((beneficiary) => (
                <option
                  key={beneficiary.id}
                  value={beneficiary.id}
                  className="text-slate-900"
                >
                  {beneficiary.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Program Name
            </label>
            <select
              name="program_id"
              value={form.programId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  programId: event.target.value,
                }))
              }
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="" className="text-slate-500">
                Select Program
              </option>
              {programs.map((program) => (
                <option
                  key={program.id}
                  value={program.id}
                  className="text-slate-900"
                >
                  {program.program_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Remarks
            </label>
            <textarea
              name="remarks"
              rows={3}
              value={form.remarks}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  remarks: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Application Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as ApplicationStatus,
                }))
              }
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status} className="text-slate-900">
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {isPending ? "Updating..." : "Update Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
