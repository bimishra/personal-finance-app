import React, { useState } from 'react';
import { useAppDispatch } from '@/state/hooks';
import toast from 'react-hot-toast';
import { Category } from '@/types';
import { CategoryFormData } from './types';
import { Modal } from '@/components/common';
import styles from './CategoryForm.module.css';
import layout from '@/styles/layout.module.css';

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
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className={`${styles.input} ${styles.smText}`}
            placeholder="Enter category name"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="type" className={styles.label}>Type</label>
          <div className={styles.selectWrapper}>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className={`${styles.input} ${styles.select}`}
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
            <div className={styles.selectIcon}>
              <svg className={layout.svgSm} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Keep Open checkbox (only for create) */}
        {!initialValues && (
          <div className={styles.keepOpen}>
            <label className={`${styles.checkboxLabel} ${layout.textSm}`}>
              <input
                type="checkbox"
                checked={keepOpen}
                onChange={e => setKeepOpen(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Keep open to add another</span>
            </label>
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.btnCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={styles.btnPrimary}
          >
            {submitting ? 'Saving...' : initialValues ? 'Save' : 'Create'}
          </button>
        </div>
    </form>
    </Modal>
  )
}

export default CategoryForm;
