export interface ApplicationProps {
  id: number;
  beneficiary_id: number;
  program_id: number;
  status: string;
  remarks?: string;
  created_by_user_id: string;
  reviewed_by_user_id?: string;
  created_at: string;
  updated_at: string;
  beneficiary?: {
    full_name?: string;
    name?: string;
  } | null;
  program?: {
    program_name?: string;
    name?: string;
  } | null;
}
