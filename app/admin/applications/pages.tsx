"use client";

import ApplicationTable from "@/app/admin/components/application-table";
import ApplicationStats from "../components/application-stats";
import ApplicationForm from "../components/application-form";
import ApplicationAddButton from "../components/application-add-button";
import EditApplicationModal from "../components/edit-application-modal";
import DeleteApplicationModal from "../components/delete-application-modal";
import { getApplications } from "./action";

import { FormEvent, useMemo, useState } from "react";
import { Application, ApplicationStatus } from "@/types/application";

type ApplicationItem = {
  id: string;
  beneficiaryName: string;
  beneficiaryId: string;
  program: string;
  amount: number;
  status: ApplicationStatus;
  submittedAt: string;
};

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

const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function buildApplicationId(existing: ApplicationItem[]) {
  const maxId = existing.reduce((max, item) => {
    const numeric = Number(item.id.replace("APP-", ""));
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 3000);

  return `APP-${String(maxId + 1)}`;
}

type ApplicationProps = {
  data: Application[];
};

export default function ApplicationPage({ data }: ApplicationProps) {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [tableData, setTableData] = useState<Application[]>(data);

  async function refreshApplications() {
    try {
      const latest = await getApplications();
      setTableData(latest);
    } catch (refreshError) {
      console.error("Failed to refresh applications:", refreshError);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountNumber = Number(form.amount);
    if (!form.beneficiaryName || !form.beneficiaryId || !form.program) {
      return;
    }

    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      return;
    }

    if (editingId) {
      setApplications((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                beneficiaryName: form.beneficiaryName,
                beneficiaryId: form.beneficiaryId,
                program: form.program,
                amount: amountNumber,
                status: form.status,
              }
            : item,
        ),
      );
      resetForm();
      return;
    }

    const newItem: ApplicationItem = {
      id: buildApplicationId(applications),
      beneficiaryName: form.beneficiaryName,
      beneficiaryId: form.beneficiaryId,
      program: form.program,
      amount: amountNumber,
      status: form.status,
      submittedAt: new Date().toISOString().slice(0, 10),
    };

    setApplications((current) => [newItem, ...current]);
    resetForm();
  }

  function onEdit(item: ApplicationItem) {
    setEditingId(item.id);
    setForm({
      beneficiaryName: item.beneficiaryName,
      beneficiaryId: item.beneficiaryId,
      program: item.program,
      amount: String(item.amount),
      status: item.status,
    });
  }

  function onDelete(id: string) {
    setApplications((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  }

  function onStatusChange(id: string, newStatus: ApplicationStatus) {
    setApplications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-emerald-700 px-6 py-8 text-white sm:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
              Admin Module
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Application Management
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-200 sm:text-base">
              Create beneficiary applications, maintain records, and track
              application status from Pending through Released.
            </p>
          </div>
        </section>

        <ApplicationStats />
        <ApplicationAddButton isOpen={isOpen} setIsOpen={setIsOpen} />
        <section className="grid gap-6">
          {/* application-form */}
          <ApplicationForm isOpen={isOpen} setIsOpen={setIsOpen} />
          <article className="rounded-2xl border border-slate-200 bg-white w-full p-5 shadow-sm sm:p-6">
            {/* application-table */}
            <ApplicationTable
              data={tableData}
              onEdit={setSelectedApplication}
              onDelete={(id) => {
                const target = tableData.find((item) => item.id === id) ?? null;
                setDeleteTarget(target);
              }}
            />
          </article>
        </section>

        {selectedApplication && (
          <EditApplicationModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onUpdated={refreshApplications}
          />
        )}

        {deleteTarget && (
          <DeleteApplicationModal
            application={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={refreshApplications}
          />
        )}
      </div>
    </main>
  );
}
