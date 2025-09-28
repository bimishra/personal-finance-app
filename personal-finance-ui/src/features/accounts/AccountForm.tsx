import React from 'react';
import { AccountFormData, AccountType } from './types';
import { getCurrencySymbol } from '@/utils/currency';

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

export const AccountForm: React.FC<AccountFormProps> = ({ formData, onChange, onSubmit, onCancel }) => {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="flex flex-col gap-5 w-full max-w-lg text-left"
      aria-describedby="create-account-form-help"
    >

      {/* Account Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="account-name" className="text-[11px] font-medium tracking-wide text-gray-600 uppercase">
          Account Name
        </label>
        <input
          id="account-name"
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
          autoFocus
          className="rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none placeholder:text-gray-400"
          placeholder="e.g. Main Checking"
        />
      </div>

      {/* Account Type */}
      <div className="flex flex-col gap-1">
        <label htmlFor="account-type" className="text-[11px] font-medium tracking-wide text-gray-600 uppercase">
          Account Type
        </label>
        <div className="relative">
          <select
            id="account-type"
            value={formData.type}
            onChange={(e) => onChange('type', e.target.value as AccountType)}
            className="peer w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 shadow-sm outline-none transition"
            aria-describedby="account-type-help"
          >
            {ACCOUNT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ')}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <p id="account-type-help" className="text-[11px] text-gray-500">Select a category for this account.</p>
      </div>

      {/* Initial Balance */}
      <div className="flex flex-col gap-1">
        <label htmlFor="initial-balance" className="text-[11px] font-medium tracking-wide text-gray-600 uppercase">
          Initial Balance
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-medium text-gray-500">
            {getCurrencySymbol(formData.currency)}
          </span>
          <input
            id="initial-balance"
            type="number"
            value={formData.balance}
            onChange={(e) => onChange('balance', parseFloat(e.target.value) || 0)}
            required
            className="w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 bg-white pl-7 pr-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400"
            inputMode="decimal"
            aria-describedby="initial-balance-help"
            placeholder="0.00"
          />
        </div>
        <p id="initial-balance-help" className="text-[11px] text-gray-500">Optional starting balance; can be adjusted later.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Create Account
        </button>
      </div>
    </form>
  );
};