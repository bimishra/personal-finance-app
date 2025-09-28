import React, { useState, useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/state/hooks';
import { useAccounts } from '@/hooks/useReferenceData';
import { Transaction } from '@/types';
import dayjs from 'dayjs';
import { Modal } from '@/components/common';
import CategorySelect from './components/CategorySelect';

// Mapping between UI-facing transaction kind and backend transaction.type
// UI kinds: INCOME -> CREDIT, EXPENSE -> DEBIT, TRANSFER -> (currently treated as DEBIT placeholder)
type TransactionKind = 'INCOME' | 'EXPENSE' | 'TRANSFER';

interface TransactionFormProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (transaction: Transaction, keepOpen?: boolean) => Promise<void>;
  initialValues?: Transaction;
  initialData?: Transaction; // For backward compatibility
  onSave?: (transaction: Transaction) => Promise<void>; // For backward compatibility
  onCancel?: () => void; // For backward compatibility
}

export default function TransactionForm({
  open,
  onClose,
  onSubmit,
  initialValues,
  // Backward compatibility props
  initialData,
  onSave,
  onCancel
}: TransactionFormProps) {
  // Handle both new and old prop patterns
  const effectiveInitialValues = initialValues || initialData;
  const effectiveOnSubmit = onSubmit || ((data: Transaction) => onSave?.(data));
  const effectiveOnClose = onClose || onCancel;
  const dispatch = useAppDispatch();
  const { data: accountData = [], isLoading: accountsLoading, isError: accountsError } = useAccounts();
  const accounts = accountData;
  const accountsStatus: 'idle' | 'loading' | 'succeeded' | 'failed' = accountsLoading ? 'loading' : (accountsError ? 'failed' : (accounts.length ? 'succeeded' : 'idle'));
  const categories = useAppSelector(s => s.categories.items)

  const defaultValues = (): Transaction => ({
    id: '',
    accountId: accounts[0]?.id ?? '',
    categoryId: '',
    amount: '0.00',
    currency: 'USD',
    txnDate: dayjs().format('YYYY-MM-DD'),
    type: 'DEBIT',
    description: '',
    userId: '' // backend overrides
  })

  // initialize with initialData (edit mode) or default form (create mode)
  const [form, setForm] = useState<Transaction>(() => effectiveInitialValues ?? defaultValues());
  // Separate UI-facing transaction kind (adds Transfer concept even if backend not fully supported yet)
  const deriveKind = (t: Transaction): TransactionKind => {
    if (!t) return 'EXPENSE';
    if (t.type === 'CREDIT') return 'INCOME';
    return 'EXPENSE'; // No reliable way to infer TRANSFER from existing schema
  };
  const [kind, setKind] = useState<TransactionKind>(deriveKind(effectiveInitialValues ?? defaultValues()));
  const [keepOpen, setKeepOpen] = useState(false);

  // ensure accountId is set when accounts load
  useEffect(() => {
    if (accounts.length && !form.accountId) {
      const newForm = { ...form };
      if (accounts[0]?.id) {
        newForm.accountId = accounts[0].id;
        setForm(newForm);
      }
    }
  }, [accounts, form.accountId]);

  useEffect(() => {
    if (open) {
      const init = effectiveInitialValues ?? defaultValues();
      setForm(init);
      setKind(deriveKind(init));
      setKeepOpen(false);
    }
  }, [open, effectiveInitialValues]);

  // If accounts finished loading and form has no account selected, set default
  useEffect(() => {
    if (accountsStatus === 'succeeded' && accounts.length && !form.accountId) {
      const firstId = accounts[0].id || '';
      setForm(prev => ({ ...prev, accountId: firstId }));
    }
  }, [accountsStatus, accounts, form.accountId]);

  // When kind changes, ensure backend `type` stays in sync & manage category visibility
  useEffect(() => {
    setForm(prev => {
      let backendType: Transaction['type'] = prev.type;
      if (kind === 'INCOME') backendType = 'CREDIT';
      else if (kind === 'EXPENSE') backendType = 'DEBIT';
      else if (kind === 'TRANSFER') backendType = 'DEBIT'; // placeholder mapping
      return { ...prev, type: backendType, categoryId: kind === 'TRANSFER' ? undefined : prev.categoryId };
    });
  }, [kind]);

  const filteredCategories = useMemo(() => {
    if (kind === 'TRANSFER') return [];
    return categories.filter(c => c.type === (kind === 'INCOME' ? 'INCOME' : 'EXPENSE'));
  }, [categories, kind]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveOnSubmit) {
      await effectiveOnSubmit(form, keepOpen);
      if (!effectiveInitialValues && !keepOpen) {
        setForm(defaultValues());
      }
    }
  };

  return (
    <Modal
      open={open ?? false}
      onClose={effectiveOnClose ?? (() => {})}
      title={effectiveInitialValues ? 'Edit Transaction' : 'New Transaction'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:max-w-xl mx-auto w-full">
        <div className="space-y-4">
          {/* Transaction Type (segmented) */}
          <div className="sm:flex sm:items-start sm:gap-3">
            <div className="sm:w-32 sm:pt-2 pr-1">
              <label className="block text-xs font-medium tracking-wide text-gray-700">Transaction Type</label>
            </div>
            <div className="sm:flex-1 flex flex-col gap-1">
              <div className="inline-flex rounded-lg bg-gray-100 p-1 text-xs font-medium shadow-inner" role="radiogroup" aria-label="Transaction Type">
                {(['INCOME','EXPENSE','TRANSFER'] as TransactionKind[]).map(option => {
                  const active = kind === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setKind(option)}
                      className={[
                        'relative min-w-[90px] rounded-md px-3 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0',
                        active ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-indigo-500' : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                      ].join(' ')}
                    >
                      {option === 'INCOME' && 'Income'}
                      {option === 'EXPENSE' && 'Expense'}
                      {option === 'TRANSFER' && 'Transfer'}
                      {option === 'TRANSFER' && (
                        <span className="ml-1 align-middle text-[10px] font-normal text-gray-400">β</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {kind === 'TRANSFER' && (
                <p className="text-[10px] leading-tight text-amber-600">Transfer support is a preview. It will record as an expense (debit) until full dual-entry support is implemented.</p>
              )}
            </div>
          </div>

          {/* Account */}
          <div className="sm:flex sm:items-start sm:gap-3">
            <div className="sm:w-32 sm:pt-2 pr-1">
              <label className="block text-xs font-medium tracking-wide text-gray-700">Account</label>
            </div>
            <div className="sm:flex-1">
              {accountsStatus === 'loading' && (
                <div className="flex h-[38px] items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-xs text-gray-500 animate-pulse">Loading accounts…</div>
              )}
              {accountsStatus !== 'loading' && (
                <select
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-60"
                  value={form.accountId}
                  onChange={e => setForm({ ...form, accountId: e.target.value })}
                  required
                  disabled={accountsStatus !== 'succeeded' || accounts.length === 0}
                >
                  <option value="">{accounts.length === 0 ? 'No accounts found' : 'Select account'}</option>
                  {accounts.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              )}
              {accountsStatus === 'failed' && (
                <div className="mt-1 text-[10px] text-red-600">Failed to load accounts. <span className="underline cursor-pointer" onClick={() => { /* React Query will refetch on focus or manual invalidate if needed */ }}>Retry</span></div>
              )}
            </div>
          </div>

          {/* Category */}
          {kind !== 'TRANSFER' && (
            <div className="sm:flex sm:items-start sm:gap-3">
              <div className="sm:w-32 sm:pt-2 pr-1">
                <label className="block text-xs font-medium tracking-wide text-gray-700">Category</label>
              </div>
              <div className="sm:flex-1">
                <CategorySelect
                  categories={filteredCategories}
                  value={form.categoryId}
                  onChange={val => setForm(prev => ({ ...prev, categoryId: val }))}
                  label="Category"
                  hideLabel
                  placeholder="Select category"
                  persistenceKey={`txnKind:${kind}`}
                  pinnedIds={filteredCategories.slice(0,3).map(c => c.id)}
                  allowCreate
                  newCategoryType={kind === 'INCOME' ? 'INCOME' : 'EXPENSE'}
                />
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="sm:flex sm:items-start sm:gap-3">
            <div className="sm:w-32 sm:pt-2 pr-1">
              <label className="block text-xs font-medium tracking-wide text-gray-700">Amount</label>
            </div>
            <div className="sm:flex-1">
              <input
                type="number"
                step="0.01"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
              />
            </div>
          </div>

          {/* Date */}
          <div className="sm:flex sm:items-start sm:gap-3">
            <div className="sm:w-32 sm:pt-2 pr-1">
              <label className="block text-xs font-medium tracking-wide text-gray-700">Date</label>
            </div>
            <div className="sm:flex-1">
              <input
                type="date"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={form.txnDate}
                onChange={e => setForm({ ...form, txnDate: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div className="sm:flex sm:items-start sm:gap-3">
            <div className="sm:w-32 sm:pt-2 pr-1">
              <label className="block text-xs font-medium tracking-wide text-gray-700">Description</label>
            </div>
            <div className="sm:flex-1">
              <input
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={form.description ?? ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder={kind === 'TRANSFER' ? 'Optional note for transfer' : 'Add a short description'}
              />
            </div>
          </div>

          {/* Keep Open */}
          {!effectiveInitialValues && (
            <div className="sm:flex sm:items-center sm:gap-3">
              <div className="sm:w-32" />
              <div className="sm:flex-1 flex items-center gap-2">
                <input
                  id="keep-open-checkbox"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={keepOpen}
                  onChange={e => setKeepOpen(e.target.checked)}
                />
                <label htmlFor="keep-open-checkbox" className="text-[0.7rem] text-gray-600">Keep open to add another</label>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={effectiveOnClose}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {effectiveInitialValues ? 'Save Transaction' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
}