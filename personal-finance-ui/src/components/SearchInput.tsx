import React from 'react';

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
    <div className={`relative ${className}`}>
      <input
        value={value}
        onChange={onChange}
        className="pl-10 pr-8 py-2 rounded-md bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 w-64"
        placeholder={placeholder}
        aria-label={ariaLabel}
      />

      <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.6-5.15A7 7 0 1110.5 4.5a7 7 0 018.75 8.75z" />
      </svg>

      {value && (
        <button
          onClick={() => (onClear ? onClear() : onChange({ target: { value: '' } } as any))}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
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
