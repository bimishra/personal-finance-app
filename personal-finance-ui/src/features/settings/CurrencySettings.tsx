import React, { useState, useCallback, useEffect } from 'react';
import { CURRENCIES, getCurrencySymbol } from '@/utils/currency';
import { Card } from '@/components/common';
import { useCurrency } from '@/context/CurrencyContext';
import toast from 'react-hot-toast';
import styles from './CurrencySettings.module.css';

export const CurrencySettings: React.FC = () => {
  const { defaultCurrency, setDefaultCurrency, formatAmount } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

  // Keep selected currency in sync with context
  useEffect(() => {
    setSelectedCurrency(defaultCurrency);
  }, [defaultCurrency]);

  const handleCurrencyChange = useCallback(
    (currency: string) => {
      setSelectedCurrency(currency);
      setDefaultCurrency(currency);
      
      // Show example of formatted amount in toast
      const exampleAmount = formatAmount(1234.56);
      toast.success(`Currency updated to ${currency}. Example: ${exampleAmount}`, {
        duration: 3000,
        position: 'top-right',
      });
    },
    [setDefaultCurrency, formatAmount]
  );

  const currentSymbol = getCurrencySymbol(selectedCurrency);

  return (
    <Card title="Currency Settings">
      <div className={styles.root}>
        <div className={styles.sectionHead}>
          <h3 className={styles.title}>Default Currency</h3>
          <p className={styles.desc}>
            Choose the default currency for new accounts. This setting will only affect accounts created from now on.
            Existing accounts will keep their current currency settings.
          </p>
        </div>

        <div>
          <div className={styles.selectRow}>
            <div className={styles.selectWrap}>
              <select
                value={selectedCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className={styles.select}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency} ({getCurrencySymbol(currency)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.info}>
            <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <p className={styles.infoText}>
              Your current default currency is {selectedCurrency} ({currentSymbol}). New accounts will use this currency by default.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};