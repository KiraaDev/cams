"use server"

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const getBeneficiaryReport = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("beneficiaries")
    .select(`
      id,
      full_name,
      address,
      contact_number,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const getApplicationStatusSummary = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("applications")
    .select("status");

  if (error) throw new Error(error.message);

  const summary = data.reduce(
    (acc: Record<string, number>, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return summary;
};

// 1. Update your type to expect an array from the Supabase join
type ApplicationWithProgram = {
  program_id: number;
  status: "Pending" | "Approved" | "Rejected" | "Released";
  programs: {
    id: number;
    program_name: string;
  }[]; // <--- Changed this to an array to match Supabase's output
};

export const getProgramUtilizationReport = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data, error } = await supabase
    .from("applications")
    .select(`
      program_id,
      status,
      programs:programs (
        id,
        program_name
      )
    `);
    
  if (error) throw new Error(error.message);

  // Now this casting works perfectly without warnings
  const typedData = (data || []) as ApplicationWithProgram[];

  const grouped = typedData.reduce((acc, item) => {
    // 2. Safe access: Extract the first program from the array
    const program = Array.isArray(item.programs) ? item.programs[0] : item.programs;
    
    // If for some reason the application has no program, skip it safely
    if (!program) return acc; 

    const key = program.program_name;

    if (!acc[key]) {
      acc[key] = {
        total: 0,
        Pending: 0,
        Approved: 0,
        Rejected: 0,
        Released: 0,
      };
    }

    acc[key].total += 1;
    acc[key][item.status] += 1;

    return acc;
  }, {} as Record<string, { total: number; Pending: number; Approved: number; Rejected: number; Released: number; }>);

  return grouped;
};