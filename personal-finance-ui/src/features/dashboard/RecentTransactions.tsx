import React from 'react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface RecentTransactionsProps {
  transactions: Transaction[];
  getCurrency: (accountId: string) => string | undefined;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  getCurrency,
}) => {
  return (
    <ul className="divide-y">
      {transactions.map((t) => (
        <li key={t.id} className="py-3 flex justify-between">
          <div>
            <div className="font-medium">{t.description || '—'}</div>
            <div className="text-sm text-gray-500">{t.txnDate}</div>
          </div>
          <div
            className={`font-semibold ${
              t.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {t.type === 'CREDIT' ? '+' : '-'}
            {formatCurrency(t.amount, getCurrency(t.accountId) || 'USD')}
          </div>
        </li>
      ))}
    </ul>
  );
};