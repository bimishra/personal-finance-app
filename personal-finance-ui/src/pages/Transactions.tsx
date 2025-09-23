import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { fetchTransactions, createTransaction, updateTransaction } from '../state/slices/transactionsSlice'
import { fetchCategories } from '../state/slices/categoriesSlice'
import { Transaction } from '../types'
import Modal from '../components/Modal'
import TransactionForm from '@/features/transactions/TransactionForm'
import TransactionTable from '@/features/transactions/TransactionTable'
import { toast } from 'react-hot-toast'

export default function Transactions() {
  const dispatch = useAppDispatch()
  const txns = useAppSelector(s => s.transactions.items)
  const [open, setOpen] = useState(false)
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null)

  useEffect(() => {
    dispatch(fetchTransactions())
    dispatch(fetchCategories())
  }, [dispatch])

  const handleCreate = async (txn: Transaction, keepOpen: boolean) => {
    try {
      await dispatch(createTransaction(txn)).unwrap()
      toast.success('Transaction created successfully')
      if (!keepOpen) setOpen(false)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create transaction')
    }
  }

  const handleEditSave = async (txn: Transaction) => {
    try {
      await dispatch(updateTransaction(txn)).unwrap()
      toast.success('Transaction updated successfully')
      setEditingTxn(null)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update transaction')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          New Transaction
        </button>
      </div>

      <TransactionTable
        transactions={txns}
        onEdit={setEditingTxn}
      />

      {/* Create Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="New Transaction">
        <TransactionForm
          onSave={handleCreate}
          onCancel={() => setOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingTxn} onClose={() => setEditingTxn(null)} title="Edit Transaction">
        {editingTxn && (
          <TransactionForm
            initialData={editingTxn}
            onSave={txn => handleEditSave(txn)}
            onCancel={() => setEditingTxn(null)}
          />
        )}
      </Modal>
    </div>
  )
}
