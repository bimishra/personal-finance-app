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
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">Categories</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your income and expense categories
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Category
          </button>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {visibleCategories.length} {visibleCategories.length === 1 ? 'category' : 'categories'}
            </span>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">
              {visibleCategories.filter(c => c.type === 'INCOME').length} Income • {visibleCategories.filter(c => c.type === 'EXPENSE').length} Expense
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select 
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              defaultValue="name"
            >
              <option value="name">Name</option>
              <option value="type">Type</option>
              <option value="transactions">Transactions</option>
            </select>
          </div>
        </div>
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
        onSubmit={async (values, keepOpen) => {
          try {
            await dispatch(createCategory(values)).unwrap();
            toast.success('Category created successfully');
            if (!keepOpen) {
              setOpen(false);
            }
          } catch (error: any) {
            toast.error(error.message || 'Failed to create category');
          }
        }}
      />
    </div>
  )
}
