"use client";

import { FormEvent, useMemo, useState } from "react";
import { useEffect } from "react";

type Province = {
  code: string;
  name: string;
};

type CityMunicipality = {
  code: string;
  name: string;
};

type Barangay = {
  code: string;
  name: string;
};



type AssistanceType =
  | "Cash Assistance"
  | "Food Pack"
  | "Medical Support"
  | "Education Grant"
  | "Livelihood Kit";

type ReleaseRecord = {
  id: string;
  dateReleased: string;
  assistanceType: AssistanceType;
  beneficiaryName: string;
  beneficiaryId: string;

  beneficiaryProvince: string;
  beneficiaryMunicipality: string;
  beneficiaryBarangay: string;

  releasingOfficer: string;
  amount: number;
};

type ReleaseForm = {
  dateReleased: string;
  assistanceType: AssistanceType;
  beneficiaryName: string;
  beneficiaryId: string;

  beneficiaryProvince: string;
  beneficiaryMunicipality: string;
  beneficiaryBarangay: string;

  releasingOfficer: string;
  amount: string;
};

const ASSISTANCE_TYPES: AssistanceType[] = [
  "Cash Assistance",
  "Food Pack",
  "Medical Support",
  "Education Grant",
  "Livelihood Kit",
];

const SAMPLE_RELEASES: ReleaseRecord[] = [
  {
  id: "REL-5001",
  dateReleased: "2026-06-07",
  assistanceType: "Cash Assistance",
  beneficiaryName: "Maria Santos",
  beneficiaryId: "BEN-201",
  beneficiaryProvince: "Bulacan",
  beneficiaryMunicipality: "Malolos City",
  beneficiaryBarangay: "Barangay San Isidro",
  releasingOfficer: "Officer Ramon Dela Peña",
  amount: 5000,
  },
  {
    id: "REL-5002",
    dateReleased: "2026-06-11",
    assistanceType: "Medical Support",
    beneficiaryName: "John Dela Cruz",
    beneficiaryId: "BEN-202",
    beneficiaryProvince: "Bulacan",
  beneficiaryMunicipality: "Malolos City",
    beneficiaryBarangay: "Barangay Mabini",
    releasingOfficer: "Officer Carla Reyes",
    amount: 12000,
  },
  {
    id: "REL-5003",
    dateReleased: "2026-06-15",
    assistanceType: "Food Pack",
    beneficiaryName: "Liza Ramos",
    beneficiaryId: "BEN-203",
    beneficiaryProvince: "Bulacan",
    beneficiaryMunicipality: "Malolos City",
    beneficiaryBarangay: "Barangay Sto. Nino",
    releasingOfficer: "Officer Carlo Mendoza",
    amount: 2500,
  },
];

const initialForm: ReleaseForm = {
  dateReleased: "",
  assistanceType: "Cash Assistance",
  beneficiaryName: "",
  beneficiaryId: "",

  beneficiaryProvince: "",
  beneficiaryMunicipality: "",
  beneficiaryBarangay: "",

  releasingOfficer: "",
  amount: "",
};

