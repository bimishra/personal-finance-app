import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { fetchAccounts } from '@/state/slices/countSlice';
import Modal from '@/components/Modal';
import { AccountForm } from '@/features/accounts/AccountForm';
import { AccountList } from '@/features/accounts/AccountList';
import { useAccountForm } from '@/features/accounts/useAccountForm';
import SearchInput from '@/components/SearchInput';

export default function Accounts() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((s) => s.accounts.items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
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

  const filtered = accounts.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
            <p className="mt-1 text-sm text-gray-600">Overview of your accounts — balances, type and recent activity.</p>
          </div>

          <div className="flex items-center gap-3">
            <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search accounts" ariaLabel="Search accounts" onClear={() => setQuery('')} />

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Account
            </button>
          </div>
        </div>
      </div>

      <AccountList accounts={filtered} />

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
