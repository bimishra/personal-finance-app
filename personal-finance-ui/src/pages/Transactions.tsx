import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/state/slices/transactionsSlice';
import { fetchCategories } from '@/state/slices/categoriesSlice';
import { Transaction } from '@/types';
import Modal from '@/components/Modal';
import TransactionForm from '@/features/transactions/TransactionForm';
import { TransactionList } from '@/features/transactions/TransactionList';
import toast from 'react-hot-toast';
import SearchInput from '@/components/SearchInput';
import styles from './Transactions.module.css';
import layout from '@/styles/layout.module.css';

export default function Transactions() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s) => s.transactions.items);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

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

  const incomeTxns = transactions.filter(t => t.type === 'CREDIT');
  const expenseTxns = transactions.filter(t => t.type === 'DEBIT');
  const totalIncome = incomeTxns.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = expenseTxns.reduce((sum, t) => sum + Number(t.amount), 0);

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
              className={styles.newBtn}
            >
              <svg 
                className="w-4 h-4 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
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
      />

      {/* Modals - rendered at the end of the document */}
      <div className="relative z-50">
        {/* Create Transaction Modal */}
        {isCreateModalOpen && (
          <TransactionForm
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateTransaction}
          />
        )}

        {/* Edit Transaction Modal */}
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
