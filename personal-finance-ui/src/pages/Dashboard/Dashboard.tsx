import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { fetchAccounts } from '@/state/slices/countSlice';
import { fetchTransactions } from '@/state/slices/transactionsSlice';
import { Card, Modal } from '@/components/common';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/currency';
import { TransactionsChart, calculateTransactionTotals, RecentTransactions, AccountsSummary } from '@/features/dashboard/components';
import type { Account, Transaction } from '@/types';
import { AccountForm } from '@/features/accounts/AccountForm';
import { useAccountForm } from '@/hooks/useAccountForm';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((s) => s.accounts.items);
  const txns = useAppSelector((s) => s.transactions.items);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');

  const totalBalance = useMemo(() => accounts.reduce((acc, a) => acc + Number(a.balance), 0), [accounts]);

  const transactionData = useMemo(() => {
    const validTransactions = txns.filter(txn => txn.txnDate !== undefined && txn.amount !== undefined && txn.type !== undefined).map(txn => ({ txnDate: txn.txnDate, amount: txn.amount, type: txn.type as 'CREDIT' | 'DEBIT' }));
    return { income: calculateTransactionTotals(validTransactions, timeframe, 'CREDIT'), expenses: calculateTransactionTotals(validTransactions, timeframe, 'DEBIT') };
  }, [txns, timeframe]);

  const totals = useMemo(() => {
    const start = timeframe === 'month' ? dayjs().startOf('month') : dayjs().startOf('year');
    const end = dayjs().endOf('day');
    let income = 0; let expense = 0;
    txns.forEach((t: Transaction) => { if (!t.txnDate) return; const d = dayjs(t.txnDate); if (d.isBefore(start) || d.isAfter(end)) return; const amt = Number(t.amount) || 0; if (t.type === 'CREDIT') income += amt; if (t.type === 'DEBIT') expense += amt; });
    return { income, expense, net: income - expense };
  }, [txns, timeframe]);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { formData, handleChange, handleSubmit, resetForm } = useAccountForm(() => { setIsAccountModalOpen(false); });
  const handleAccountModalClose = () => { setIsAccountModalOpen(false); resetForm(); };

  const exportCsv = () => {
    const rows = txns.slice(0, 200).map(t => ({ date: t.txnDate, description: t.description || '', amount: t.amount, currency: getCurrency(t.accountId || '') || '', type: t.type }));
    if (!rows.length) return; const header = Object.keys(rows[0]).join(',');
    const csv = [header].concat(rows.map(r => Object.values(r).map(v => `"${String(v ?? '')}"`).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `transactions-${dayjs().format('YYYYMMDD')}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const getCurrency = (accountId: string) => accounts.find(a => a.id === accountId)?.currency;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Dashboard</h1>
          <p className={styles.headerSubtitle}>Overview of balances, cashflow and recent activity.</p>
        </div>
        <div className={styles.headerControls}>
          <div className={styles.timeframe}>
            <label className={styles.timeframeLabel}>Timeframe</label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value as any)} className={styles.timeframeSelect}>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
          <button onClick={exportCsv} className={styles.btnExport}>Export</button>
        </div>
      </div>
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiMeta}>Income ({timeframe === 'month' ? 'This month' : 'This year'})</div>
            <div className={`${styles.kpiAmount} ${styles.kpiAmountGreen}`}>{formatCurrency(totals.income, '')}</div>
          </div>
          <div className={`${styles.kpiIcon} ${styles.kpiIconGreen}`}>⤴</div>
        </div>
        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiMeta}>Expenses ({timeframe === 'month' ? 'This month' : 'This year'})</div>
            <div className={`${styles.kpiAmount} ${styles.kpiAmountRed}`}>{formatCurrency(totals.expense, '')}</div>
          </div>
          <div className={`${styles.kpiIcon} ${styles.kpiIconRed}`}>⤵</div>
        </div>
        <div className={styles.kpiCard}>
          <div>
            <div className={styles.kpiMeta}>Net</div>
            <div className={`${styles.kpiAmount} ${totals.net >= 0 ? styles.netPositive : styles.netNegative}`}>{formatCurrency(totals.net, '')}</div>
          </div>
          <div className={`${styles.kpiIcon} ${styles.kpiIconIndigo}`}>Σ</div>
        </div>
      </div>
      <div className={styles.mainGrid}>
        <div>
          <Card title="Income & Expenses Overview">
            <div className={styles.stackMd}>
              <div className={styles.cardInnerHeader}>
                <div>
                  <div className={styles.totalBalanceLabel}>Total Balance</div>
                  <div className={styles.totalBalanceValue}>{formatCurrency(totalBalance, '')}</div>
                </div>
                <div className={`${styles.flexRow} ${styles.gapSm}`}>
                  <button onClick={() => setTimeframe('month')} className={`${styles.timeframeBtn} ${timeframe === 'month' ? styles.timeframeActive : styles.timeframeInactive}`}>Past Month</button>
                  <button onClick={() => setTimeframe('year')} className={`${styles.timeframeBtn} ${timeframe === 'year' ? styles.timeframeActive : styles.timeframeInactive}`}>Past Year</button>
                </div>
              </div>
              <div className={styles.chartGrid}>
                <div>
                  <h3 className={styles.sectionHeading}>Income</h3>
                  <TransactionsChart data={transactionData.income} timeframe={timeframe} type="income" />
                </div>
                <div>
                  <h3 className={styles.sectionHeading}>Expenses</h3>
                  <TransactionsChart data={transactionData.expenses} timeframe={timeframe} type="expense" />
                </div>
              </div>
            </div>
          </Card>
          <div className={styles.sectionSpacer}>
            <Card title="Recent Transactions">
              <RecentTransactions transactions={txns.slice(0, 10)} getCurrency={getCurrency} />
              <div className={`${styles.sectionSpacer} ${styles.textRight}`}><Link className={styles.linkSmall} to="/transactions">View all transactions</Link></div>
            </Card>
          </div>
        </div>
        <div>
          <Card title="Accounts">
            <div className={styles.stackMd}>
              <AccountsSummary accounts={accounts} />
              <div className={styles.spacerTopSm}>
                <button onClick={() => setIsAccountModalOpen(true)} className="btn btnPrimary">New account</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Modal title="Create Account" open={isAccountModalOpen} onClose={handleAccountModalClose}>
        <AccountForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} onCancel={handleAccountModalClose} />
      </Modal>
    </div>
  );
}
