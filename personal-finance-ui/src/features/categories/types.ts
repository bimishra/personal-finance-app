import { Category } from '@/types';

export interface CategoryFormData {
  name: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface CategoryListItem extends Category {
  transactionCount?: number;
}

export interface CategoryActionsProps {
  category: CategoryListItem;
  hasTransactions?: boolean;
  onUpdate?: (category: CategoryListItem, formData: CategoryFormData) => Promise<void>;
  onDelete?: () => void;
}