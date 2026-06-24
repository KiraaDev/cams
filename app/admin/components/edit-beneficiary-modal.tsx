"use client";

import { useTransition } from "react";
import { updateBeneficiary } from "../beneficiary/actions";
import { AssistanceCategory } from "@/types/assistance-category";

type Beneficiary = {
  id: string;
  full_name: string;
  address: string;
  contact_number: string | null;
  assistance_category_id: string;
};

type EditBeneficiaryModalProps = {
  beneficiary: Beneficiary;
  assistanceCategories: AssistanceCategory[];
  onClose: () => void; // Make sure to destruct this prop
};

export default function EditBeneficiaryModal({
  beneficiary,
  assistanceCategories,
  onClose,
}: EditBeneficiaryModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        formData.append("id", beneficiary.id);

        await updateBeneficiary(formData);
        onClose(); // Call parent onClose on success
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
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
                Edit Beneficiary
              </h2>
            </div>

            <button
              onClick={onClose} // Call parent onClose
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
              defaultValue={beneficiary.full_name}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
              defaultValue={beneficiary.address}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
              defaultValue={beneficiary.contact_number ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Assistance Category
            </label>
            <select
              name="assistance_category_id"
              defaultValue={beneficiary.assistance_category_id}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="" className="text-slate-500">
                Select Category
              </option>
              {assistanceCategories.map((cat) => (
                <option key={cat.id} value={cat.id} className="text-slate-900">
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
          {/* ACTIONS */}
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose} // Call parent onClose
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {isPending ? "Updating..." : "Update Beneficiary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
