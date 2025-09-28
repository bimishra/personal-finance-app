import React from 'react';
import styles from '../SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  ariaLabel = 'Search',
  className = '',
  onClear,
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <input
        value={value}
        onChange={onChange}
        className={styles.input}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.6-5.15A7 7 0 1110.5 4.5a7 7 0 018.75 8.75z" />
      </svg>
      {value && (
        <button
          onClick={() => (onClear ? onClear() : onChange({ target: { value: '' } } as any))}
          className={styles.clearBtn}
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;