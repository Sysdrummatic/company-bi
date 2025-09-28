import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Company, CompanyPayload } from '@/types/company';
import { supabase } from '@/integrations/supabase/client';

interface FetchCompaniesOptions {
  mine?: boolean;
  userId?: string | null;
}

const fetchCompanies = async ({ mine = false, userId }: FetchCompaniesOptions = {}): Promise<Company[]> => {
  let query = supabase.from('companies').select('*');
  
  if (mine && userId) {
    query = query.eq('user_id', userId);
  } else {
    query = query.eq('is_public', true);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    throw new Error('Nie udało się pobrać listy firm');
  }
  
  return data || [];
};

interface UseCompaniesOptions extends FetchCompaniesOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useCompanies = ({ mine = false, userId, enabled = true, staleTime = 1000 * 60 * 5 }: UseCompaniesOptions = {}) =>
  useQuery({
    queryKey: ['companies', mine ? 'mine' : 'public', userId ?? null],
    queryFn: () => fetchCompanies({ mine, userId }),
    enabled: enabled && (!mine || Boolean(userId)),
    staleTime,
  });

export const fetchCompanyById = async (id: string): Promise<Company | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error('Nie udało się pobrać danych firmy');
  }

  return data;
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
