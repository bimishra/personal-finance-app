import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { fetchAccounts } from '../state/slices/countSlice';
import { fetchTransactions } from '../state/slices/transactionsSlice';
import Card from '../components/Card';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/currency';
import { TransactionChart } from '@/features/dashboard/TransactionChart';
import { RecentTransactions } from '@/features/dashboard/RecentTransactions';
import { AccountsSummary } from '@/features/dashboard/AccountsSummary';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((s) => s.accounts.items);
  const txns = useAppSelector((s) => s.transactions.items);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const chartData = useMemo(
    () =>
      txns.slice(0, 12).map((t) => ({
        date: dayjs(t.txnDate).format('MMM D'),
        amount: Number(t.amount),
      })),
    [txns]
  );

  const totalBalance = useMemo(
    () => accounts.reduce((acc, a) => acc + Number(a.balance), 0),
    [accounts]
  );

  const getCurrency = (accountId: string) =>
    accounts.find((a) => a.id === accountId)?.currency;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card title="Overview">
          <div className="flex gap-6">
            <div className="w-1/3">
              <div className="text-sm text-gray-500">Total Balance</div>
              <div className="text-2xl font-bold">
                {formatCurrency(totalBalance, '')}
              </div>
            </div>
            <div className="w-2/3">
              <TransactionChart data={chartData} />
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Card title="Recent Transactions">
            <RecentTransactions
              transactions={txns.slice(0, 8)}
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
