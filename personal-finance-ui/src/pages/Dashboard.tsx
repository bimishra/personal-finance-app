import React, { useState, useMemo, useEffect } from 'react';
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

  const getCurrency = (accountId: string) =>
    accounts.find((a) => a.id === accountId)?.currency;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card title="Income & Expenses Overview">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Total Balance</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalBalance, '')}
                </div>
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
          </Card>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card title="Accounts">
          <AccountsSummary accounts={accounts} />
        </Card>
      </div>
    </div>
  );
}
