import { Beneficiary } from "@/types/beneficiary";

type BeneficiaryRecordsProps = {
  data: Beneficiary[];
};

export default function BeneficiaryRecords({ data }: BeneficiaryRecordsProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Beneficiary Records
      </h2>

      <p className="text-sm text-slate-600">
        View, search, and manage beneficiary information.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="text"
          placeholder="Search beneficiaries..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring"
        />

        <select className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring">
          <option>All Categories</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-100 text-left text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Full Name</th>
              <th className="px-4 py-3 font-semibold">Address</th>
              <th className="px-4 py-3 font-semibold">Contact Number</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Created At</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
            {data.length > 0 ? (
              data.map((beneficiary) => (
                <tr key={beneficiary.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {beneficiary.id}
                  </td>
                  <td className="px-4 py-3">{beneficiary.full_name}</td>
                  <td className="px-4 py-3">{beneficiary.address}</td>
                  <td className="px-4 py-3">
                    {beneficiary.contact_number ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    {beneficiary.assistance_category_id}
                  </td>
                  <td className="px-4 py-3">
                    {beneficiary.created_at
                      ? new Date(beneficiary.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="rounded-md border border-rose-300 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  No beneficiary records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}
