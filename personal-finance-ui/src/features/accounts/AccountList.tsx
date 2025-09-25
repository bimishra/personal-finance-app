import React, { useState, useRef, useEffect } from 'react';
import { Account } from './types';
import { formatCurrency } from '@/utils/currency';
import Card from '@/components/Card';
import { AccountActions } from './AccountActions';

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

  // Inner per-account card component to allow per-card hooks (measuring truncation)
  const AccountCard: React.FC<{ account: Account }> = ({ account }) => {
    const nameRef = useRef<HTMLHeadingElement | null>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
      const el = nameRef.current;
      if (!el) return;

      const check = () => {
        // scrollWidth > clientWidth means the text is truncated
        setIsTruncated(el.scrollWidth > el.clientWidth + 1);
      };

      check();
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }, [account.name]);

    return (
      <Card key={account.id} className="h-full overflow-hidden">
        <div className="p-4 group hover:shadow-md transition-shadow duration-150 ease-in-out">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div aria-hidden className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 font-semibold text-lg">{(account.name || '').slice(0,2).toUpperCase()}</div>

              <div className="min-w-0">
                <h3
                  ref={nameRef}
                  className="text-sm font-medium text-gray-900 truncate"
                  title={isTruncated ? account.name : undefined}
                  aria-label={account.name}
                >
                  {account.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getAccountTypeColor(account.type)}`}>
                    {account.type.replace('_', ' ')}
                  </span>
                  {account.transactionCount !== undefined && (
                    <span className="text-xs text-gray-500">{account.transactionCount} txn{account.transactionCount !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Balance</div>
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(account.balance, account.currency)}</div>
              <div className="text-xs text-gray-500 mt-1">{account.currency}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {account.createdAt ? (
                <div>Created: {new Date(account.createdAt).toLocaleDateString()}</div>
              ) : (
                <div className="italic text-gray-400">No created date</div>
              )}
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <AccountActions
                account={account}
                hasTransactions={Boolean(account.transactionCount)}
              />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
};