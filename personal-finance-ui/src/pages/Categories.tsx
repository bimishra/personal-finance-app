import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { fetchCategories, deleteCategory, createCategory } from '@/state/slices/categoriesSlice'
import CategoryForm from '@/features/categories/CategoryForm'
import toast from 'react-hot-toast'
import { Category } from '@/types'

export default function Categories() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(s => s.categories.items)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return
    try {
      await dispatch(deleteCategory(category.id)).unwrap()
      toast.success(`Category "${category.name}" deleted successfully!`)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete category')
    }
  }

  const visibleCategories = categories.filter(c => !c.defaultCategory)

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

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleCategories.map(c => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2">{c.type}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleDelete(c)}
                    className="px-2 py-1 text-red-600 border rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {visibleCategories.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No categories available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
