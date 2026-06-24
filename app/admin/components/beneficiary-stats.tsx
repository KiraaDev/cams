type BeneficiaryStatsProps = {
  data: {
    totalBeneficiaries: number;
    totalAssistanceCategories: number;
  };
};

export default function BeneficiaryStats({
  data
}: BeneficiaryStatsProps) {
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Beneficiaries</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {data.totalBeneficiaries}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-700">Assistance Categories</p>
          <p className="mt-1 text-2xl font-semibold text-blue-900">
            {data.totalAssistanceCategories}
          </p>
        </div>
      </section>
    </>
  );
}
