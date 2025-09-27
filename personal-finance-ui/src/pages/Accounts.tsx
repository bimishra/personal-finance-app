import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { fetchAccounts } from '@/state/slices/countSlice';
import Modal from '@/components/Modal';
import { AccountForm } from '@/features/accounts/AccountForm';
import { AccountList } from '@/features/accounts/AccountList';
import { useAccountForm } from '@/features/accounts/useAccountForm';
import SearchInput from '@/components/SearchInput';
import styles from './Accounts.module.css';

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
    <div className={styles.container}>
      <div className={styles.spacer}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Accounts</h1>
            <p className={styles.subtitle}>Overview of your accounts — balances, type and recent activity.</p>
          </div>

          <div className={styles.headerRight}>
            <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search accounts" ariaLabel="Search accounts" onClear={() => setQuery('')} />

            <button
              onClick={() => setIsModalOpen(true)}
              className={styles.newBtn}
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
