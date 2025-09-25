import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { fetchAccounts } from '../state/slices/countSlice';
import { fetchTransactions } from '../state/slices/transactionsSlice';
import Card from '../components/Card';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/currency';
import { TransactionsChart, calculateTransactionTotals } from '@/features/dashboard/TransactionsChart';
import { RecentTransactions } from '@/features/dashboard/RecentTransactions';
import { AccountsSummary } from '@/features/dashboard/AccountsSummary';
import type { Account, Transaction } from '@/types';
import Modal from '@/components/Modal';
import { AccountForm } from '@/features/accounts/AccountForm';
import { useAccountForm } from '@/features/accounts/useAccountForm';


export default function Dashboard() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((s) => s.accounts.items);
  const txns = useAppSelector((s) => s.transactions.items);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');

  const totalBalance = useMemo(
    () => accounts.reduce((acc, a) => acc + Number(a.balance), 0),
    [accounts]
  );

  const transactionData = useMemo(() => {
    const validTransactions = txns
      .filter((txn) => 
        txn.txnDate !== undefined && 
        txn.amount !== undefined && 
        txn.type !== undefined
      )
      .map(txn => ({
        txnDate: txn.txnDate,
        amount: txn.amount,
        type: txn.type as 'CREDIT' | 'DEBIT'
      }));

    return {
      income: calculateTransactionTotals(validTransactions, timeframe, 'CREDIT'),
      expenses: calculateTransactionTotals(validTransactions, timeframe, 'DEBIT')
    };
  }, [txns, timeframe]);

  // Compute simple totals for KPI cards (income / expenses / net) for the selected timeframe
  const totals = useMemo(() => {
    const start = timeframe === 'month' ? dayjs().startOf('month') : dayjs().startOf('year');
    const end = dayjs().endOf('day');

    let income = 0;
    let expense = 0;

    txns.forEach((t: Transaction) => {
      if (!t.txnDate) return;
      const d = dayjs(t.txnDate);
      if (d.isBefore(start) || d.isAfter(end)) return;
      const amt = Number(t.amount) || 0;
      if (t.type === 'CREDIT') income += amt;
      if (t.type === 'DEBIT') expense += amt;
    });

    return { income, expense, net: income - expense };
  }, [txns, timeframe]);

  // Account modal state + form handler (same behavior as Accounts page)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { formData, handleChange, handleSubmit, resetForm } = useAccountForm(() => {
    setIsAccountModalOpen(false);
  });

  const handleAccountModalClose = () => {
    setIsAccountModalOpen(false);
    resetForm();
  };

  // Export visible recent transactions to CSV
  const exportCsv = () => {
    const rows = txns.slice(0, 200).map((t) => ({
      date: t.txnDate,
      description: t.description || '',
      amount: t.amount,
      currency: getCurrency(t.accountId || '') || '',
      type: t.type,
    }));

    const header = Object.keys(rows[0] || {}).join(',');
    const csv = [header]
      .concat(rows.map(r => Object.values(r).map(v => `"${String(v ?? '')}"`).join(',')))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${dayjs().format('YYYYMMDD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCurrency = (accountId: string) =>
    accounts.find((a) => a.id === accountId)?.currency;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Overview of balances, cashflow and recent activity.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1">
            <label className="text-xs text-gray-500">Timeframe</label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value as any)} className="text-sm bg-transparent">
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>

          <button onClick={exportCsv} className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50">
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Income ({timeframe === 'month' ? 'This month' : 'This year'})</div>
            <div className="text-xl font-semibold text-green-700">{formatCurrency(totals.income, '')}</div>
          </div>
          <div className="text-green-100 bg-green-50 rounded-full w-10 h-10 flex items-center justify-center">⤴</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Expenses ({timeframe === 'month' ? 'This month' : 'This year'})</div>
            <div className="text-xl font-semibold text-red-600">{formatCurrency(totals.expense, '')}</div>
          </div>
          <div className="text-red-100 bg-red-50 rounded-full w-10 h-10 flex items-center justify-center">⤵</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Net</div>
            <div className={`text-xl font-semibold ${totals.net >= 0 ? 'text-gray-900' : 'text-red-600'}`}>{formatCurrency(totals.net, '')}</div>
          </div>
          <div className="text-indigo-100 bg-indigo-50 rounded-full w-10 h-10 flex items-center justify-center">Σ</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card title="Income & Expenses Overview">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Total Balance</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalBalance, '')}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimeframe('month')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      timeframe === 'month'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Past Month
                  </button>
                  <button
                    onClick={() => setTimeframe('year')}
                    className={`px-3 py-1 rounded-md text-sm ${
                      timeframe === 'year'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Past Year
                  </button>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Income</h3>
                  <TransactionsChart 
                    data={transactionData.income} 
                    timeframe={timeframe}
                    type="income"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Expenses</h3>
                  <TransactionsChart 
                    data={transactionData.expenses} 
                    timeframe={timeframe}
                    type="expense"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <Card title="Recent Transactions">
              <RecentTransactions
                transactions={txns.slice(0, 10)}
                getCurrency={getCurrency}
              />
              <div className="mt-4 text-right">
                <Link className="text-sm text-indigo-600 hover:underline" to="/transactions">View all transactions</Link>
              </div>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card title="Accounts">
            <div className="space-y-4">
              <AccountsSummary accounts={accounts} />
              <div className="pt-2">
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                >
                  New account
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {/* Account creation modal (reuses Accounts page form) */}
      <Modal title="Create Account" open={isAccountModalOpen} onClose={handleAccountModalClose}>
        <AccountForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleAccountModalClose}
        />
      </Modal>
    </div>
  );
}

