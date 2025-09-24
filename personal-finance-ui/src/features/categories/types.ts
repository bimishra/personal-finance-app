import { Category } from '@/types';

export interface CategoryFormData {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  description?: string;
}

export interface CategoryListItem extends Category {
  transactionCount?: number;
}

export interface CategoryActionsProps {
  category: CategoryListItem;
  hasTransactions?: boolean;
  onUpdate?: () => void;
  onDelete?: () => void;
}