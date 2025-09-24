import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/currency';
import dayjs from 'dayjs';

interface ChartAccount {
  id: string;
  balance: string | number;
}

interface ChartTransaction {
  txnDate: string;
  amount: string;
  type: 'CREDIT' | 'DEBIT';
}

export interface BalanceDataPoint {
  date: string;
  balance: number;
}

interface BalanceChartProps {
  data: BalanceDataPoint[];
  timeframe: 'month' | 'year';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border">
        <p className="text-gray-600">{label}</p>
        <p className="font-semibold text-indigo-600">
          {formatCurrency(payload[0].value, '', true)}
        </p>
      </div>
    );
  }
  return null;
};

interface ChartAccountWithCreation extends ChartAccount {
  createdAt?: string;
}

export const calculateDailyBalances = (
  transactions: ChartTransaction[], 
  accounts: ChartAccountWithCreation[],
  timeframe: 'month' | 'year' = 'month'
): BalanceDataPoint[] => {
  // Get initial total balance from all accounts
  const currentTotalBalance = accounts.reduce((sum, acc) => {
    const balance = typeof acc.balance === 'string' ? Number(acc.balance) : acc.balance;
    return sum + balance;
  }, 0);

  // Find the earliest account creation date
  const earliestAccountDate = accounts.reduce<dayjs.Dayjs | null>((earliest, acc) => {
    if (!acc.createdAt) return earliest;
    const accountDate = dayjs(acc.createdAt);
    return !earliest || accountDate.isBefore(earliest) ? accountDate : earliest;
  }, null);
  
  // Sort transactions by date, newest first
  const sortedTransactions = [...transactions].sort((a, b) => 
    dayjs(b.txnDate).valueOf() - dayjs(a.txnDate).valueOf()
  );

  // Determine start date based on timeframe
  const now = dayjs();
  const timeframeStartDate = timeframe === 'month' ? 
    now.subtract(1, 'month').startOf('day') :
    now.subtract(1, 'year').startOf('month');

  // Use the later of timeframe start date or earliest account date
  const startDate = earliestAccountDate?.isAfter(timeframeStartDate)
    ? earliestAccountDate.startOf('day')
    : timeframeStartDate;

  // Filter transactions within timeframe and after account creation
  const relevantTransactions = sortedTransactions.filter(t => 
    dayjs(t.txnDate).isAfter(startDate) || dayjs(t.txnDate).isSame(startDate, 'day')
  );

  // Create date points
  const points: BalanceDataPoint[] = [];
  let runningBalance = currentTotalBalance;

  if (timeframe === 'month') {
    // Daily points for month view
    for (let d = now; d.isAfter(startDate) || d.isSame(startDate, 'day'); d = d.subtract(1, 'day')) {
      const dayTransactions = relevantTransactions.filter(t => 
        dayjs(t.txnDate).format('YYYY-MM-DD') === d.format('YYYY-MM-DD')
      );

      // Reverse the transaction effect to get historical balance
      dayTransactions.forEach(t => {
        runningBalance -= Number(t.amount) * (t.type === 'CREDIT' ? 1 : -1);
      });

      points.unshift({
        date: d.format('MMM D'),
        balance: runningBalance
      });
    }
  } else {
    // Monthly points for year view
    for (let d = now; d.isAfter(startDate) || d.isSame(startDate, 'month'); d = d.subtract(1, 'month')) {
      const monthTransactions = relevantTransactions.filter(t => 
        dayjs(t.txnDate).format('YYYY-MM') === d.format('YYYY-MM')
      );

      monthTransactions.forEach(t => {
        runningBalance -= Number(t.amount) * (t.type === 'CREDIT' ? 1 : -1);
      });

      points.unshift({
        date: d.format('MMM YYYY'),
        balance: runningBalance
      });
    }
  }

  return points;
};

export const BalanceChart: React.FC<BalanceChartProps> = ({ data, timeframe }) => {
  const formatYAxis = (value: number) => {
    return formatCurrency(value, '', true);
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fill: '#6B7280', fontSize: 12 }}
          tickLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis
          tickFormatter={formatYAxis}
          tick={{ fill: '#6B7280', fontSize: 12 }}
          tickLine={{ stroke: '#E5E7EB' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#4F46E5"
          strokeWidth={2}
          dot={{ fill: '#4F46E5', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};