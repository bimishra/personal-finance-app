import React, { createContext, useContext, useState, useCallback } from 'react';
import { getCurrencySymbol } from '@/utils/currency';

interface CurrencyContextType {
  defaultCurrency: string;
  setDefaultCurrency: (currency: string) => void;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  defaultCurrency: 'USD',
  setDefaultCurrency: () => {},
  currencySymbol: '$'
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [defaultCurrency, setDefaultCurrency] = useState(() => {
    const saved = localStorage.getItem('defaultCurrency');
    return saved || 'USD';
  });

  const updateDefaultCurrency = useCallback((currency: string) => {
    setDefaultCurrency(currency);
    localStorage.setItem('defaultCurrency', currency);
  }, []);

  const value = {
    defaultCurrency,
    setDefaultCurrency: updateDefaultCurrency,
    currencySymbol: getCurrencySymbol(defaultCurrency)
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