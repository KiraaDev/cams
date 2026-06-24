"use client";

import { createClient } from "@/lib/supabase/client";
import { FormEvent, useMemo, useState, useEffect } from "react";

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

// Hardcoded array mapping category IDs to names based on your assistance_categories lookup structure
type AssistanceCategory = {
  id: number;
  name: string;
};

const ASSISTANCE_CATEGORIES: AssistanceCategory[] = [
  { id: 1, name: "Cash Assistance" },
  { id: 2, name: "Food Pack" },
  { id: 3, name: "Medical Support" },
  { id: 4, name: "Education Grant" },
  { id: 5, name: "Livelihood Kit" },
];

type BeneficiaryRecord = {
  id: number; // bigserial from database
  full_name: string;
  address: string;
  contact_number: string;
  assistance_category_id: number;
  created_by_user_id: string;
  created_at: string;
};

type BeneficiaryForm = {
  full_name: string;
  contact_number: string;
  assistance_category_id: number;
  
  // Local states for structural cascading address composition
  provinceName: string;
  municipalityName: string;
  barangayName: string;
};

const initialForm: BeneficiaryForm = {
  full_name: "",
  contact_number: "",
  assistance_category_id: 1,
  provinceName: "",
  municipalityName: "",
  barangayName: "",
};

