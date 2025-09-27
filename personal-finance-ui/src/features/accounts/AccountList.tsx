import React, { useState, useRef, useEffect } from 'react';
import { Account } from './types';
import { formatCurrency } from '@/utils/currency';
import Card from '@/components/Card';
import { AccountActions } from './AccountActions';
import styles from './AccountList.module.css';

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
      <div className={styles.empty}>
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
      <Card key={account.id} className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.headerRow}>
            <div className={styles.left}>
              <div aria-hidden className={styles.avatar}>{(account.name || '').slice(0,2).toUpperCase()}</div>

              <div className={styles.nameBlock}>
                <h3
                  ref={nameRef}
                  className={styles.name}
                  title={isTruncated ? account.name : undefined}
                  aria-label={account.name}
                >
                  {account.name}
                </h3>
                <div className={styles.meta}>
                  <span className={`${styles.typeBadge} ${getAccountTypeColor(account.type)}`}>
                    {account.type.replace('_', ' ')}
                  </span>
                  {account.transactionCount !== undefined && (
                    <span className={styles.txnCount}>{account.transactionCount} txn{account.transactionCount !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.balanceBlock}>
              <div className={styles.balanceLabel}>Balance</div>
              <div className={styles.balanceAmount}>{formatCurrency(account.balance, account.currency)}</div>
              <div className={styles.balanceCurrency}>{account.currency}</div>
            </div>
          </div>

          <div className={styles.footerRow}>
            <div className={styles.createdAt + (account.createdAt ? '' : ' ' + styles.italic)}>
              {account.createdAt ? (
                <div>Created: {new Date(account.createdAt).toLocaleDateString()}</div>
              ) : (
                <div className={styles.italic}>No created date</div>
              )}
            </div>

            <div className={styles.actions}>
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