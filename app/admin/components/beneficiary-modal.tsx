"use client";

import { useState, useTransition } from "react";
import { createBeneficiary } from "../beneficiary/actions";
import { AssistanceCategory } from "@/types/assistance-category";

type BeneficiaryModalProps = {
  assistanceCategories: AssistanceCategory[];
};

export default function BeneficiaryModal({
  assistanceCategories,
}: BeneficiaryModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createBeneficiary(formData);
        setOpen(false);
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Add Beneficiary
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-blue-200">
                    Beneficiary Management
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Register Beneficiary
                  </h2>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* FORM */}
            <form action={handleSubmit} className="space-y-5 p-6">

              {/* FULL NAME */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  name="full_name"
                  type="text"
                  required
                  placeholder="Juan Dela Cruz"
                  className="
                    w-full rounded-lg border border-slate-300 bg-white
                    px-3 py-2.5 text-sm text-slate-900
                    placeholder:text-slate-400
                    outline-none transition
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    caret-slate-900
                  "
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Address
                </label>

                <textarea
                  name="address"
                  rows={3}
                  required
                  placeholder="Street, Barangay, City"
                  className="
                    w-full rounded-lg border border-slate-300 bg-white
                    px-3 py-2.5 text-sm text-slate-900
                    placeholder:text-slate-400
                    outline-none transition
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    caret-slate-900
                  "
                />
              </div>

              {/* CONTACT */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Contact Number
                </label>

                <input
                  name="contact_number"
                  type="tel"
                  placeholder="09171234567"
                  className="
                    w-full rounded-lg border border-slate-300 bg-white
                    px-3 py-2.5 text-sm text-slate-900
                    placeholder:text-slate-400
                    outline-none transition
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    caret-slate-900
                  "
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Assistance Category
                </label>

                <select
                  name="assistance_category_id"
                  required
                  className="
                    w-full rounded-lg border border-slate-300 bg-white
                    px-3 py-2.5 text-sm text-slate-900
                    outline-none transition
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  "
                >
                  <option value="">Select Category</option>

                  {assistanceCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Beneficiary"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}