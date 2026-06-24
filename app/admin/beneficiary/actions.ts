"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const getBeneficiaries = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("beneficiaries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};