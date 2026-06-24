import BeneficiaryStats from "../components/beneficiary-stats";
import {
  getAssistanceCategories,
  getBeneficiaries,
  getBeneficiaryPageCounts,
} from "./actions";
import BeneficiaryClient from "../components/beneficiary-client-page";

export default async function Beneficiary() {
  const beneficiaries = await getBeneficiaries();

  const assistanceCategories = await getAssistanceCategories();

  const stats = await getBeneficiaryPageCounts();

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-blue-700 px-6 py-8 text-white sm:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200">
              Admin Module
            </p>

            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Beneficiary Management
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-slate-200 sm:text-base">
              Register beneficiaries, keep records current, and manage
              assistance category assignments.
            </p>
          </div>
        </section>

        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {/* header + stats can stay server */}
          <BeneficiaryStats data={stats} />

          {/* 👇 move interactive part here */}
          <BeneficiaryClient
            beneficiaries={beneficiaries}
            assistanceCategories={assistanceCategories}
          />
        </div>
      </div>
    </main>
  );
}
