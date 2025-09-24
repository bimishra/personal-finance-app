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

export default function Transactions() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((s) => s.transactions.items);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          New Transaction
        </button>
      </div>

      <TransactionList
        transactions={transactions}
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
