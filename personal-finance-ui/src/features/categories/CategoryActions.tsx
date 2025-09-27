import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '@/state/hooks';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import Modal from '@/components/Modal';
import { IconButton } from '@/components/IconButton';
import { Icons } from '@/components/Icons';
import toast from 'react-hot-toast';
import { CategoryActionsProps } from './types';
import CategoryForm from './CategoryForm';
import listStyles from './CategoryList.module.css';

export const CategoryActions: React.FC<CategoryActionsProps> = ({
  category,
  hasTransactions,
  onUpdate,
  onDelete
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    try {
      if (onDelete) {
        await onDelete();
      }
      toast.success('Category deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Delete error:', error);
    }
  }, [onDelete]);

  return (
    <>
  <div className={listStyles.actionsWrap}>
        <IconButton
          onClick={() => setIsEditModalOpen(true)}
          label="Edit Category"
          icon={<Icons.Edit />}
          tooltip="Edit this category"
          className="hover:bg-blue-50"
        />
        <IconButton
          onClick={() => setIsDeleteModalOpen(true)}
          label="Delete Category"
          icon={<Icons.Delete />}
          variant="danger"
          disabled={hasTransactions}
          tooltip={
            hasTransactions
              ? "Can't delete category with transactions. Remove or reassign transactions first."
              : "Delete this category"
          }
          className="hover:bg-red-50"
        />
      </div>

      <CategoryForm
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialValues={{
          name: category.name,
          type: category.type,
          
        }}
        onSubmit={async (values) => {
          try {
            if (onUpdate) {
              await onUpdate(category, values);
              setIsEditModalOpen(false);
            }
          } catch (error) {
            console.error('Update error:', error);
          }
        }}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={
          hasTransactions
            ? "This category has transactions associated with it. Please remove or reassign all transactions before deleting."
            : `Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`
        }
        hasTransactions={hasTransactions}
      />
    </>
  );
};