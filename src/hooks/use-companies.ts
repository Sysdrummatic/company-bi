import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Company, CompanyPayload } from '@/types/company';
import { supabase } from '@/integrations/supabase/client';
import { mockCompanyService } from '@/data/mock-companies';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

interface FetchCompaniesOptions {
  mine?: boolean;
  userId?: string | null;
}

const fetchCompanies = async ({ mine = false, userId }: FetchCompaniesOptions = {}): Promise<Company[]> => {
  if (USE_MOCK_DATA) {
    console.log("Using Mock Data");
    return mockCompanyService.getCompanies();
  }

  try {
    let query = supabase.from('companies').select('*');

    if (mine && userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.warn("Falling back to Mock Data due to error:", error);
    return mockCompanyService.getCompanies();
  }
};

interface UseCompaniesOptions extends FetchCompaniesOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useCompanies = ({ mine = false, userId, enabled = true, staleTime = 1000 * 60 * 5 }: UseCompaniesOptions = {}) =>
  useQuery({
    queryKey: ['companies', mine ? 'mine' : 'public', userId ?? null],
    queryFn: () => fetchCompanies({ mine, userId }),
    enabled: enabled && (!mine || Boolean(userId) || USE_MOCK_DATA), // Allow mock data even if not logged in
    staleTime,
  });

export const fetchCompanyById = async (id: string): Promise<Company | null> => {
  if (USE_MOCK_DATA) {
    return mockCompanyService.getCompanyById(id);
  }

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn("Falling back to Mock Data for details:", error);
    return mockCompanyService.getCompanyById(id);
  }
};

export const useCompany = (id?: string) =>
  useQuery({
    queryKey: ['companies', id],
    queryFn: () => fetchCompanyById(id as string),
    enabled: Boolean(id),
  });

const createCompanyRequest = async (payload: CompanyPayload, userId: string): Promise<Company> => {
  const { data, error } = await supabase
    .from('companies')
    .insert({
      ...payload,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error('Nie udało się zapisać firmy');
  }

  return data;
};

export const useCreateCompany = (userId?: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CompanyPayload) => {
      if (!userId) {
        throw new Error('Brak autoryzacji.');
      }
      return createCompanyRequest(payload, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['companies', 'public'] });
    },
  });
};
