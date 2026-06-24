"use client";

import React, { FormEvent, useState } from "react";

import { onSubmitPrograms } from "../program/action";

type FormState = {
  programCode: string;
  programName: string;
  description: string;
  budget: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

const initialForm: FormState = {
  programCode: "",
  programName: "",
  description: "",
  budget: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

type ProgramFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

function ProgramForm({ isOpen, setIsOpen }: ProgramFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setForm(initialForm);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedBudget = form.budget.trim() ? Number(form.budget) : null;

    if (
      parsedBudget !== null &&
      (Number.isNaN(parsedBudget) || parsedBudget < 0)
    ) {
      setError("Budget must be a valid non-negative number.");
      return;
    }

    setIsSubmitting(true);

    const result = await onSubmitPrograms({
      program_code: form.programCode.trim() || null,
      program_name: form.programName,
      description: form.description.trim() || null,
      budget: parsedBudget,
      start_date: form.startDate || null,
      end_date: form.endDate || null,
      is_active: form.isActive,
    });

    if (!result.ok) {
      setError(result.error ?? "Failed to submit program.");
      setIsSubmitting(false);
      return;
    }

    resetForm();
    setIsSubmitting(false);
    setIsOpen(false);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-blue-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.25em] text-blue-200 uppercase">
                Program Management
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                Register Program
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              x
            </button>
          </div>
        </div>

        <form className="space-y-5 p-6" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="programCode"
            >
              Program Code
            </label>
            <input
              id="programCode"
              type="text"
              value={form.programCode}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  programCode: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 caret-slate-900"
              placeholder="e.g., LIV-001"
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="programName"
            >
              Program Name
            </label>
            <input
              id="programName"
              type="text"
              required
              value={form.programName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  programName: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 caret-slate-900"
              placeholder="e.g., Educational Assistance"
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 caret-slate-900"
              placeholder="Program details"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-slate-700"
                htmlFor="budget"
              >
                Budget (PHP)
              </label>
              <input
                id="budget"
                type="number"
                min={0}
                step="0.01"
                value={form.budget}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    budget: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 caret-slate-900"
                placeholder="e.g., 500000"
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-slate-700"
                htmlFor="isActive"
              >
                Status
              </label>
              <select
                id="isActive"
                value={form.isActive ? "active" : "inactive"}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isActive: event.target.value === "active",
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-slate-700"
                htmlFor="startDate"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-slate-700"
                htmlFor="endDate"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    endDate: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsOpen(false);
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProgramForm;
