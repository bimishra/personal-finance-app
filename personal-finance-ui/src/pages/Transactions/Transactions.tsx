import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction, clearAccountFilter } from '@/state/slices/transactionsSlice';
import { useCategories } from '@/hooks/useReferenceData';
import { Transaction } from '@/types';
import { Modal, SearchInput } from '@/components/common';
import TransactionForm from '@/features/transactions/TransactionForm';
import { TransactionList } from '@/features/transactions/TransactionList';
import toast from 'react-hot-toast';
import styles from './Transactions.module.css';
import layout from '@/styles/layout.module.css';

export default function Transactions() {
  const dispatch = useAppDispatch();
  const {
    items: transactions,
    page,
    size,
    totalElements,
    totalPages,
    last,
    status
  } = useAppSelector((s) => s.transactions);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [query, setQuery] = useState('');
  const [localPageSize, setLocalPageSize] = useState(size);
  const [accountFilter, setAccountFilter] = useState<string>('ALL');

  const loadPage = useCallback((p: number, sz: number, acct?: string) => {
    dispatch(fetchTransactions({ page: p, size: sz, accountId: acct && acct !== 'ALL' ? acct : undefined }));
  }, [dispatch]);

  const location = useLocation();

  // On first entry or re-entry always reset to ALL accounts and fetch unfiltered list.
  useEffect(() => {
    setAccountFilter('ALL');
    dispatch(clearAccountFilter());
    loadPage(0, localPageSize, 'ALL');
    return () => {
      // Cleanup: ensure slice filter is cleared when leaving route.
      dispatch(clearAccountFilter());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // If the server clamps / alters the actual page size, keep the local selector in sync.
  useEffect(() => {
    if (size !== localPageSize) {
      setLocalPageSize(size);
    }
  }, [size, localPageSize]);

  const handlePageChange = (p: number) => {
    loadPage(p, localPageSize, accountFilter);
  };

  const handlePageSizeChange = (sz: number) => {
    setLocalPageSize(sz);
    loadPage(0, sz, accountFilter);
  };

  const handleAccountFilterChange = (acctId: string) => {
    if (acctId === accountFilter) return; // avoid duplicate fetch when unchanged
    setAccountFilter(acctId);
    loadPage(0, localPageSize, acctId);
  };

  const handleCreateTransaction = async (transaction: Transaction, keepOpen?: boolean) => {
    try {
      await dispatch(createTransaction(transaction)).unwrap();
      toast.success('Transaction created successfully');
      if (!keepOpen) setIsCreateModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create transaction');
      throw err;
    }
  };

  const handleUpdateTransaction = async (transaction: Transaction) => {
    try {
      await dispatch(updateTransaction(transaction)).unwrap();
      toast.success('Transaction updated successfully');
      setEditingTransaction(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update transaction');
      throw err;
    }
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
    try {
      await dispatch(deleteTransaction(transaction.id)).unwrap();
      toast.success('Transaction deleted successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete transaction');
      throw err;
    }
  };

  const filtered = transactions.filter(t => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(t.amount).toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q) ||
      (t.currency || '').toLowerCase().includes(q) ||
      (t.txnDate || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className={layout.container}>
      <div className={styles.spacer}>
        <div className={styles.headerWrapper}>
          <div>
            <h1 className={styles.headerTitle}>Transactions</h1>
            <p className={styles.headerSub}>Manage your income and expense transactions</p>
          </div>

            <div className={styles.headerRight}>
            <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transactions" ariaLabel="Search transactions" onClear={() => setQuery('')} />

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btnPrimary"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Transaction
            </button>
          </div>
        </div>
      </div>

      <TransactionList
        transactions={filtered}
        onEdit={setEditingTransaction}
        onDelete={handleDeleteTransaction}
        page={page}
        size={size} // actual size from server for consistent range math
        totalElements={totalElements}
        totalPages={totalPages}
        last={last}
        loading={status === 'loading'}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onAccountFilterChange={handleAccountFilterChange}
        currentAccountId={accountFilter === 'ALL' ? null : accountFilter}
      />

      <div className="relative z-50">
        {isCreateModalOpen && (
          <TransactionForm
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateTransaction}
          />
        )}

        {editingTransaction && (
          <TransactionForm
            open={!!editingTransaction}
            onClose={() => setEditingTransaction(null)}
            initialValues={editingTransaction}
            onSubmit={handleUpdateTransaction}
          />
        )}
      </div>
    </div>
  );
}
