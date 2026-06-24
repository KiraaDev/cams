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
