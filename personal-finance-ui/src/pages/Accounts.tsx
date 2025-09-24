import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { fetchAccounts } from '@/state/slices/countSlice';
import Modal from '@/components/Modal';
import { AccountForm } from '@/features/accounts/AccountForm';
import { AccountList } from '@/features/accounts/AccountList';
import { useAccountForm } from '@/features/accounts/useAccountForm';

export default function Accounts() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((s) => s.accounts.items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { formData, handleChange, handleSubmit, resetForm } = useAccountForm(() => {
    setIsModalOpen(false);
  });

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          New Account
        </button>
      </div>

      <AccountList accounts={accounts} />

      <Modal title="Create Account" open={isModalOpen} onClose={handleModalClose}>
        <AccountForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  )
}
