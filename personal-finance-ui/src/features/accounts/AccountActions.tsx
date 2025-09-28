import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '@/state/hooks';
import { Account } from './types';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { Modal } from '@/components/common';
import toast from 'react-hot-toast';
import { updateAccount, deleteAccount } from '@/state/slices/countSlice';
import { IconButton } from '@/components/common';
import { Icons } from '@/components/Icons';
import styles from './AccountActions.module.css';

interface AccountActionsProps {
  account: Account;
  hasTransactions?: boolean;
}

export const AccountActions: React.FC<AccountActionsProps> = ({
  account,
  hasTransactions = false,
}) => {
  const dispatch = useAppDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newName, setNewName] = useState(account.name);

  const handleExportTransactions = useCallback(async () => {
    try {
      // Create CSV content
      const response = await fetch(`/api/v1/accounts/${account.id}/transactions/export`);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${account.name}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Transactions exported successfully');
    } catch (error) {
      toast.error('Failed to export transactions');
      console.error('Export error:', error);
    }
  }, [account.id, account.name]);

  const handleDelete = useCallback(async () => {
    if (!account.id) {
      toast.error('Invalid account ID');
      return;
    }

    try {
      await dispatch(deleteAccount(account.id)).unwrap();
      toast.success('Account deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete account');
      console.error('Delete error:', error);
    }
  }, [dispatch, account.id]);

  const handleUpdateName = useCallback(async () => {
    if (!newName.trim()) {
      toast.error('Account name cannot be empty');
      return;
    }

    try {
      await dispatch(updateAccount({ ...account, name: newName.trim() })).unwrap();
      toast.success('Account name updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to update account name');
      console.error('Update error:', error);
    }
  }, [dispatch, account, newName]);

  return (
    <>
      <div className={styles.row}>
        <IconButton
          onClick={() => setIsEditModalOpen(true)}
          label="Edit Account"
          icon={<Icons.Edit />}
        />
        <IconButton
          onClick={() => setIsDeleteModalOpen(true)}
          label="Delete Account"
          icon={<Icons.Delete />}
          variant="danger"
        />
      </div>

      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Account"
      >
        <form
          onSubmit={(e) => { e.preventDefault(); handleUpdateName(); }}
          className="flex flex-col gap-5 w-full max-w-lg text-left"
          aria-describedby="edit-account-form-help"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-account-name" className="text-[11px] font-medium tracking-wide text-gray-600 uppercase">
              Account Name
            </label>
            <input
              id="edit-account-name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition outline-none placeholder:text-gray-400"
              placeholder="e.g. Main Checking"
              autoFocus
            />
            <p id="edit-account-form-help" className="text-[11px] text-gray-500">Update the display name for this account.</p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        onExport={hasTransactions ? handleExportTransactions : undefined}
        title="Delete Account"
        message={`Are you sure you want to delete the account "${account.name}"? This action cannot be undone.`}
        hasTransactions={hasTransactions}
      />
    </>
  );
};