import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { fetchCategories, deleteCategory, createCategory, updateCategory } from '@/state/slices/categoriesSlice'
import CategoryForm from '@/features/categories/CategoryForm'
import { CategoryList } from '@/features/categories/CategoryList'
import { CategoryFormData } from '@/features/categories/types'
import toast from 'react-hot-toast'
import { Category } from '@/types'

export default function Categories() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(s => s.categories.items)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          New Category
        </button>
      </div>

      <CategoryList 
        categories={visibleCategories.map(category => ({
          ...category,
          transactionCount: 0 // TODO: Add actual transaction count when available
        }))}
        onDelete={handleDeleteCategory}
        onUpdate={handleUpdateCategory}
      />

      <CategoryForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async (values) => {
          try {
            await dispatch(createCategory(values)).unwrap();
            toast.success('Category created successfully');
            setOpen(false);
          } catch (error: any) {
            toast.error(error.message || 'Failed to create category');
          }
        }}
      />
    </div>
  )
}
