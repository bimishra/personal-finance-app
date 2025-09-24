import { useState, useCallback } from 'react';
import { useAppDispatch } from '@/state/hooks';
import { createAccount } from '@/state/slices/countSlice';
import { AccountFormData } from './types';
import toast from 'react-hot-toast';
import { handleApiError } from '@/utils/errorHandler';
import { AxiosError } from 'axios';

const DEFAULT_FORM_STATE: AccountFormData = {
  name: '',
  currency: 'USD',
  type: 'SAVINGS',
  balance: 0
};

export const useAccountForm = (onSuccess?: () => void) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<AccountFormData>(DEFAULT_FORM_STATE);

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
      setFormData(DEFAULT_FORM_STATE);
      onSuccess?.();
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  }, [dispatch, formData, onSuccess]);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_STATE);
  }, []);

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm
  };
};