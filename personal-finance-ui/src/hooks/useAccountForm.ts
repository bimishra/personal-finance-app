import { useState, useCallback } from 'react';
import { useAppDispatch } from '@/state/hooks';
import { createAccount } from '@/state/slices/countSlice';
import { AccountFormData } from '@/features/accounts/types';
import toast from 'react-hot-toast';
import { handleApiError } from '@/utils/errorHandler';
import { AxiosError } from 'axios';
import { useCurrency } from '@/context/CurrencyContext';

const useDefaultFormState = (): AccountFormData => {
  const { defaultCurrency } = useCurrency();
  return {
    name: '',
    currency: defaultCurrency,
    type: 'SAVINGS',
    balance: 0
  };
};

export const useAccountForm = (onSuccess?: () => void) => {
  const dispatch = useAppDispatch();
  const defaultState = useDefaultFormState();
  const [formData, setFormData] = useState<AccountFormData>(defaultState);

  const handleChange = useCallback((field: keyof AccountFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.name.trim()) {
      toast.error('Account name is required');
      return;
    }

    try {
      await dispatch(createAccount(formData)).unwrap();
      toast.success('Account created successfully');
      setFormData(defaultState);
      onSuccess?.();
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  }, [dispatch, formData, onSuccess]);

  const resetForm = useCallback(() => {
    setFormData(defaultState);
  }, []);

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm
  };
};