export default function ReleaseMonitoring() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<CityMunicipality[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);

  const [provinceCode, setProvinceCode] = useState("");
  const [municipalityCode, setMunicipalityCode] = useState("");

  const [provincesLoading, setProvincesLoading] = useState(false);
  const [provincesError, setProvincesError] = useState(false);
  const [municipalitiesLoading, setMunicipalitiesLoading] = useState(false);
  const [municipalitiesError, setMunicipalitiesError] = useState(false);
  const [barangaysLoading, setBarangaysLoading] = useState(false);
  const [barangaysError, setBarangaysError] = useState(false);

  // Database State Streams
  const [records, setRecords] = useState<BeneficiaryRecord[]>([]);
  const [form, setForm] = useState<BeneficiaryForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "All">("All");

  // Fetch from the public.beneficiaries table directly
  const fetchRecords = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("beneficiaries")
      .select("*")
      .order("created_at", { ascending: false });

      console.log(data)

    if (error) {
      console.error("Error fetching beneficiaries rows:", error);
      return;
    }
    if (data) setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // PSGC Side-Effect Handling
  useEffect(() => {
    setProvincesLoading(true);
    fetch("https://psgc.gitlab.io/api/provinces/")
      .then((res) => res.json())
      .then((data) => setProvinces(data.sort((a: Province, b: Province) => a.name.localeCompare(b.name))))
      .catch(() => setProvincesError(true))
      .finally(() => setProvincesLoading(false));
  }, []);

  useEffect(() => {
    if (!provinceCode) return;
    setMunicipalitiesLoading(true);
    fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`)
      .then((res) => res.json())
      .then((data) => setMunicipalities(data.sort((a: CityMunicipality, b: CityMunicipality) => a.name.localeCompare(b.name))))
      .catch(() => setMunicipalitiesError(true))
      .finally(() => setMunicipalitiesLoading(false));
  }, [provinceCode]);

  useEffect(() => {
    if (!municipalityCode) return;
    setBarangaysLoading(true);
    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${municipalityCode}/barangays/`)
      .then((res) => res.json())
      .then((data) => setBarangays(data.sort((a: Barangay, b: Barangay) => a.name.localeCompare(b.name))))
      .catch(() => setBarangaysError(true))
      .finally(() => setBarangaysLoading(false));
  }, [municipalityCode]);

  // Client Summaries calculated on the current dataset
  const summary = useMemo(() => {
    return {
      totalBeneficiaries: records.length,
      distinctCategories: new Set(records.map((item) => item.assistance_category_id)).size,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return records.filter((record) => {
      const matchesKeyword =
        keyword.length === 0 ||
        String(record.id).includes(keyword) ||
        record.full_name.toLowerCase().includes(keyword) ||
        record.address.toLowerCase().includes(keyword) ||
        (record.contact_number && record.contact_number.includes(keyword));

      const matchesCategory =
        categoryFilter === "All" || record.assistance_category_id === categoryFilter;

      return matchesKeyword && matchesCategory;
    });
  }, [records, searchText, categoryFilter]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setProvinceCode("");
    setMunicipalityCode("");
    setMunicipalities([]);
    setBarangays([]);
  }

  // Persisting data with Supabase targeting public.beneficiaries table schema
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();

    // Reconstruct compound address text string format
    const fullAddress = [form.barangayName, form.municipalityName, form.provinceName]
      .filter(Boolean)
      .join(", ");

    if (!form.full_name || !fullAddress) return;

    // Grab authenticated session profile to satisfy the created_by_user_id foreign key constraint
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      console.error("Missing valid user session token to satisfy DB foreign key constraint.");
      return;
    }

    if (editingId) {
      // Execute standard public table mutation update command matching your snippet design patterns
      const { error } = await supabase
        .from("beneficiaries")
        .update({
          full_name: form.full_name,
          address: fullAddress,
          contact_number: form.contact_number || null,
          assistance_category_id: form.assistance_category_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        console.error("Failed to execute update row mutation on database:", error);
        return;
      }
    } else {
      // Execute insert operation row append transaction
      const { error } = await supabase
        .from("beneficiaries")
        .insert([
          {
            full_name: form.full_name,
            address: fullAddress,
            contact_number: form.contact_number || null,
            assistance_category_id: form.assistance_category_id,
            created_by_user_id: userId,
          },
        ]);

      if (error) {
        console.error("Failed to write single row allocation parameters:", error);
        return;
      }
    }

    await fetchRecords();
    resetForm();
  }

  function onEdit(item: BeneficiaryRecord) {
    setEditingId(item.id);

    // Deconstruct historical address texts safely back into forms
    const segments = item.address.split(", ");
    const brgyName = segments[0] || "";
    const muniName = segments[1] || "";
    const provName = segments[2] || "";

    setForm({
      full_name: item.full_name,
      contact_number: item.contact_number || "",
      assistance_category_id: item.assistance_category_id,
      provinceName: provName,
      municipalityName: muniName,
      barangayName: brgyName,
    });
  }

  async function onDelete(id: number) {
    if (!window.confirm("Are you sure you want to remove this record from the beneficiaries list?")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("beneficiaries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to discard beneficiary records entry row data point:", error);
      return;
    }

    setRecords((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-700 px-6 py-8 text-white sm:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-teal-200">System Registry</p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Beneficiary Profile Registry</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-200 sm:text-base">
              Add and maintain historical beneficiary distribution listings structured on your physical schema layouts.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Enrolled Profiles</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.totalBeneficiaries}</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 shadow-sm">
            <p className="text-sm text-teal-700">Active Allocated Allocation Groups</p>
            <p className="mt-1 text-2xl font-semibold text-teal-900">{summary.distinctCategories}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Modify Beneficiary Data Card" : "Profile Enrolment Registration Form"}
            </h2>

            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <div>
                <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Legal Name
                </label>
                <input
                  id="full_name"
                  required
                  type="text"
                  value={form.full_name}
                  onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                  placeholder="First name, Middle Initial, Last name"
                />
              </div>

              <div>
                <label htmlFor="contact_number" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Contact Phone Number (Optional)
                </label>
                <input
                  id="contact_number"
                  type="text"
                  value={form.contact_number}
                  onChange={(event) => setForm((current) => ({ ...current, contact_number: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                  placeholder="e.g., 09123456789"
                />
              </div>

              <div>
                <label htmlFor="assistance_category_id" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Assistance Category Allocation Assignment
                </label>
                <select
                  id="assistance_category_id"
                  value={form.assistance_category_id}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, assistance_category_id: Number(event.target.value) }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
                >
                  {ASSISTANCE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Cascade Infrastructure Dropdown Panels */}
              <div>
                <label htmlFor="provSelect" className="mb-1.5 block text-sm font-medium text-slate-700">Address (Province)</label>
                <select
                  id="provSelect"
                  disabled={provincesLoading}
                  value={provinceCode}
                  onChange={(e) => {
                    const matched = provinces.find((p) => p.code === e.target.value);
                    setProvinceCode(e.target.value);
                    setMunicipalityCode("");
                    setBarangays([]);
                    setForm((current) => ({
                      ...current,
                      provinceName: matched?.name || "",
                      municipalityName: "",
                      barangayName: "",
                    }));
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring disabled:opacity-60"
                >
                  <option value="">Select Province</option>
                  {provinces.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="muniSelect" className="mb-1.5 block text-sm font-medium text-slate-700">Address (Municipality)</label>
                <select
                  id="muniSelect"
                  disabled={!provinceCode || municipalitiesLoading}
                  value={municipalityCode}
                  onChange={(e) => {
                    const matched = municipalities.find((m) => m.code === e.target.value);
                    setMunicipalityCode(e.target.value);
                    setForm((current) => ({
                      ...current,
                      municipalityName: matched?.name || "",
                      barangayName: "",
                    }));
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring disabled:opacity-60"
                >
                  <option value="">Select Municipality</option>
                  {municipalities.map((m) => <option key={m.code} value={m.code}>{m.name}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="brgySelect" className="mb-1.5 block text-sm font-medium text-slate-700">Address (Barangay)</label>
                <select
                  id="brgySelect"
                  disabled={!municipalityCode || barangaysLoading}
                  value={form.barangayName}
                  onChange={(e) => setForm((current) => ({ ...current, barangayName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring disabled:opacity-60"
                >
                  <option value="">Select Barangay</option>
                  {barangays.map((b) => <option key={b.code} value={b.name}>{b.name}</option>)}
                </select>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  {editingId ? "Update Data Profile" : "Enroll Record Profile Row"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel Action
                  </button>
                )}
              </div>
            </form>
          </article>

          {/* Database Log Rows Viewer */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Enrolled Registered Registry Lists</h2>
            
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by ID, name, or street addresses parameters..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
              />
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value === "All" ? "All" : Number(event.target.value))}
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-400 transition focus:border-teal-500 focus:ring"
              >
                <option value="All">All Categories</option>
                {ASSISTANCE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">DB ID</th>
                    <th className="px-4 py-3 font-semibold">Beneficiary Name</th>
                    <th className="px-4 py-3 font-semibold">Contact No.</th>
                    <th className="px-4 py-3 font-semibold">Full Address Information</th>
                    <th className="px-4 py-3 font-semibold">Assistance Allocated</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {filteredRecords.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-mono text-slate-500">#{item.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.full_name}</td>
                      <td className="px-4 py-3 text-slate-600">{item.contact_number || "—"}</td>
                      <td className="px-4 py-3 text-xs max-w-[200px] truncate" title={item.address}>{item.address}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700">
                          {ASSISTANCE_CATEGORIES.find((c) => c.id === item.assistance_category_id)?.name || `Cat #${item.assistance_category_id}`}
                        </span>
                      </td>
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
                  No matching production rows found inside beneficiaries context.
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}