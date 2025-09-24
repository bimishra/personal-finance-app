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

  const incomeTxns = transactions.filter(t => t.type === 'CREDIT');
  const expenseTxns = transactions.filter(t => t.type === 'DEBIT');
  const totalIncome = incomeTxns.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = expenseTxns.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">Transactions</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your income and expense transactions
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
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
