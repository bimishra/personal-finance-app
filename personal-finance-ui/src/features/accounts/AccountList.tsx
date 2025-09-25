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
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-semibold">{(account.name || '').slice(0,2).toUpperCase()}</div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{account.name}</h3>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getAccountTypeColor(account.type)}`}>
                      {account.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(account.balance, account.currency)}</p>
                <p className="text-sm text-gray-500">{account.currency}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 space-y-1">
                {account.createdAt && (
                  <div>Created: {new Date(account.createdAt).toLocaleDateString()}</div>
                )}
                {account.transactionCount !== undefined && (
                  <div>Transactions: {account.transactionCount}</div>
                )}
              </div>

              <div>
                <AccountActions
                  account={account}
                  hasTransactions={Boolean(account.transactionCount)}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};