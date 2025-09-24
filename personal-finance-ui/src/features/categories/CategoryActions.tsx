import React, { useState, useCallback } from 'react';
import { useAppDispatch } from '@/state/hooks';
import { Category } from '@/types';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import Modal from '@/components/Modal';
import { IconButton } from '@/components/IconButton';
import { Icons } from '@/components/Icons';
import toast from 'react-hot-toast';

interface CategoryActionsProps {
  category: Category;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const CategoryActions: React.FC<CategoryActionsProps> = ({
  category,
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
        />
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`}
      />
    </>
  );
};