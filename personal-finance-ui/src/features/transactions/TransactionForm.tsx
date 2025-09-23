import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../../state/hooks'
import { Transaction } from '../../types'
import dayjs from 'dayjs'

interface Props {
  initialData?: Transaction
  onSave: (txn: Transaction, keepOpen: boolean) => void
  onCancel: () => void
}

export default function TransactionForm({ initialData, onSave, onCancel }: Props) {
  const accounts = useAppSelector(s => s.accounts.items)
  const categories = useAppSelector(s => s.categories.items)

  const defaultForm = (): Transaction => ({
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
  const [form, setForm] = useState<Transaction>(initialData ?? defaultForm())
  const [keepOpen, setKeepOpen] = useState(false)

  // ensure accountId is set when accounts load
  useEffect(() => {
    if (accounts.length && !form.accountId) {
      setForm(f => ({ ...f, accountId: accounts[0].id }))
    }
  }, [accounts, form.accountId])

  const handleSubmit = () => {
    onSave(form, keepOpen)
    if (!initialData) {
      setForm(defaultForm()) // reset only in create mode
      setKeepOpen(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {/* Account */}
      <label>
        <div className="text-sm text-gray-600">Account</div>
        <select
          className="w-full border p-2 rounded mt-1"
          value={form.accountId}
          onChange={e => setForm({ ...form, accountId: e.target.value })}
        >
          {accounts.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </label>

      {/* Category */}
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

      {/* Amount */}
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

      {/* Date */}
      <label>
        <div className="text-sm text-gray-600">Date</div>
        <input
          type="date"
          className="w-full border p-2 rounded mt-1"
          value={form.txnDate}
          onChange={e => setForm({ ...form, txnDate: e.target.value })}
        />
      </label>

      {/* Type */}
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

      {/* Description */}
      <label>
        <div className="text-sm text-gray-600">Description</div>
        <input
          className="w-full border p-2 rounded mt-1"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </label>

      {/* Keep Open (only for create) */}
      {!initialData && (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={keepOpen}
            onChange={e => setKeepOpen(e.target.checked)}
          />
          <span className="text-sm">Keep open to add another</span>
        </label>
      )}

      {/* Actions */}
      <div className="text-right">
        <button
          onClick={onCancel}
          className="mr-2 px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {initialData ? 'Save' : 'Create'}
        </button>
      </div>
    </div>
  )
}
