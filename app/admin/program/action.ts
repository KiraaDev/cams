"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const getPrograms = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

type SubmitProgramPayload = {
  program_code: string | null;
  program_name: string;
  description: string | null;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
};

export async function onSubmitPrograms(payload: SubmitProgramPayload) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!payload.program_name.trim()) {
    return { ok: false, error: "Program name is required." };
  }

  const { error } = await supabase.from("programs").insert({
    program_code: payload.program_code,
    program_name: payload.program_name.trim(),
    description: payload.description,
    budget: payload.budget,
    start_date: payload.start_date,
    end_date: payload.end_date,
    is_active: payload.is_active,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/program");

  return { ok: true };
}

export async function updateProgram(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const id = Number(formData.get("id"));
  const program_name = formData.get("program_name")?.toString().trim() ?? "";
  const program_code = formData.get("program_code")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || null;
  const budgetRaw = formData.get("budget")?.toString().trim() ?? "";
  const start_date = formData.get("start_date")?.toString() || null;
  const end_date = formData.get("end_date")?.toString() || null;
  const is_active = formData.get("is_active")?.toString() === "true";

  if (!id || Number.isNaN(id)) {
    return { success: false, error: "Invalid program ID." };
  }

  if (!program_name) {
    return { success: false, error: "Program name is required." };
  }

  const budget = budgetRaw ? Number(budgetRaw) : null;
  if (budgetRaw && (Number.isNaN(budget) || budget! < 0)) {
    return {
      success: false,
      error: "Budget must be a valid non-negative number.",
    };
  }

  const { error } = await supabase
    .from("programs")
    .update({
      program_code,
      program_name,
      description,
      budget,
      start_date,
      end_date,
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/program");
  return { success: true };
}

export async function deleteProgram(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!id || Number.isNaN(id)) {
    return { success: false, error: "Invalid program ID." };
  }

  // Prevent FK failures and provide a clearer message before delete attempt.
  const { count: linkedApplicationCount, error: linkedCountError } =
    await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("program_id", id);

  if (linkedCountError) {
    return { success: false, error: linkedCountError.message };
  }

  if ((linkedApplicationCount ?? 0) > 0) {
    return {
      success: false,
      error:
        "Cannot delete this program because it is linked to existing applications. Remove linked applications first.",
    };
  }

  const { data, error } = await supabase
    .from("programs")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    return {
      success: false,
      error:
        "Delete did not complete. The record may not exist anymore or your account may not have delete permission.",
    };
  }

  revalidatePath("/admin/program");
  return { success: true };
}
