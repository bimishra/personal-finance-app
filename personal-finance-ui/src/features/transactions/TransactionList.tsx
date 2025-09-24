import React from 'react';
import { Transaction } from '@/types';
import TransactionTable from './TransactionTable';
import { TransactionSummaryCards } from './components/TransactionSummaryCards';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => Promise<void>;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <TransactionSummaryCards transactions={transactions} />

      {transactions.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-center px-6 py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Transactions Yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first transaction.</p>
          </div>
        </div>
      ) : (
        /* Transaction Table */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <TransactionTable
            transactions={transactions}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
};