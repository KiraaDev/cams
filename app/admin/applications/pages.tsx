"use client";

import ApplicationTable from "@/app/admin/components/application-table";
import ApplicationStats from "../components/application-stats";
import ApplicationForm from "../components/application-form";
import ApplicationAddButton from "../components/application-add-button";

import { FormEvent, useMemo, useState } from "react";

type ApplicationStatus = "Pending" | "Approved" | "Rejected" | "Released";

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

const STATUSES: ApplicationStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Released",
];

const SAMPLE_APPLICATIONS: ApplicationItem[] = [
  {
    id: "APP-3001",
    beneficiaryName: "Maria Santos",
    beneficiaryId: "BEN-201",
    program: "Food Subsidy",
    amount: 5000,
    status: "Pending",
    submittedAt: "2026-06-02",
  },
  {
    id: "APP-3002",
    beneficiaryName: "Rico Flores",
    beneficiaryId: "BEN-206",
    program: "Livelihood Support",
    amount: 18000,
    status: "Approved",
    submittedAt: "2026-06-04",
  },
  {
    id: "APP-3003",
    beneficiaryName: "Ana Villanueva",
    beneficiaryId: "BEN-205",
    program: "Education Grant",
    amount: 9500,
    status: "Released",
    submittedAt: "2026-06-10",
  },
  {
    id: "APP-3004",
    beneficiaryName: "Noel Garcia",
    beneficiaryId: "BEN-204",
    program: "Medical Assistance",
    amount: 11000,
    status: "Rejected",
    submittedAt: "2026-06-13",
  },
];

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

export default function Application() {
  const [applications, setApplications] =
    useState<ApplicationItem[]>(SAMPLE_APPLICATIONS);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );

  const [isOpen, setIsOpen] = useState(false);

  const dashboardStats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((item) => item.status === "Pending").length,
      approved: applications.filter((item) => item.status === "Approved")
        .length,
      rejected: applications.filter((item) => item.status === "Rejected")
        .length,
      released: applications.filter((item) => item.status === "Released")
        .length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return applications.filter((item) => {
      const matchesKeyword =
        keyword.length === 0 ||
        item.id.toLowerCase().includes(keyword) ||
        item.beneficiaryName.toLowerCase().includes(keyword) ||
        item.beneficiaryId.toLowerCase().includes(keyword) ||
        item.program.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [applications, searchText, statusFilter]);

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

        <ApplicationAddButton isOpen={isOpen} setIsOpen={setIsOpen} />
        <ApplicationStats />

        <section className="grid gap-6">
          {/* application-form */}
          <ApplicationForm isOpen={isOpen} setIsOpen={setIsOpen} />
          <article className="rounded-2xl border border-slate-200 bg-white w-full p-5 shadow-sm sm:p-6">
            {/* application-table */}
            <ApplicationTable />
          </article>
        </section>
      </div>
    </main>
  );
}
