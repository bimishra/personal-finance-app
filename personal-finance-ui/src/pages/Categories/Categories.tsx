import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { fetchCategories, deleteCategory, createCategory, updateCategory } from '@/state/slices/categoriesSlice';
import CategoryForm from '@/features/categories/CategoryForm';
import { CategoryList } from '@/features/categories/CategoryList';
import { CategoryFormData } from '@/features/categories/types';
import toast from 'react-hot-toast';
import styles from './Categories.module.css';
import { Category } from '@/types';
import Fuse from 'fuse.js';

export default function Categories() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(s => s.categories.items);
  const [open, setOpen] = useState(false);
  const [pendingCreate, setPendingCreate] = useState<CategoryFormData | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [overrideAllowed, setOverrideAllowed] = useState(false);

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

  const userCategories = useMemo(() => categories.filter(c => !c.defaultCategory), [categories]);
  const defaultCategories = useMemo(() => categories.filter(c => c.defaultCategory), [categories]);

  // Fuzzy matcher over all category names (user + default)
  const fuse = useMemo(() => new Fuse(categories, {
    keys: ['name'],
    threshold: 0.35, // moderate fuzziness
    distance: 60,
    ignoreLocation: true,
    minMatchCharLength: 2
  }), [categories]);

  const validateDuplicate = (name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const direct = categories.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (direct) return `A category named "${direct.name}" already exists.`;
  const results = fuse.search(trimmed).filter((r: any) => r.score !== undefined && r.score <= 0.35);
    if (results.length) {
      const suggestion = results[0].item.name;
      return `Similar category detected: "${suggestion}". Creating this may cause duplicates.`;
    }
    return null;
  };

  const handleCreate = async (values: CategoryFormData, keepOpen?: boolean) => {
    // If we have not yet overridden, run fuzzy duplicate validation
    if (!overrideAllowed) {
      const warn = validateDuplicate(values.name);
      if (warn) {
        setDuplicateWarning(warn);
        setPendingCreate(values);
        toast.error('Potential duplicate detected');
        return; // Wait for user confirmation
      }
    }
    try {
      await dispatch(createCategory(values)).unwrap();
      toast.success('Category created successfully');
      if (!keepOpen) {
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      // Reset override flags after attempt
      setDuplicateWarning(null);
      setPendingCreate(null);
      setOverrideAllowed(false);
    }
  };

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

      {/* User Categories Section */}
      <div className="mt-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">User Categories</h2>
          <p className="mt-1 text-xs text-gray-500">Categories you've created. You can edit or delete these.</p>
        </div>
        <CategoryList
          categories={userCategories.map(category => ({ ...category, transactionCount: 0 }))}
          onDelete={handleDeleteCategory}
          onUpdate={handleUpdateCategory}
        />
      </div>

      {/* Default Categories Section */}
      <div className="mt-10 space-y-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Default Categories</h2>
          <p className="mt-1 text-xs text-gray-500">Provided system categories. These cannot be edited or removed.</p>
        </div>
        <CategoryList
          categories={defaultCategories.map(category => ({ ...category, transactionCount: 0 }))}
          /* No onDelete / onUpdate to hide actions */
        />
      </div>

      <CategoryForm
        open={open}
        onClose={() => {
          setOpen(false);
          setDuplicateWarning(null);
          setPendingCreate(null);
          setOverrideAllowed(false);
        }}
        onSubmit={handleCreate}
      />

      {/* Duplicate Warning Overlay (inline below form area) */}
      {open && duplicateWarning && pendingCreate && (
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-xs text-amber-800 shadow-sm">
          <p className="font-medium mb-2">{duplicateWarning}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setDuplicateWarning(null);
                setPendingCreate(null);
              }}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={() => {
                setOverrideAllowed(true);
                handleCreate(pendingCreate, false);
              }}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Create Anyway
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
