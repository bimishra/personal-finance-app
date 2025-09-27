import React from 'react';
import { Account } from '@/features/accounts/types';
import { formatCurrency } from '@/utils/currency';
import styles from './AccountsSummary.module.css';

interface AccountsSummaryProps {
  accounts: Account[];
}

export const AccountsSummary: React.FC<AccountsSummaryProps> = ({ accounts }) => {
  return (
    <ul className={styles.list}>
      {accounts.map((a) => (
        <li key={a.id} className={styles.item}>
          <div className={styles.row}>
            <div className={styles.meta}>
              <div className={styles.name}>{a.name}</div>
              <div className={styles.currency}>{a.currency || 'USD'}</div>
            </div>
            <div className={styles.amount}>
              {formatCurrency(a.balance, '')}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};