"use client";

import { useTransition } from "react";

import { Program } from "@/types/program";
import { updateProgram } from "../program/action";

type EditProgramModalProps = {
  program: Program;
  onClose: () => void;
  onUpdated?: () => Promise<void> | void;
};

export default function EditProgramModal({
  program,
  onClose,
  onUpdated,
}: EditProgramModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        formData.append("id", String(program.id));

        const result = await updateProgram(formData);
        if (!result.success) {
          console.error(result.error ?? "Failed to update program.");
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
                Program Management
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                Edit Program
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

        <form action={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Program Name
            </label>
            <input
              name="program_name"
              defaultValue={program.program_name}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Program Code
            </label>
            <input
              name="program_code"
              defaultValue={program.program_code ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={program.description ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Budget (PHP)
              </label>
              <input
                name="budget"
                type="number"
                min={0}
                step="0.01"
                defaultValue={program.budget ?? ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                name="is_active"
                defaultValue={program.is_active ? "true" : "false"}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Start Date
              </label>
              <input
                name="start_date"
                type="date"
                defaultValue={program.start_date ?? ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                End Date
              </label>
              <input
                name="end_date"
                type="date"
                defaultValue={program.end_date ?? ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
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
              {isPending ? "Updating..." : "Update Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
