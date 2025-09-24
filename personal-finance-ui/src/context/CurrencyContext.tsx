import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCurrencySymbol } from '@/utils/currency';

interface CurrencyContextType {
  defaultCurrency: string;
  setDefaultCurrency: (currency: string) => void;
  currencySymbol: string;
  formatAmount: (amount: number | string) => string;
  parseCurrencyInput: (input: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  defaultCurrency: 'USD',
  setDefaultCurrency: () => {},
  currencySymbol: '$',
  formatAmount: (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `$${num.toFixed(2)}`;
  },
  parseCurrencyInput: (input: string) => 0
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [defaultCurrency, setDefaultCurrency] = useState(() => {
    const saved = localStorage.getItem('defaultCurrency');
    return saved || 'USD';
  });

  // Update currency symbol when default currency changes
  useEffect(() => {
    document.documentElement.style.setProperty('--currency-symbol', `'${getCurrencySymbol(defaultCurrency)}'`);
  }, [defaultCurrency]);

  const updateDefaultCurrency = useCallback((currency: string) => {
    setDefaultCurrency(currency);
    localStorage.setItem('defaultCurrency', currency);
    // Dispatch an event so other components can react to currency changes
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: currency }));
  }, []);

  const formatAmount = useCallback((amount: number | string) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: defaultCurrency,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  }, [defaultCurrency]);

  const parseCurrencyInput = useCallback((input: string) => {
    // Remove currency symbol and any non-numeric characters except decimal point
    const cleanedInput = input.replace(getCurrencySymbol(defaultCurrency), '').replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleanedInput);
    return isNaN(parsed) ? 0 : parsed;
  }, [defaultCurrency]);

  const value = {
    defaultCurrency,
    setDefaultCurrency: updateDefaultCurrency,
    currencySymbol: getCurrencySymbol(defaultCurrency),
    formatAmount,
    parseCurrencyInput
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};