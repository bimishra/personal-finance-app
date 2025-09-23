// src/features/transactions/TransactionTable.tsx
import React, { useState } from 'react'
import { Transaction } from '@/types'
import { useAppSelector, useAppDispatch } from '@/state/hooks'
import { deleteTransaction, updateTransaction } from '@/state/slices/transactionsSlice'
import { toast } from 'react-hot-toast'
import TransactionForm from './TransactionForm'
import { formatCurrency } from '@/utils/currency'

interface Props {
  transactions: Transaction[]
  onEdit?: React.Dispatch<React.SetStateAction<Transaction | null>>
}

export default function TransactionTable({ transactions, onEdit }: Props) {
  const accounts = useAppSelector(s => s.accounts.items)
  const dispatch = useAppDispatch()

  const [selectedAccount, setSelectedAccount] = useState<string>('ALL')
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null)
  const [selectedTxns, setSelectedTxns] = useState<Set<string>>(new Set())

  const filteredTxns =
    selectedAccount === 'ALL'
      ? transactions
      : transactions.filter(t => t.accountId === selectedAccount)

  const toggleSelect = (id: string) => {
    setSelectedTxns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }
  
 const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteTransaction(id)).unwrap()
      toast.success('Transaction deleted successfully')
      setSelectedTxns(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    } catch (err: any) {
      toast.error(`Failed to delete transaction: ${err.message || err}`)
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedTxns.size) return
    if (!confirm(`Delete ${selectedTxns.size} selected transactions?`)) return
    const ids = Array.from(selectedTxns)
    try {
      for (const id of ids) {
        await dispatch(deleteTransaction(id)).unwrap()
      }
      toast.success(`${ids.length} transactions deleted successfully`)
      setSelectedTxns(new Set())
    } catch (err: any) {
      toast.error(`Failed to delete some transactions: ${err.message || err}`)
    }
  }

  const handleEditSave = async (updated: Transaction) => {
    try {
      await dispatch(updateTransaction(updated)).unwrap()
      toast.success('Transaction updated successfully')
      setEditingTxn(null)
    } catch (err: any) {
      toast.error(`Failed to update transaction: ${err.message || err}`)
    }
  }

  return (
    <div className="bg-white rounded shadow">
      {/* Filter & Bulk Delete */}
      <div className="flex justify-between items-center p-3 border-b bg-gray-50">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span>Filter by Account:</span>
          <select
            className="border p-1 rounded"
            value={selectedAccount}
            onChange={e => setSelectedAccount(e.target.value)}
          >
            <option value="ALL">All Accounts</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
          onClick={handleBulkDelete}
          disabled={selectedTxns.size === 0}
        >
          Delete Selected
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 text-center w-10">
              <input
                type="checkbox"
                className="align-middle"
                checked={selectedTxns.size === filteredTxns.length && filteredTxns.length > 0}
                onChange={e => {
                  if (e.target.checked) setSelectedTxns(new Set(filteredTxns.map(t => t.id)))
                  else setSelectedTxns(new Set())
                }}
              />
            </th>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Account</th>
            <th className="px-3 py-2 text-left">Description</th>
            <th className="px-3 py-2 text-left">Amount</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTxns.map(t => (
            <tr key={t.id} className="border-t">
              <td className="px-3 py-2 text-center">
                <input
                  type="checkbox"
                  className="align-middle"
                  checked={selectedTxns.has(t.id)}
                  onChange={() => toggleSelect(t.id)}
                />
              </td>
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
                {t.type === 'CREDIT' ? '+' : '-'}
                {formatCurrency(t.amount, accounts.find(a => a.id === t.accountId)?.currency || 'USD')}
              </td>
              <td className="px-3 py-2 flex gap-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setEditingTxn(t)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!filteredTxns.length && (
            <tr>
              <td
                className="px-3 py-4 text-center text-gray-500"
                colSpan={6}
              >
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit modal */}
      {editingTxn && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Edit Transaction</h2>
            <TransactionForm
              initialData={editingTxn}
              onSave={handleEditSave}
              onCancel={() => setEditingTxn(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
