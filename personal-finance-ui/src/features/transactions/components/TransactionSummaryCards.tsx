import React from 'react';
import { Transaction } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import styles from './TransactionSummaryCards.module.css';

interface TransactionSummaryCardsProps {
  transactions: Transaction[];
}

export const TransactionSummaryCards: React.FC<TransactionSummaryCardsProps> = ({ transactions }) => {
  const { formatAmount } = useCurrency();
  const totalIncome = transactions
    .filter(t => t.type === 'CREDIT')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'DEBIT')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netAmount = totalIncome - totalExpense;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={`${styles.iconBox} ${styles.iconBlue}`}>
            <svg className={`${styles.svg} ${styles.svgBlue}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className={styles.label}>Transactions</p>
            <p className={styles.value}>
              {transactions.length.toLocaleString()}
              <span className={styles.totalSuffix}>total</span>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={`${styles.iconBox} ${styles.iconGreen}`}>
            <svg className={`${styles.svg} ${styles.svgGreen}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className={styles.label}>Income</p>
            <p className={`${styles.value} ${styles.valueGreen}`}>
              {formatAmount(totalIncome)}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={`${styles.iconBox} ${styles.iconRed}`}>
            <svg className={`${styles.svg} ${styles.svgRed}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
          <div>
            <p className={styles.label}>Expenses</p>
            <p className={`${styles.value} ${styles.valueRed}`}>
              {formatAmount(totalExpense)}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={`${styles.iconBox} ${styles.iconIndigo}`}>
            <svg className={`${styles.svg} ${styles.svgIndigo}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className={styles.label}>Net Balance</p>
            <div className={styles.baseline}>
              <p className={`${styles.value} ${netAmount >= 0 ? styles.valueGreen : styles.valueRed}`}>
                {formatAmount(Math.abs(netAmount))}
              </p>
              <span className={`${styles.delta} ${netAmount >= 0 ? styles.deltaUp : styles.deltaDown}`}>
                {netAmount >= 0 ? '↑' : '↓'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};