import React from 'react';
import { Transaction } from '@/types';
import TransactionTable from './TransactionTable';

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
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="text-center p-8 text-gray-500">
          No transactions found. Create your first transaction to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <TransactionTable
        transactions={transactions}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};