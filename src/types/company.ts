export interface Company {
  id: string;
  company_name: string;
  krs_nip_or_hrb: string | null;
  status: string;
  description: string | null;
  country: string | null;
  industry: string | null;
  employee_count: string | null;
  founded_year: number | null;
  address: string | null;
  website: string | null;
  contact_email: string | null;
  phone_number: string | null;
  revenue: string | null;
  management: string[];
  products_and_services: string[];
  technologies_used: string[];
  last_updated: string | null;
  user_id: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyPayload {
  company_name: string;
  krs_nip_or_hrb?: string;
  status?: string;
  description?: string;
  country?: string;
  industry?: string;
  employee_count?: string;
  founded_year?: number;
  address?: string;
  website?: string;
  contact_email?: string;
  phone_number?: string;
  revenue?: string;
  management?: string[];
  products_and_services?: string[];
  technologies_used?: string[];
  is_public?: boolean;
}