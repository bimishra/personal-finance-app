import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/currency';
import dayjs from 'dayjs';

interface ChartTransaction {
  txnDate: string;
  amount: string;
  type: 'CREDIT' | 'DEBIT';
}

export interface TransactionDataPoint {
  date: string;
  amount: number;
}

interface TransactionChartProps {
  data: TransactionDataPoint[];
  timeframe: 'month' | 'year';
  type: 'income' | 'expense';
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

export const calculateTransactionTotals = (
  transactions: ChartTransaction[],
  timeframe: 'month' | 'year' = 'month',
  type: 'CREDIT' | 'DEBIT'
): TransactionDataPoint[] => {
  // Sort transactions by date, newest first
  const sortedTransactions = [...transactions]
    .filter(t => t.type === type)
    .sort((a, b) => dayjs(b.txnDate).valueOf() - dayjs(a.txnDate).valueOf());

  // Determine start date based on timeframe
  const now = dayjs();
  const startDate = timeframe === 'month' ? 
    now.subtract(1, 'month').startOf('day') :
    now.subtract(1, 'year').startOf('month');

  // Filter transactions within timeframe
  const relevantTransactions = sortedTransactions.filter(t => 
    dayjs(t.txnDate).isAfter(startDate) || dayjs(t.txnDate).isSame(startDate, timeframe)
  );

  // Create date points and aggregate amounts
  const points: TransactionDataPoint[] = [];
  
  if (timeframe === 'month') {
    // Daily points for month view
    for (let d = startDate; d.isBefore(now) || d.isSame(now, 'day'); d = d.add(1, 'day')) {
      const dayTransactions = relevantTransactions.filter(t => 
        dayjs(t.txnDate).format('YYYY-MM-DD') === d.format('YYYY-MM-DD')
      );

      const totalAmount = dayTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

      points.push({
        date: d.format('MMM D'),
        amount: totalAmount
      });
    }
  } else {
    // Monthly points for year view
    for (let d = startDate; d.isBefore(now) || d.isSame(now, 'month'); d = d.add(1, 'month')) {
      const monthTransactions = relevantTransactions.filter(t => 
        dayjs(t.txnDate).format('YYYY-MM') === d.format('YYYY-MM')
      );

      const totalAmount = monthTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

      points.push({
        date: d.format('MMM YYYY'),
        amount: totalAmount
      });
    }
  }

  return points;
};

export const TransactionsChart: React.FC<TransactionChartProps> = ({ data, timeframe, type }) => {
  const formatYAxis = (value: number) => {
    return formatCurrency(value, '', true);
  };

  const chartColor = type === 'income' ? '#059669' : '#DC2626'; // green for income, red for expense

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
          dataKey="amount"
          stroke={chartColor}
          strokeWidth={2}
          dot={{ fill: chartColor, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};