import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '@/state/hooks';
import { Transaction } from '@/types';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { Modal } from '@/components/common';
import { IconButton } from '@/components/common';
import { Icons } from '@/components/Icons';
import styles from './TransactionActions.module.css';
import toast from 'react-hot-toast';

interface TransactionActionsProps {
  transaction: Transaction;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const TransactionActions: React.FC<TransactionActionsProps> = ({
  transaction,
  onUpdate,
  onDelete,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    try {
      if (onDelete) {
        await onDelete();
      }
      toast.success('Transaction deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error('Delete error:', error);
    }
  }, [onDelete]);

  return (
    <>
      <div className={styles.actions}>
        <IconButton
          onClick={() => setIsEditModalOpen(true)}
          label="Edit Transaction"
          icon={<Icons.Edit />}
          tooltip="Edit this transaction"
          className={styles.hoverBlue}
        />
        <IconButton
          onClick={() => setIsDeleteModalOpen(true)}
          label="Delete Transaction"
          icon={<Icons.Delete />}
          variant="danger"
          tooltip="Delete this transaction"
          className={styles.hoverRed}
        />
      </div>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete this transaction? This action cannot be undone.`}
      />
    </>
  );
};