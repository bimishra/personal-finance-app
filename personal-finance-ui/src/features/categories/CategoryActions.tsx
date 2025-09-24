import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '@/state/hooks';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import Modal from '@/components/Modal';
import { IconButton } from '@/components/IconButton';
import { Icons } from '@/components/Icons';
import toast from 'react-hot-toast';
import { CategoryActionsProps } from './types';
import CategoryForm from './CategoryForm';

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
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          onClick={() => setIsEditModalOpen(true)}
          label="Edit Category"
          icon={<Icons.Edit />}
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
              : undefined
          }
        />
      </div>

      <CategoryForm
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialValues={{
          name: category.name,
          type: category.type,
          description: category.description || ''
        }}
        onSubmit={async (values) => {
          try {
            if (onUpdate) {
              await onUpdate();
              toast.success('Category updated successfully');
              setIsEditModalOpen(false);
            }
          } catch (error) {
            toast.error('Failed to update category');
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