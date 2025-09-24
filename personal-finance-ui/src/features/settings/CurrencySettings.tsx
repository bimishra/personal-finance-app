import React, { useState, useCallback } from 'react';
import { CURRENCIES, getCurrencySymbol } from '@/utils/currency';
import Card from '@/components/Card';
import { useCurrency } from '@/context/CurrencyContext';
import toast from 'react-hot-toast';

export const CurrencySettings: React.FC = () => {
  const { defaultCurrency, setDefaultCurrency } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

  const handleCurrencyChange = useCallback(
    (currency: string) => {
      setSelectedCurrency(currency);
      setDefaultCurrency(currency);
      toast.success('Default currency updated successfully', {
        duration: 2000,
        position: 'top-right',
      });
    },
    [setDefaultCurrency]
  );

  const currentSymbol = getCurrencySymbol(selectedCurrency);

  return (
    <Card title="Currency Settings">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">Default Currency</h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose the default currency for new accounts. This setting will only affect accounts created from now on.
            Existing accounts will keep their current currency settings.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <select
                value={selectedCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency} ({getCurrencySymbol(currency)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-blue-700">
                  Your current default currency is {selectedCurrency} ({currentSymbol}).
                  New accounts will use this currency by default.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};