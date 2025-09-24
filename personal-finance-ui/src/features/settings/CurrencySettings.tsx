import React from 'react';
import { CURRENCIES, getCurrencySymbol } from '@/utils/currency';
import Card from '@/components/Card';
import { useCurrency } from '@/context/CurrencyContext';

export const CurrencySettings: React.FC = () => {
  const { defaultCurrency, setDefaultCurrency } = useCurrency();

  return (
    <Card title="Currency Settings">
      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Select your default currency for new accounts. This setting will only affect newly created accounts.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Default Currency</span>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency} ({getCurrencySymbol(currency)})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </Card>
  );
};