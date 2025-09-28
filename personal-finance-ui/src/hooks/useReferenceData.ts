import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Account } from '@/features/accounts/types';
import { Category } from '@/types';

// Query Keys
const ACCOUNTS_KEY = ['accounts'];
const CATEGORIES_KEY = ['categories'];

export function useAccounts() {
  return useQuery({
    queryKey: ACCOUNTS_KEY,
    queryFn: async () => {
      const res = await api.get<Account[]>('/accounts');
      return res.data;
    }
  });
}

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: async () => {
      const res = await api.get<Category[]>('/categories');
      return res.data;
    }
  });
}

export function useAccountMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: async (payload: Partial<Account>) => {
      const res = await api.post<Account>('/accounts', payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACCOUNTS_KEY });
    }
  });
  const update = useMutation({
    mutationFn: async (acct: Account) => {
      const res = await api.put<Account>(`/accounts/${acct.id}`, acct);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ACCOUNTS_KEY })
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/accounts/${id}`);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ACCOUNTS_KEY })
  });
  return { create, update, remove };
}

export function useCategoryMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'userId' | 'defaultCategory' | 'createdAt' | 'updatedAt'>) => {
      const res = await api.post<Category>('/categories', category);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY })
  });
  const update = useMutation({
    mutationFn: async (payload: { id: string } & Partial<Category>) => {
      const { id, ...rest } = payload;
      const res = await api.put<Category>(`/categories/${id}`, rest);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY })
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY })
  });
  return { create, update, remove };
}
