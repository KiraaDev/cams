import { AssistanceCategory } from "./assistance-category";

export type Beneficiary = {
  id: number;
  full_name: string;
  address: string;
  contact_number: string | null;

  assistance_category_id: number;
  created_by_user_id: string;

  created_at: string | null;
  updated_at: string | null;

  assistance_categories: AssistanceCategory;
};

export type CreateBeneficiary = {
  full_name: string;
  address: string;
  contact_number?: string | null;
  assistance_category_id: number;
  created_by_user_id: string;
};

export type UpdateBeneficiary = Partial<CreateBeneficiary>;