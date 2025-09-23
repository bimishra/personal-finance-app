import React, { useState } from 'react'
import { useAppDispatch } from '@/state/hooks'
import { createCategory } from '@/state/slices/categoriesSlice'
import toast from 'react-hot-toast'
import { Category } from '@/types'

interface CategoryFormProps {
  open: boolean
  onClose: () => void
}

export default function CategoryForm({ open, onClose }: CategoryFormProps) {
  const dispatch = useAppDispatch()

  const [form, setForm] = useState<Omit<Category, 'id' | 'userId' | 'defaultCategory' | 'createdAt' | 'updatedAt'>>({
    name: '',
    type: 'EXPENSE'
  })
  const [submitting, setSubmitting] = useState(false)
  const [keepOpen, setKeepOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'type' ? (value as 'EXPENSE' | 'INCOME') : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await dispatch(createCategory(form)).unwrap()
      toast.success(`Category "${form.name}" created successfully!`)
      if (!keepOpen) onClose()
      setForm({ name: '', type: 'EXPENSE' })
    } catch (err: any) {
      const message = err?.message || 'Failed to create category'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={keepOpen}
              onChange={e => setKeepOpen(e.target.checked)}
              id="keepOpen"
            />
            <label htmlFor="keepOpen" className="ml-2 text-sm">Add another after this</label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {submitting ? 'Saving...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
