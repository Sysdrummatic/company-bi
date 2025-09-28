import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Company, CompanyPayload } from '@/types/company';
import { buildApiUrl } from '@/lib/api';

interface FetchCompaniesOptions {
  mine?: boolean;
  token?: string | null;
}

const fetchCompanies = async ({ mine = false, token }: FetchCompaniesOptions = {}): Promise<Company[]> => {
  const url = new URL(buildApiUrl('/api/companies'));

  if (mine) {
    url.searchParams.set('mine', 'true');
  }

  const response = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (response.status === 401) {
    throw new Error('Nie masz uprawnień do wyświetlenia tych danych.');
  }

  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy firm');
  }

  const data = (await response.json()) as Company[];
  return data;
};

interface UseCompaniesOptions extends FetchCompaniesOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useCompanies = ({ mine = false, token, enabled = true, staleTime = 1000 * 60 * 5 }: UseCompaniesOptions = {}) =>
  useQuery({
    queryKey: ['companies', mine ? 'mine' : 'public', token ?? null],
    queryFn: () => fetchCompanies({ mine, token }),
    enabled: enabled && (!mine || Boolean(token)),
    staleTime,
  });

export const fetchCompanyById = async (id: number, token?: string | null): Promise<Company | null> => {
  const response = await fetch(buildApiUrl(`/api/companies/${id}`), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (response.status === 404) {
    return null;
  }

  if (response.status === 403) {
    throw new Error('Nie masz dostępu do tej firmy.');
  }

  if (!response.ok) {
    throw new Error('Nie udało się pobrać danych firmy');
  }

  return (await response.json()) as Company;
};

export const useCompany = (id?: number, token?: string | null) =>
  useQuery({
    queryKey: ['companies', id, token ?? null],
    queryFn: () => fetchCompanyById(id as number, token),
    enabled: typeof id === 'number' && Number.isFinite(id),
  });

const createCompanyRequest = async (payload: CompanyPayload, token: string): Promise<Company> => {
  const response = await fetch(buildApiUrl('/api/companies'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Nie udało się zapisać firmy';
    try {
      const data = (await response.json()) as { message?: string };
      if (data?.message) {
        message = data.message;
      }
    } catch (error) {
      // ignore JSON errors
    }
    throw new Error(message);
  }

  return (await response.json()) as Company;
};

export const useCreateCompany = (token?: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CompanyPayload) => {
      if (!token) {
        throw new Error('Brak autoryzacji.');
      }
      return createCompanyRequest(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['companies', 'public'] });
    },
  });
};
