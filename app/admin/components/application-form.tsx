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
    <article
      className={`absolute top-0 left-0 w-[50%] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${isOpen ? "block" : "hidden"}`}
    >
      <h2 className="text-lg font-semibold text-slate-900">
        {/* {editingId ? "Edit Application" : "New Beneficiary Application"} */}
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Fill out beneficiary and program details to create or update an
        application.
      </p>

      {error && (
        <div className="mt-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-3 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-slate-700"
            htmlFor="beneficiaryName"
          >
            Beneficiary Name
          </label>
          <select
            id="beneficiaryName"
            required
            value={form.beneficiaryId}
            onChange={(event) => handleBeneficiaryChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring"
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

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-slate-700"
            htmlFor="program"
          >
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring"
          >
            <option value="">Select program name</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.program_name}
              </option>
            ))}
          </select>
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
            disabled={isSubmitting}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            {isSubmitting
              ? "Saving..."
              : editingId
                ? "Update Application"
                : "Add Application"}
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
  );
}

export default ApplicationForm;
