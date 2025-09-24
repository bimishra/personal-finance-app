import React from 'react';
import { AccountFormData, AccountType } from './types';
import { getCurrencySymbol } from '@/utils/currency';
import { useCurrency } from '@/context/CurrencyContext';

interface AccountFormProps {
  formData: AccountFormData;
  onChange: (field: keyof AccountFormData, value: string | number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ACCOUNT_TYPES: AccountType[] = [
  'CURRENT',
  'SAVINGS',
  'CREDIT_CARD',
  'INVESTMENT',
  'CASH',
  'LOAN',
];

export const AccountForm: React.FC<AccountFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Account Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Account Type
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => onChange('type', e.target.value as AccountType)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {ACCOUNT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
          Initial Balance
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">
              {getCurrencySymbol(formData.currency)}
            </span>
          </div>
          <input
            type="number"
            id="balance"
            value={formData.balance}
            onChange={(e) => onChange('balance', parseFloat(e.target.value) || 0)}
            className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};