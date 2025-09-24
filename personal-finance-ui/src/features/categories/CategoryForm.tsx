import React, { useState } from 'react';
import { useAppDispatch } from '@/state/hooks';
import toast from 'react-hot-toast';
import { Category } from '@/types';
import { CategoryFormData } from './types';
import Modal from '@/components/Modal';

interface CategoryFormProps {
  initialValues?: CategoryFormData;
  onSubmit: (values: CategoryFormData) => Promise<void>;
  onClose: () => void;
  open: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues = {
    name: '',
    type: 'EXPENSE',
    description: ''
  },
  onSubmit,
  onClose,
  open
}) => {
  const [form, setForm] = useState<CategoryFormData>(initialValues);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      await onSubmit(form);
    } catch (err: any) {
      const message = err?.message || 'Failed to save category'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
        <select
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Optional description"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
    </Modal>
  )
}

export default CategoryForm;
