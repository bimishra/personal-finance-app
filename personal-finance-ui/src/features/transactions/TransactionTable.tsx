// src/features/transactions/TransactionTable.tsx
import React, { useState } from 'react'
import { Transaction } from '@/types'
import { useAppSelector, useAppDispatch } from '@/state/hooks'
import { deleteTransaction, updateTransaction } from '@/state/slices/transactionsSlice'
import { toast } from 'react-hot-toast'
import TransactionForm from './TransactionForm'
import { IconButton } from '@/components/IconButton'
import { Icons } from '@/components/Icons'
import { useCurrency } from '@/context/CurrencyContext'

interface Props {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => Promise<void>;
}

export default function TransactionTable({ transactions, onEdit, onDelete }: Props) {
  const accounts = useAppSelector(s => s.accounts.items)
  const dispatch = useAppDispatch()
  const { formatAmount } = useCurrency();
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
      <div className="flex flex-wrap justify-between items-center p-4 border-b bg-gray-50 gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Account:</label>
            <select
              className="block w-48 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
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
          </div>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="text-sm text-gray-500">
            {selectedTxns.size} selected
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={handleBulkDelete}
            disabled={selectedTxns.size === 0}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete Selected
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full table-fixed divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="w-12 px-3 py-2 text-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={selectedTxns.size === filteredTxns.length && filteredTxns.length > 0}
                onChange={e => {
                  if (e.target.checked) setSelectedTxns(new Set(filteredTxns.map(t => t.id)))
                  else setSelectedTxns(new Set())
                }}
              />
            </th>
            <th scope="col" className="w-28 px-3 py-2 text-left text-sm font-medium text-gray-500">Date</th>
            <th scope="col" className="w-36 px-3 py-2 text-left text-sm font-medium text-gray-500">Account</th>
            <th scope="col" className="px-3 py-2 text-left text-sm font-medium text-gray-500">Description</th>
            <th scope="col" className="w-32 px-3 py-2 text-right text-sm font-medium text-gray-500">Amount</th>
            <th scope="col" className="w-24 px-3 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {filteredTxns.map(t => (
            <tr key={t.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-3 py-2 text-center align-middle">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedTxns.has(t.id)}
                  onChange={() => toggleSelect(t.id)}
                />
              </td>
              <td className="px-3 py-2 text-sm text-gray-900">{t.txnDate}</td>
              <td className="px-3 py-2 text-sm text-gray-500">
                {accounts.find(a => a.id === t.accountId)?.name || '—'}
              </td>
              <td className="px-3 py-2 text-sm text-gray-900">{t.description}</td>
              <td
                className={`px-3 py-2 text-sm font-medium text-right whitespace-nowrap ${
                  t.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {t.type === 'CREDIT' ? '+' : '-'}
                {formatAmount(t.amount)}
              </td>
              <td className="px-3 py-2 text-sm text-center">
                <div className="flex justify-center items-center space-x-1">
                  <IconButton
                    onClick={() => setEditingTxn(t)}
                    label="Edit Transaction"
                    icon={<Icons.Edit className="w-4 h-4" />}
                    tooltip="Edit this transaction"
                    className="hover:bg-blue-50"
                  />
                  <IconButton
                    onClick={() => handleDelete(t.id)}
                    label="Delete Transaction"
                    icon={<Icons.Delete className="w-4 h-4" />}
                    variant="danger"
                    tooltip="Delete this transaction"
                    className="hover:bg-red-50"
                  />
                </div>
              </td>
            </tr>
          ))}
          {!filteredTxns.length && (
            <tr>
              <td
                className="px-3 py-8 text-center text-sm text-gray-500"
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
        <TransactionForm
          open={!!editingTxn}
          initialValues={editingTxn}
          onSubmit={handleEditSave}
          onClose={() => setEditingTxn(null)}
        />
      )}
    </div>
  );
}
