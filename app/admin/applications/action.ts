"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const getApplications = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("applications").select(`
    *,
    beneficiary:beneficiaries (
      full_name
    ),
    program:programs (
      program_name
    )
  `);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

type SubmitApplicationPayload = {
  beneficiaryId: number;
  programId: number;
  status: "Pending" | "Approved" | "Rejected" | "Released";
  remarks: string | null;
};

export async function onSubmitApplications(payload: SubmitApplicationPayload) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error: userError?.message || "Unable to resolve current user.",
    };
  }

  const { error: insertError } = await supabase.from("applications").insert({
    beneficiary_id: payload.beneficiaryId,
    program_id: payload.programId,
    status: payload.status,
    remarks: payload.remarks,
    created_by_user_id: user.id,
  });

  if (insertError) {
    return {
      ok: false,
      error: insertError.message,
    };
  }

  revalidatePath("/admin/applications");

  return { ok: true };
}

export const createApplication = async (formData: FormData) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const beneficiary_id = Number(formData.get("beneficiaryId"));
  const program_id = Number(formData.get("programId"));
  const status = (formData.get("status") as string) || "Pending";
  const remarks = formData.get("remarks") as string;

  if (!beneficiary_id || !program_id) {
    throw new Error("Beneficiary and Program are required");
  }

  const { error } = await supabase.from("applications").insert({
    beneficiary_id,
    program_id,
    status,
    remarks: remarks?.trim() || null,
    created_by_user_id: user.id,
  });

  if (error) {
    // helpful for debugging unique constraint (beneficiary_id + program_id)
    throw new Error(error.message);
  }

  revalidatePath("/admin/applications");
};

export async function updateApplication(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const id = Number(formData.get("id"));
  const beneficiary_id = Number(formData.get("beneficiary_id"));
  const program_id = Number(formData.get("program_id"));
  const status = (formData.get("status") as string) || "Pending";
  const remarksRaw = formData.get("remarks")?.toString() ?? "";

  if (!id || Number.isNaN(id)) {
    return { success: false, error: "Invalid application ID." };
  }

  if (!beneficiary_id || Number.isNaN(beneficiary_id)) {
    return { success: false, error: "Beneficiary is required." };
  }

  if (!program_id || Number.isNaN(program_id)) {
    return { success: false, error: "Program is required." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("applications")
    .update({
      beneficiary_id,
      program_id,
      status,
      remarks: remarksRaw.trim() || null,
      reviewed_by_user_id: user?.id ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function deleteApplication(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!id || Number.isNaN(id)) {
    return { success: false, error: "Invalid application ID." };
  }

  const { data, error } = await supabase
    .from("applications")
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

  revalidatePath("/admin/applications");
  return { success: true };
}
