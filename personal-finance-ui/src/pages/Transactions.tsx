import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { fetchTransactions, createTransaction } from '../state/slices/transactionsSlice'
import { fetchCategories } from '../state/slices/categoriesSlice'
import dayjs from 'dayjs'
import { Transaction } from '../types'
import Modal from '../components/Modal'

export default function Transactions() {
  const dispatch = useAppDispatch()
  const txns = useAppSelector(s => s.transactions.items)
  const accounts = useAppSelector(s => s.accounts.items)
  const categories = useAppSelector(s => s.categories.items)

  // Helper to get a fresh default form
  const defaultForm = (): Partial<Transaction> => ({
    accountId: accounts[0]?.id ?? '',
    amount: '0.00',
    currency: 'USD',
    txnDate: dayjs().format('YYYY-MM-DD'),
    type: 'DEBIT',
    description: '',
    categoryId: ''
  })

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Transaction>>(defaultForm)

  useEffect(() => {
    dispatch(fetchTransactions())
    dispatch(fetchCategories())
  }, [dispatch])

  // Ensure accountId is set when accounts load or change
  useEffect(() => {
    if (accounts.length && !form.accountId) {
      setForm(f => ({ ...f, accountId: accounts[0].id }))
    }
  }, [accounts, form.accountId])

  const submit = async () => {
    await dispatch(createTransaction(form))
    setOpen(false)
    setForm(defaultForm()) // reset with current first account
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={() => {
            setForm(defaultForm()) // ensure fresh defaults when opening
            setOpen(true)
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          New Transaction
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Account</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {txns.map(t => (
              <tr key={t.id} className="border-t">
                <td className="px-3 py-2">{t.txnDate}</td>
                <td className="px-3 py-2">
                  {accounts.find(a => a.id === t.accountId)?.name || '—'}
                </td>
                <td className="px-3 py-2">{t.description}</td>
                <td
                  className={`px-3 py-2 font-semibold ${
                    t.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {t.type === 'CREDIT' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Transaction">
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
              onChange={e => setForm({ ...form, type: e.target.value as any })}
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

          {/* Actions */}
          <div className="text-right">
            <button
              onClick={() => setOpen(false)}
              className="mr-2 px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
