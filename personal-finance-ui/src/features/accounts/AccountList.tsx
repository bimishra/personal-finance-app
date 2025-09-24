import React from 'react';
import { Account } from './types';
import { formatCurrency } from '@/utils/currency';
import Card from '@/components/Card';
import { AccountActions } from './AccountActions';
import { useAppSelector } from '@/state/hooks';

interface AccountListProps {
  accounts: Account[];
}

export const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  const getAccountTypeColor = (type: Account['type']) => {
    const colors = {
      CURRENT: 'bg-blue-100 text-blue-800',
      SAVINGS: 'bg-green-100 text-green-800',
      CREDIT_CARD: 'bg-red-100 text-red-800',
      INVESTMENT: 'bg-purple-100 text-purple-800',
      CASH: 'bg-yellow-100 text-yellow-800',
      LOAN: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.CURRENT;
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No accounts found. Create your first account to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map((account) => (
        <Card key={account.id} className="h-full">
          <div className="p-4 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getAccountTypeColor(
                    account.type
                  )}`}
                >
                  {account.type.replace('_', ' ')}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(account.balance, account.currency)}
                </p>
                <p className="text-sm text-gray-500">{account.currency}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                {account.createdAt && (
                  <p className="text-xs text-gray-500">
                    Created: {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                )}
                {account.transactionCount !== undefined && (
                  <p className="text-xs text-gray-500">
                    Transactions: {account.transactionCount}
                  </p>
                )}
              </div>
              <AccountActions
                account={account}
                hasTransactions={Boolean(account.transactionCount)}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};