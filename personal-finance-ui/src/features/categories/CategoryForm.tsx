import React, { useState } from 'react';
import { useAppDispatch } from '@/state/hooks';
import toast from 'react-hot-toast';
import { Category } from '@/types';
import { CategoryFormData } from './types';
import Modal from '@/components/Modal';

interface CategoryFormProps {
  initialValues?: CategoryFormData;
  onSubmit: (values: CategoryFormData, keepOpen?: boolean) => Promise<void>;
  onClose: () => void;
  open: boolean;
}

const defaultValues: CategoryFormData = {
  name: '',
  type: 'EXPENSE'
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues,
  onSubmit,
  onClose,
  open
}) => {
  const [form, setForm] = useState<CategoryFormData>(initialValues || defaultValues);
  const [submitting, setSubmitting] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);

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
      await onSubmit(form, keepOpen);
      if (!initialValues) {
        if (!keepOpen) {
          // If not keeping open, let parent close the modal
          setForm(defaultValues);
        } else {
          // If keeping open, reset form but stay open
          setForm(defaultValues);
        }
      }
    } catch (err: any) {
      const message = err?.message || 'Failed to save category'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Reset form when modal is opened
  React.useEffect(() => {
    if (open) {
      setForm(initialValues || defaultValues);
      setKeepOpen(false);
    }
  }, [open, initialValues]);

  return (
    <Modal open={open} onClose={onClose} title={initialValues ? 'Edit Category' : 'New Category'}>
      <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto py-2">
        <div className="text-left">
          <label htmlFor="name" className="block text-left text-sm font-medium text-gray-900 mb-1.5">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="text-left">
          <label htmlFor="type" className="block text-left text-sm font-medium text-gray-900 mb-1.5">Type</label>
          <div className="relative">
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="block w-full px-3 py-2 text-sm rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm appearance-none bg-white pr-8"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Keep Open checkbox (only for create) */}
        {!initialValues && (
          <div className="pt-1">
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepOpen}
                onChange={e => setKeepOpen(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span>Keep open to add another</span>
            </label>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : initialValues ? 'Save' : 'Create'}
          </button>
        </div>
    </form>
    </Modal>
  )
}

export default CategoryForm;