const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function buildReleaseId(entries: ReleaseRecord[]) {
  const maxId = entries.reduce((max, item) => {
    const numeric = Number(item.id.replace("REL-", ""));
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 5000);

  return `REL-${String(maxId + 1)}`;
}

export default function ReleaseMonitoring() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<CityMunicipality[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);

  const [provinceCode, setProvinceCode] = useState("");
  const [municipalityCode, setMunicipalityCode] = useState("");

  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/provinces/")
      .then((res) => res.json())
      .then((data) =>
        setProvinces(
          data.sort((a: Province, b: Province) =>
            a.name.localeCompare(b.name)
          )
        )
      );
  }, []);

  useEffect(() => {
    if (!provinceCode) return;

    fetch(
      `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`
    )
      .then((res) => res.json())
      .then((data) =>
        setMunicipalities(
          data.sort((a: CityMunicipality, b: CityMunicipality) =>
            a.name.localeCompare(b.name)
          )
        )
      );
  }, [provinceCode]);

  useEffect(() => {
    if (!municipalityCode) return;

    fetch(
      `https://psgc.gitlab.io/api/cities-municipalities/${municipalityCode}/barangays/`
    )
      .then((res) => res.json())
      .then((data) =>
        setBarangays(
          data.sort((a: Barangay, b: Barangay) =>
            a.name.localeCompare(b.name)
          )
        )
      );
  }, [municipalityCode]);
  const [records, setRecords] = useState<ReleaseRecord[]>(SAMPLE_RELEASES);
  const [form, setForm] = useState<ReleaseForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [assistanceFilter, setAssistanceFilter] = useState<
    AssistanceType | "All"
  >("All");

  const summary = useMemo(() => {
    return {
      totalReleases: records.length,
      totalAmount: records.reduce((sum, item) => sum + item.amount, 0),
      officers: new Set(records.map((item) => item.releasingOfficer)).size,
      beneficiaries: new Set(records.map((item) => item.beneficiaryId)).size,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return records.filter((record) => {
      const matchesKeyword =
        keyword.length === 0 ||
        record.id.toLowerCase().includes(keyword) ||
        record.beneficiaryName.toLowerCase().includes(keyword) ||
        record.beneficiaryId.toLowerCase().includes(keyword) ||
        record.releasingOfficer.toLowerCase().includes(keyword) ||
        record.beneficiaryBarangay.toLowerCase().includes(keyword);

      const matchesAssistance =
        assistanceFilter === "All" ||
        record.assistanceType === assistanceFilter;

      return matchesKeyword && matchesAssistance;
    });
  }, [records, searchText, assistanceFilter]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountNumber = Number(form.amount);
    if (
      !form.dateReleased ||
      !form.beneficiaryName ||
      !form.beneficiaryId ||
      !form.beneficiaryBarangay ||
      !form.releasingOfficer
    ) {
      return;
    }

    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      return;
    }

    if (editingId) {
      setRecords((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                dateReleased: form.dateReleased,
                assistanceType: form.assistanceType,
                beneficiaryName: form.beneficiaryName,
                beneficiaryId: form.beneficiaryId,
                beneficiaryBarangay: form.beneficiaryBarangay,
                releasingOfficer: form.releasingOfficer,
                amount: amountNumber,
              }
            : item,
        ),
      );
      resetForm();
      return;
    }

    const newRecord: ReleaseRecord = {
      id: buildReleaseId(records),
      dateReleased: form.dateReleased,
      assistanceType: form.assistanceType,
      beneficiaryName: form.beneficiaryName,
      beneficiaryId: form.beneficiaryId,

      beneficiaryProvince: form.beneficiaryProvince,
      beneficiaryMunicipality: form.beneficiaryMunicipality,
      beneficiaryBarangay: form.beneficiaryBarangay,
      
      releasingOfficer: form.releasingOfficer,
      amount: amountNumber,
    };

    setRecords((current) => [newRecord, ...current]);
    resetForm();
  }

  function onEdit(item: ReleaseRecord) {
    setEditingId(item.id);
    setForm({
      dateReleased: item.dateReleased,
      assistanceType: item.assistanceType,
      beneficiaryName: item.beneficiaryName,
      beneficiaryId: item.beneficiaryId,
      beneficiaryProvince: item.beneficiaryProvince,
      beneficiaryMunicipality: item.beneficiaryMunicipality,
      beneficiaryBarangay: item.beneficiaryBarangay,
      releasingOfficer: item.releasingOfficer,
      amount: String(item.amount),
    });
  }

  function onDelete(id: string) {
    setRecords((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-teal-700 px-6 py-8 text-white sm:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-teal-200">
              Admin Module
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Distribution / Release Monitoring
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-200 sm:text-base">
              Record released assistance transactions with beneficiary details
              and releasing officer information.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Releases</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {summary.totalReleases}
            </p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 shadow-sm">
            <p className="text-sm text-teal-700">Released Amount</p>
            <p className="mt-1 text-xl font-semibold text-teal-900">
              {money.format(summary.totalAmount)}
            </p>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
            <p className="text-sm text-indigo-700">Unique Beneficiaries</p>
            <p className="mt-1 text-2xl font-semibold text-indigo-900">
              {summary.beneficiaries}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-sm text-amber-700">Releasing Officers</p>
            <p className="mt-1 text-2xl font-semibold text-amber-900">
              {summary.officers}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Update Release Record" : "Record Release"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Fill all required fields to log a release/distribution
              transaction.
            </p>

            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="dateReleased"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Date Released
                </label>
                <input
                  id="dateReleased"
                  required
                  type="date"
                  value={form.dateReleased}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      dateReleased: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                />
              </div>

              <div>
                <label
                  htmlFor="assistanceType"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Assistance Type
                </label>
                <select
                  id="assistanceType"
                  value={form.assistanceType}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      assistanceType: event.target.value as AssistanceType,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                >
                  {ASSISTANCE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="beneficiaryName"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Beneficiary Name
                </label>
                <input
                  id="beneficiaryName"
                  required
                  type="text"
                  value={form.beneficiaryName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      beneficiaryName: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                  placeholder="e.g., Maria Santos"
                />
              </div>

                <div>
                  <label
                    htmlFor="beneficiaryId"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Beneficiary ID
                  </label>
                  <input
                    id="beneficiaryId"
                    required
                    type="text"
                    value={form.beneficiaryId}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        beneficiaryId: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                    placeholder="e.g., BEN-210"
                  />
                </div>
              
              <div>
                <label
                    htmlFor="beneficiaryProvince"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Beneficiary Details (Province)
                  </label>
                <select
                  value={provinceCode}
                  onChange={(e) => {
                    const selectedCode = e.target.value;

                    const selectedProvince = provinces.find(
                      (p) => p.code === selectedCode
                    );

                    setProvinceCode(selectedCode);
                    setMunicipalityCode("");
                    setBarangays([]);
                    setMunicipalities([]);

                    setForm((current) => ({
                      ...current,
                      beneficiaryProvince: selectedProvince?.name || "",
                      beneficiaryMunicipality: "",
                      beneficiaryBarangay: "",
                    }));
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                >
                  <option value="">Select Province</option>

                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                    htmlFor="beneficiaryMunicipality"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Beneficiary Details (Municipality)
                </label>
                <select
                  disabled={!provinceCode}
                  value={municipalityCode}
                  onChange={(e) => {
                    const selectedCode = e.target.value;

                    const selectedMunicipality = municipalities.find(
                      (m) => m.code === selectedCode
                    );

                    setMunicipalityCode(selectedCode);

                    setForm((current) => ({
                      ...current,
                      beneficiaryMunicipality:
                        selectedMunicipality?.name || "",
                      beneficiaryBarangay: "",
                    }));
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                >
                  <option value="">Select Municipality</option>

                  {municipalities.map((municipality) => (
                    <option
                      key={municipality.code}
                      value={municipality.code}
                    >
                      {municipality.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                    htmlFor="beneficiaryBarangay"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Beneficiary Details (Barangay)
                </label>
                <select
                  disabled={!municipalityCode}
                  value={form.beneficiaryBarangay}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      beneficiaryBarangay: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                >
                  <option value="">Select Barangay</option>

                  {barangays.map((barangay) => (
                    <option
                      key={barangay.code}
                      value={barangay.name}
                    >
                      {barangay.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="releasingOfficer"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Releasing Officer
                </label>
                <input
                  id="releasingOfficer"
                  required
                  type="text"
                  value={form.releasingOfficer}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      releasingOfficer: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                  placeholder="e.g., Officer Carla Reyes"
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Amount Released (PHP)
                </label>
                <input
                  id="amount"
                  required
                  min={1}
                  type="number"
                  value={form.amount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                  placeholder="e.g., 5000"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  {editingId ? "Update Record" : "Save Record"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Release Records
            </h2>
            <p className="text-sm text-slate-600">
              View release history by assistance type, beneficiary details, and
              releasing officer.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by release ID, beneficiary, barangay, or officer"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
              />
              <select
                value={assistanceFilter}
                onChange={(event) =>
                  setAssistanceFilter(
                    event.target.value as AssistanceType | "All",
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
              >
                <option value="All">All Assistance Types</option>
                {ASSISTANCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Release</th>
                    <th className="px-4 py-3 font-semibold">Date Released</th>
                    <th className="px-4 py-3 font-semibold">Assistance Type</th>
                    <th className="px-4 py-3 font-semibold">
                      Beneficiary Details
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Releasing Officer
                    </th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {filteredRecords.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {item.id}
                      </td>
                      <td className="px-4 py-3">{item.dateReleased}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700">
                          {item.assistanceType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {item.beneficiaryName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.beneficiaryId}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.beneficiaryBarangay}
                        </p>
                      </td>
                      <td className="px-4 py-3">{item.releasingOfficer}</td>
                      <td className="px-4 py-3">{money.format(item.amount)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(item.id)}
                            className="rounded-md border border-rose-300 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRecords.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No release records match your search and assistance type
                  filter.
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
