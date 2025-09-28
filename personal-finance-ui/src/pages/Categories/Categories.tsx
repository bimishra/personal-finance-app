import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { fetchCategories, deleteCategory, createCategory, updateCategory } from '@/state/slices/categoriesSlice';
import CategoryForm from '@/features/categories/CategoryForm';
import { CategoryList } from '@/features/categories/CategoryList';
import { CategoryFormData } from '@/features/categories/types';
import toast from 'react-hot-toast';
import styles from './Categories.module.css';
import { Category } from '@/types';

export default function Categories() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(s => s.categories.items);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleUpdateCategory = async (category: Category, formData: CategoryFormData) => {
    try {
      await dispatch(updateCategory({ id: category.id, ...formData })).unwrap();
      toast.success(`Category "${formData.name}" updated successfully!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update category');
      throw err;
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await dispatch(deleteCategory(category.id)).unwrap();
      toast.success(`Category "${category.name}" deleted successfully!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete category');
      throw err;
    }
  };

  const visibleCategories = categories.filter(c => !c.defaultCategory);

  return (
    <div>
      <div className={styles.headerWrap}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Categories</h1>
            <p className={styles.subtitle}>Manage your income and expense categories</p>
          </div>
          <button onClick={() => setOpen(true)} className={styles.newBtn}>
            <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Category
          </button>
        </div>
      </div>

      <CategoryList
        categories={visibleCategories.map(category => ({
          ...category,
          transactionCount: 0
        }))}
        onDelete={handleDeleteCategory}
        onUpdate={handleUpdateCategory}
      />

      <CategoryForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async (values, keepOpen) => {
          try {
            await dispatch(createCategory(values)).unwrap();
            toast.success('Category created successfully');
            if (!keepOpen) setOpen(false);
          } catch (error: any) {
            toast.error(error.message || 'Failed to create category');
          }
        }}
      />
    </div>
  );
}
