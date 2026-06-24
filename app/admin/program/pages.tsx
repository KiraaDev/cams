"use client";

import { useEffect, useState } from "react";
import ProgramAddButton from "../components/program-add-button";
import ProgramTable from "../components/program-table";
import { getPrograms } from "./action";
import { Program } from "@/types/program";
import ProgramForm from "../components/program-form";
import EditProgramModal from "../components/edit-program-modal";
import DeleteProgramModal from "../components/delete-program-modal";

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [deleteProgramTarget, setDeleteProgramTarget] =
    useState<Program | null>(null);

  async function loadPrograms() {
    try {
      setError("");
      const data = await getPrograms();
      setPrograms(data);
    } catch (loadError) {
      console.error("Error loading programs:", loadError);
      setError("Failed to load programs.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  const totalPrograms = programs.length;
  const activePrograms = programs.filter((program) => program.is_active).length;
  const totalBudget = programs.reduce(
    (sum, program) => sum + (program.budget ?? 0),
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-blue-700 px-6 py-8 text-white sm:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200">
              Admin Module
            </p>

            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Program Management
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-slate-200 sm:text-base">
              Manage assistance programs, monitor active initiatives, and track
              available budgets.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Programs
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalPrograms}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Active Programs
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              {activePrograms}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Budget
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                maximumFractionDigits: 0,
              }).format(totalBudget)}
            </p>
          </article>
        </section>

        <ProgramAddButton isOpen={isOpen} setIsOpen={setIsOpen} />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Loading programs...
            </div>
          ) : (
            <ProgramTable
              programs={programs}
              onEdit={setSelectedProgram}
              onDelete={setDeleteProgramTarget}
            />
          )}
        </section>
        <ProgramForm isOpen={isOpen} setIsOpen={setIsOpen} />
        {selectedProgram && (
          <EditProgramModal
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
            onUpdated={loadPrograms}
          />
        )}
        {deleteProgramTarget && (
          <DeleteProgramModal
            program={deleteProgramTarget}
            onClose={() => setDeleteProgramTarget(null)}
            onDeleted={loadPrograms}
          />
        )}
      </div>
    </main>
  );
}
