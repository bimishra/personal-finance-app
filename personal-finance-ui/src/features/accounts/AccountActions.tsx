import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '@/state/hooks';
import { Account } from './types';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import Modal from '@/components/Modal';
import toast from 'react-hot-toast';
import { updateAccount, deleteAccount } from '@/state/slices/countSlice';
import { IconButton } from '@/components/IconButton';
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
        title="Edit Account Name"
      >
        <div className={styles.modalBody}>
          <div className="mb-4">
            <label htmlFor="accountName" className={styles.label}>
              Account Name
            </label>
            <input
              type="text"
              id="accountName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={styles.input}
              placeholder="Enter account name"
            />
          </div>
          <div className={styles.btnRow}>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className={`${styles.btn} ${styles.btnCancel}`}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateName}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Save Changes
            </button>
          </div>
        </div>
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