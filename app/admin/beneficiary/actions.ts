"use server";

import { createClient } from "@/lib/supabase/server";
import { Beneficiary } from "@/types/beneficiary";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const getAssistanceCategories = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("assistance_categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const getBeneficiaries = async (): Promise<Beneficiary[]> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("beneficiaries")
    .select(
      `
      id,
      full_name,
      address,
      contact_number,
      created_at,
      updated_at,
      created_by_user_id,
      assistance_category_id,
      assistance_categories (
        id,
        category_name,
        description,
        created_at
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((b: any) => ({
    ...b,
    assistance_categories: b.assistance_categories ?? null,
  }));
};

export const createBeneficiary = async (formData: FormData) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const full_name = formData.get("full_name") as string;
  const address = formData.get("address") as string;
  const contact_number = formData.get("contact_number") as string;
  const assistance_category_id = Number(formData.get("assistance_category_id"));

  const { error } = await supabase.from("beneficiaries").insert({
    full_name,
    address,
    contact_number,
    assistance_category_id,
    created_by_user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/beneficiaries");
};

export async function updateBeneficiary(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id) {
    return { success: false, error: "Invalid beneficiary ID" };
  }

  // Normalize + type-safe extraction
  const full_name = formData.get("full_name")?.toString().trim();
  const address = formData.get("address")?.toString().trim();
  const contact_number = formData.get("contact_number")?.toString().trim();
  const assistance_category_id = formData.get("assistance_category_id")?.toString();

  if (!full_name || !address || !assistance_category_id) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("beneficiaries")
      .update({
        full_name,
        address,
        contact_number: contact_number || null,
        assistance_category_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard/beneficiaries");

    return { success: true };
  } catch (err: any) {
    console.error("Failed to update beneficiary:", err);

    return {
      success: false,
      error: err.message || "Unknown error",
    };
  }
}

export async function deleteBeneficiary(id: number) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("beneficiaries")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Refresh the Next.js cache for the beneficiaries dashboard page
    revalidatePath("/dashboard/beneficiaries");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete beneficiary:", err);
    return { success: false, error: err.message || "Something went wrong" };
  }
}