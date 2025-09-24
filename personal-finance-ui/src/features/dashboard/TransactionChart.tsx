import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/currency';

interface TransactionChartData {
  date: string;
  amount: number;
}

interface TransactionChartProps {
  data: TransactionChartData[];
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

export const TransactionChart: React.FC<TransactionChartProps> = ({ data }) => {
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
          dataKey="amount"
          stroke="#4F46E5"
          strokeWidth={2}
          dot={{ fill: '#4F46E5', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};