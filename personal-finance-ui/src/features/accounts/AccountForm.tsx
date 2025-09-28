import React from 'react';
import { AccountFormData, AccountType } from './types';
import { getCurrencySymbol } from '@/utils/currency';
import styles from './AccountForm.module.css';

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
    <div className={styles.root}>
      {/* Account Name */}
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>Account Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={styles.input}
          required
        />
      </div>

      {/* Account Type */}
      <div className={styles.field}>
        <label htmlFor="type" className={styles.label}>Account Type</label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => onChange('type', e.target.value as AccountType)}
          className={styles.select}
        >
          {ACCOUNT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Initial Balance */}
      <div className={styles.field}>
        <label htmlFor="balance" className={styles.label}>Initial Balance</label>
        <div className={styles.currencyWrapper}>
          <div className={styles.currencyPrefix}>{getCurrencySymbol(formData.currency)}</div>
          <input
            type="number"
            id="balance"
            value={formData.balance}
            onChange={(e) => onChange('balance', parseFloat(e.target.value) || 0)}
            className={`${styles.input} ${styles.currencyInput}`}
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className="btn btnNeutral"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="btn btnPrimary"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};