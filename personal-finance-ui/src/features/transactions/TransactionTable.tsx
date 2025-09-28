// src/features/transactions/TransactionTable.tsx
import React, { useState } from 'react'
import { Transaction } from '@/types'
import { useAppSelector, useAppDispatch } from '@/state/hooks'
import { deleteTransaction, updateTransaction } from '@/state/slices/transactionsSlice'
import { toast } from 'react-hot-toast'
import TransactionForm from './TransactionForm'
import { IconButton } from '@/components/common'
import { Icons } from '@/components/Icons'
import { useCurrency } from '@/context/CurrencyContext'
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal'
import styles from './TransactionTable.module.css'

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
  const [pendingDeleteTxn, setPendingDeleteTxn] = useState<Transaction | null>(null)
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)

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
  
  const performSingleDelete = async (txn: Transaction) => {
    try {
      if (onDelete) {
        await onDelete(txn)
      } else {
        await dispatch(deleteTransaction(txn.id)).unwrap()
        toast.success('Transaction deleted successfully')
      }
      setSelectedTxns(prev => {
        const next = new Set(prev)
        next.delete(txn.id)
        return next
      })
    } catch (err: any) {
      if (!onDelete) {
        toast.error(`Failed to delete transaction: ${err?.message || err}`)
      }
      throw err
    } finally {
      setPendingDeleteTxn(null)
    }
  }

  const performBulkDelete = async () => {
    const ids = Array.from(selectedTxns)
    if (!ids.length) return
    try {
      for (const id of ids) {
        await dispatch(deleteTransaction(id)).unwrap()
      }
      toast.success(`${ids.length} transactions deleted successfully`)
      setSelectedTxns(new Set())
    } catch (err: any) {
      toast.error(`Failed to delete some transactions: ${err?.message || err}`)
    } finally {
      setConfirmBulkDelete(false)
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
    <div className={styles.root}>
      {/* Filter & Bulk Delete */}
      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* <label className="text-sm font-medium text-gray-700">Account</label> */}
            <select
              className={styles.select}
              value={selectedAccount}
              onChange={e => setSelectedAccount(e.target.value)}
            >
              <option value="ALL">All Accounts</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.selectedCount}>{selectedTxns.size} selected</div>
        </div>

        <div className={styles.filterRight}>
          <button
            className={styles.bulkDeleteBtn}
            onClick={() => selectedTxns.size && setConfirmBulkDelete(true)}
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
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.theadRow}>
              <th scope="col" className={`${styles.th} ${styles.thCenter}`}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedTxns.size === filteredTxns.length && filteredTxns.length > 0}
                  onChange={e => {
                    if (e.target.checked) setSelectedTxns(new Set(filteredTxns.map(t => t.id)))
                    else setSelectedTxns(new Set())
                  }}
                />
              </th>
              <th scope="col" className={`${styles.th} ${styles.th} `}>Date</th>
              <th scope="col" className={`${styles.th}`}>Account</th>
              <th scope="col" className={styles.th}>Description</th>
              <th scope="col" className={`${styles.th} ${styles.thRight}`}>Amount</th>
              <th scope="col" className={`${styles.th} ${styles.thCenter}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxns.map(t => (
              <tr key={t.id} className={styles.trHover}>
                <td className={`${styles.td} ${styles.tdCenter}`}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedTxns.has(t.id)}
                    onChange={() => toggleSelect(t.id)}
                  />
                </td>
                <td className={`${styles.td}`}>{t.txnDate}</td>
                <td className={`${styles.td} ${styles.tdTruncate}`}>{accounts.find(a => a.id === t.accountId)?.name || '\u2014'}</td>
                <td className={`${styles.td} ${styles.tdDesc}`}>{t.description}</td>
                <td className={`${styles.td} ${styles.tdRight}`}>
                  <span className={`${styles.amountBadge} ${t.type === 'CREDIT' ? styles.amountCredit : styles.amountDebit}`}>
                    {t.type === 'CREDIT' ? '+' : '-'}{formatAmount(t.amount)}
                  </span>
                </td>
                <td className={`${styles.td} ${styles.tdCenter}`}>
                  <div className={styles.iconButtons}>
                    <IconButton
                      onClick={() => setEditingTxn(t)}
                      label="Edit Transaction"
                      icon={<Icons.Edit className="w-4 h-4" />}
                      tooltip="Edit this transaction"
                    />
                    <IconButton
                      onClick={() => setPendingDeleteTxn(t)}
                      label="Delete Transaction"
                      icon={<Icons.Delete className="w-4 h-4" />}
                      variant="danger"
                      tooltip="Delete this transaction"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!filteredTxns.length && (
              <tr>
                <td className={styles.emptyRow} colSpan={6}>No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editingTxn && (
        <TransactionForm
          open={!!editingTxn}
          initialValues={editingTxn}
          onSubmit={handleEditSave}
          onClose={() => setEditingTxn(null)}
        />
      )}

      {/* Single Delete Confirmation */}
      {pendingDeleteTxn && (
        <DeleteConfirmationModal
          open={!!pendingDeleteTxn}
            onClose={() => setPendingDeleteTxn(null)}
            onConfirm={() => performSingleDelete(pendingDeleteTxn)}
            title="Delete Transaction"
            message={`Are you sure you want to delete this transaction:\n${pendingDeleteTxn.description || formatAmount(pendingDeleteTxn.amount)}? This action cannot be undone.`}
        />
      )}

      {/* Bulk Delete Confirmation */}
      {confirmBulkDelete && (
        <DeleteConfirmationModal
          open={confirmBulkDelete}
          onClose={() => setConfirmBulkDelete(false)}
          onConfirm={performBulkDelete}
          title="Delete Transactions"
          message={`Delete ${selectedTxns.size} selected transaction${selectedTxns.size === 1 ? '' : 's'}? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
