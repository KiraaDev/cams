"use client";

import React, { FormEvent, useState, useEffect } from "react";

import { onSubmitApplications } from "../applications/action";

import { getBeneficiaries } from "../beneficiary/actions";
import { getPrograms } from "../program/action";

import { Beneficiary } from "@/types/beneficiary";
import { Program } from "@/types/program";

type ApplicationStatus = "Pending" | "Approved" | "Rejected" | "Released";

type FormState = {
  beneficiaryName: string;
  beneficiaryId: string;
  program: string;
  amount: string;
  status: ApplicationStatus;
};

const initialForm: FormState = {
  beneficiaryName: "",
  beneficiaryId: "",
  program: "",
  amount: "",
  status: "Pending",
};

const STATUSES: ApplicationStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Released",
];

type ApplicationFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

function ApplicationForm({ isOpen, setIsOpen }: ApplicationFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const data = await getBeneficiaries();
        setBeneficiaries(data);
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
      }
    };

    fetchBeneficiaries();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getPrograms();
        setPrograms(data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  function handleBeneficiaryChange(value: string) {
    const selectedBeneficiary = beneficiaries.find(
      (beneficiary) => String(beneficiary.id) === value,
    );

    setForm((current) => ({
      ...current,
      beneficiaryId: value,
      beneficiaryName: selectedBeneficiary?.full_name ?? "",
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const beneficiaryId = Number(form.beneficiaryId);
    const programId = Number(form.program);

    if (Number.isNaN(beneficiaryId) || beneficiaryId <= 0) {
      setError("Beneficiary ID must be a valid numeric ID.");
      return;
    }

    if (Number.isNaN(programId) || programId <= 0) {
      setError("Program must be a valid numeric Program ID.");
      return;
    }

    setIsSubmitting(true);

    const result = await onSubmitApplications({
      beneficiaryId,
      programId,
      status: form.status,
      remarks: form.amount.trim() || null,
    });

    if (!result.ok) {
      setError(result.error ?? "Failed to submit application.");
      setIsSubmitting(false);
      return;
    }

    setSuccess("Application created successfully.");
    resetForm();
    setIsSubmitting(false);
    setIsOpen(false);
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-700 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">
                    Application Management
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {editingId ? "Edit Application" : "Create Application"}
                  </h2>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* FORM */}
            <div className="p-6">
              <p className="text-sm text-slate-600">
                Fill out beneficiary and program details to create or update an
                application.
              </p>

              {error && (
                <div className="mt-4 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <form className="mt-5 space-y-5" onSubmit={onSubmit}>
                {/* BENEFICIARY */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Beneficiary Name
                  </label>

                  <select
                    id="beneficiaryName"
                    required
                    value={form.beneficiaryId}
                    onChange={(event) =>
                      handleBeneficiaryChange(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Select beneficiary name</option>
                    {beneficiaries.map((beneficiary) => (
                      <option key={beneficiary.id} value={beneficiary.id}>
                        {beneficiary.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <input type="hidden" value={form.beneficiaryName} readOnly />

                {/* PROGRAM */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Program Name
                  </label>

                  <select
                    id="program"
                    required
                    value={form.program}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        program: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Select program name</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.program_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AMOUNT */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="e.g., 10000"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingId
                        ? "Update Application"
                        : "Add Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ApplicationForm;
