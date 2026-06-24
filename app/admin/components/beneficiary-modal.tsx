"use client";

import { useState } from "react";

export default function BeneficiaryModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Add Beneficiary
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-200">
                    Beneficiary Management
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Register Beneficiary
                  </h2>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <form className="space-y-4 p-6">
              <div>
                <label
                  htmlFor="full_name"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  placeholder="Juan Dela Cruz"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  placeholder="Street, Barangay, City"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
                />
              </div>

              <div>
                <label
                  htmlFor="contact_number"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Contact Number
                </label>

                <input
                  id="contact_number"
                  name="contact_number"
                  type="tel"
                  placeholder="09171234567"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
                />
              </div>

              <div>
                <label
                  htmlFor="assistance_category_id"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Assistance Category
                </label>

                <select
                  id="assistance_category_id"
                  name="assistance_category_id"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-400 transition focus:border-blue-500 focus:ring"
                >
                  <option value="">Select Category</option>
                  <option value="1">Medical Assistance</option>
                  <option value="2">Financial Assistance</option>
                  <option value="3">Educational Assistance</option>
                  <option value="4">Burial Assistance</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Save Beneficiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}