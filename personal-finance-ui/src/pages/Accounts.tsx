import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { fetchAccounts, createAccount } from '../state/slices/countSlice'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { Account } from '../types'

// keep enum values in sync with backend
const ACCOUNT_TYPES = [
  'CURRENT',
  'SAVINGS',
  'CREDIT_CARD',
  'INVESTMENT',
  'CASH',
  'LOAN',
]

const CURRENCIES = ['INR', 'USD', 'GBP']
const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  GBP: '£',
}

export default function Accounts() {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(s => s.accounts.items)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Account>>({
    name: '',
    currency: 'USD',
    type: 'CHECKING', // default selection
  })

  useEffect(() => {
    dispatch(fetchAccounts())
  }, [dispatch])

  const submit = async () => {
    if (!form.type) {
      alert('Please select an account type')
      return
    }
    await dispatch(createAccount(form))
    setOpen(false)
    setForm({ name: '', currency: 'INR', type: 'SAVINGS', balance: 0 })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          New Account
        </button>
      </div>

      <Card>
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Currency</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id} className="border-t">
                <td className="px-3 py-2">{a.name}</td>
                <td className="px-3 py-2">{a.type}</td>
                <td className="px-3 py-2">{a.currency}</td>
                <td className="px-3 py-2">
                    {CURRENCY_SYMBOLS[a.currency || 'USD']}
                    {Number(a.balance).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Account">
        <div className="grid grid-cols-1 gap-3">
          <label>
            <div className="text-sm text-gray-600">Name</div>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded mt-1"
            />
          </label>

          <label>
            <div className="text-sm text-gray-600">Type</div>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full border p-2 rounded mt-1"
            >
              {ACCOUNT_TYPES.map(t => (
                <option key={t} value={t}>
                  {t.replace('_', ' ')}
                </option>
              ))}
            </select>
          </label>

         <label>
            <div className="text-sm text-gray-600">Currency</div>
            <select
              value={form.currency}
              onChange={e => setForm({ ...form, currency: e.target.value })}
              className="w-full border p-2 rounded mt-1"
            >
              {CURRENCIES.map(c => (
                <option key={c} value={c}>
                  {c} ({CURRENCY_SYMBOLS[c]})
                </option>
              ))}
            </select>
          </label>

           <label>
            <div className="text-sm text-gray-600">Balance</div>
            <input
              type="number"
              value={form.balance}
              onChange={e =>
                setForm({ ...form, balance: parseFloat(e.target.value) })
              }
              className="w-full border p-2 rounded mt-1"
            />
          </label>

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
