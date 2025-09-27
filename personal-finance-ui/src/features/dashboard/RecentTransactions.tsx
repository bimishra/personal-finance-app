import React from 'react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/currency';
import styles from './RecentTransactions.module.css';

interface RecentTransactionsProps {
  transactions: Transaction[];
  getCurrency: (accountId: string) => string | undefined;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  getCurrency,
}) => {
  return (
    <ul className={styles.list + ' ' + styles.divider}>
      {transactions.map((t) => (
        <li key={t.id} className={styles.item}>
          <div className={styles.left}>
            <div className={styles.title}>{t.description || '\u2014'}</div>
            <div className={styles.date}>{t.txnDate}</div>
          </div>
          <div className={`${styles.amount} ${t.type === 'CREDIT' ? styles.credit : styles.debit}`}>
            {t.type === 'CREDIT' ? '+' : '-'}
            {formatCurrency(t.amount, getCurrency(t.accountId) || 'USD')}
          </div>
        </li>
      ))}
    </ul>
  );
};