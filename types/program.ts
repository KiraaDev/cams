export interface Program {
  id: number;
  program_code: string | null;
  program_name: string;
  description: string | null;
  budget: number | null;
  start_date: string | null; // YYYY-MM-DD
  end_date: string | null; // YYYY-MM-DD
  is_active: boolean | null;
  created_at: string | null; // ISO timestamp
  updated_at: string | null; // ISO timestamp
}
