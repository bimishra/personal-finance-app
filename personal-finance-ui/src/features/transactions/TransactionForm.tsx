import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/state/hooks';
import { Transaction } from '@/types';
import dayjs from 'dayjs';
import Modal from '@/components/Modal';

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
  const accounts = useAppSelector(s => s.accounts.items)
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
      setForm(effectiveInitialValues ?? defaultValues());
      setKeepOpen(false);
    }
  }, [open, effectiveInitialValues]);

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Account */}
          <div>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Account</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={form.accountId}
                onChange={e => setForm({ ...form, accountId: e.target.value })}
                required
              >
                <option value="">Select Account</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Category */}
          <div>
            <label>
              <div className="text-sm text-gray-600">Category</div>
              <select
                className="w-full border p-2 rounded mt-1"
                value={form.categoryId ?? ''}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Amount */}
          <div>
            <label>
              <div className="text-sm text-gray-600">Amount</div>
              <input
                type="number"
                step="0.01"
                className="w-full border p-2 rounded mt-1"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
              />
            </label>
          </div>

          {/* Date */}
          <div>
            <label>
              <div className="text-sm text-gray-600">Date</div>
              <input
                type="date"
                className="w-full border p-2 rounded mt-1"
                value={form.txnDate}
                onChange={e => setForm({ ...form, txnDate: e.target.value })}
              />
            </label>
          </div>

          {/* Type */}
          <div>
            <label>
              <div className="text-sm text-gray-600">Type</div>
              <select
                className="w-full border p-2 rounded mt-1"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value as 'DEBIT' | 'CREDIT' })}
              >
                <option value="DEBIT">Debit</option>
                <option value="CREDIT">Credit</option>
              </select>
            </label>
          </div>

          {/* Description */}
          <div>
            <label>
              <div className="text-sm text-gray-600">Description</div>
              <input
                className="w-full border p-2 rounded mt-1"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </label>
          </div>

          {/* Keep Open (only for create) */}
          {!effectiveInitialValues && (
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={keepOpen}
                  onChange={e => setKeepOpen(e.target.checked)}
                />
                <span className="text-sm">Keep open to add another</span>
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="text-right">
            <button
              type="button"
              onClick={effectiveOnClose}
              className="mr-2 px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {effectiveInitialValues ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}