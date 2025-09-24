import React from 'react';
import { Transaction } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-white rounded-md shadow-sm border border-gray-100 p-3 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 p-2 rounded-md bg-blue-50">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</p>
            <p className="text-base font-semibold text-gray-900 mt-0.5">
              {transactions.length.toLocaleString()}
              <span className="text-xs font-medium text-gray-500 ml-1">total</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 p-3 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 p-2 rounded-md bg-green-50">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Income</p>
            <p className="text-base font-semibold text-green-600 mt-0.5">
              {formatAmount(totalIncome)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 p-3 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 p-2 rounded-md bg-red-50">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</p>
            <p className="text-base font-semibold text-red-600 mt-0.5">
              {formatAmount(totalExpense)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 p-3 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 p-2 rounded-md bg-indigo-50">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Net Balance</p>
            <div className="flex items-baseline mt-0.5">
              <p className={`text-base font-semibold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatAmount(Math.abs(netAmount))}
              </p>
              <span className={`text-xs font-medium ml-1.5 ${netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {netAmount >= 0 ? '↑' : '↓'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};