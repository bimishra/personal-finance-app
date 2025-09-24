import React from 'react';
import { CategoryListItem, CategoryFormData } from './types';
import { CategoryActions } from './CategoryActions';

interface CategoryListProps {
  categories: CategoryListItem[];
  onDelete?: (category: CategoryListItem) => Promise<void>;
  onUpdate?: (category: CategoryListItem, formData: CategoryFormData) => Promise<void>;
}

export const CategoryList: React.FC<CategoryListProps> = ({ 
  categories,
  onDelete,
  onUpdate 
}) => {
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center p-12">
        <div className="text-center max-w-sm">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Categories Yet</h3>
          <p className="text-sm text-gray-500">
            Get started by creating your first category to organize your transactions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible">
        <div className="divide-y divide-gray-100">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm ${
                  category.type === 'INCOME' ? 'bg-emerald-50' : 'bg-rose-50'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${category.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 truncate">{category.name}</div>
                  <div className="text-xs text-gray-500 truncate">{category.description || ''}</div>
                </div>
              </div>

              <div className="flex items-center justify-center w-32 flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  category.type === 'INCOME' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>{category.type === 'INCOME' ? 'Income' : 'Expense'}</span>
              </div>

              <div className="flex items-center justify-center w-48 flex-shrink-0">
                {category.transactionCount ? (
                  <span className="inline-flex items-center gap-2 px-2 py-1 bg-gray-50 text-sm text-gray-700 rounded-md shadow-sm">
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-white text-gray-800 border border-gray-100">{category.transactionCount}</span>
                    <span className="text-sm text-gray-500">{category.transactionCount === 1 ? 'transaction' : 'transactions'}</span>
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">No transactions</span>
                )}
              </div>

              <div className="flex items-center justify-end w-28 flex-shrink-0">
                <div className="inline-flex items-center gap-2">
                  <CategoryActions
                    category={category}
                    hasTransactions={Boolean(category.transactionCount)}
                    onDelete={() => onDelete?.(category)}
                    onUpdate={onUpdate}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};