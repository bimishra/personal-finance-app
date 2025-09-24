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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
        <label htmlFor="name" className="block text-left text-sm font-medium text-gray-700">Name</label>
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

      <div className="text-left">
        <label htmlFor="type" className="block text-left text-sm font-medium text-gray-700">Type</label>
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

      {/* Keep Open checkbox (only for create) */}
      {!initialValues && (
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={keepOpen}
              onChange={e => setKeepOpen(e.target.checked)}
            />
            <span className="text-sm">Keep open to add another</span>
          </label>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : initialValues ? 'Save' : 'Create'}
        </button>
      </div>
    </form>
    </Modal>
  )
}

export default CategoryForm;
