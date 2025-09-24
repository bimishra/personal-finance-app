import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '@/state/hooks';
import { Transaction } from '@/types';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import Modal from '@/components/Modal';
import { IconButton } from '@/components/IconButton';
import { Icons } from '@/components/Icons';
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
      <div className="flex items-center justify-center space-x-1">
        <IconButton
          onClick={() => setIsEditModalOpen(true)}
          label="Edit Transaction"
          icon={<Icons.Edit />}
          tooltip="Edit this transaction"
          className="hover:bg-blue-50"
        />
        <IconButton
          onClick={() => setIsDeleteModalOpen(true)}
          label="Delete Transaction"
          icon={<Icons.Delete />}
          variant="danger"
          tooltip="Delete this transaction"
          className="hover:bg-red-50"
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