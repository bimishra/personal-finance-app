import React from 'react';
import { Account } from '@/features/accounts/types';
import { formatCurrency } from '@/utils/currency';

interface AccountsSummaryProps {
  accounts: Account[];
}

export const AccountsSummary: React.FC<AccountsSummaryProps> = ({ accounts }) => {
  return (
    <ul>
      {accounts.map((a) => (
        <li key={a.id} className="py-2 border-b last:border-b-0">
          <div className="flex justify-between">
            <div>
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-gray-500">{a.currency || 'USD'}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{formatCurrency(a.balance, '')}</div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};