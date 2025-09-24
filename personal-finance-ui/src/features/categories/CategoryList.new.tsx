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
  const getCategoryTypeColor = (type: 'INCOME' | 'EXPENSE') => {
    return type === 'INCOME' 
      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' 
      : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/10';
  };

  const getBadgeIcon = (type: 'INCOME' | 'EXPENSE') => {
    return type === 'INCOME' ? (
      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ) : (
      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    );
  };

  if (categories.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-6 text-center max-w-sm mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 border border-gray-100 mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">No Categories Found</h3>
          <p className="text-sm text-gray-500 mb-4">Start organizing your finances by creating categories</p>
          <div className="border-t border-gray-100 -mx-8 px-8 pt-4">
            <p className="text-xs text-gray-400">Categories help you track and analyze your spending patterns</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px] max-h-[calc(100vh-12rem)]">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50/80 backdrop-blur-sm supports-[backdrop-filter]:bg-gray-50/60">
          <div className="col-span-5 flex items-center">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</span>
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</span>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Count</span>
          </div>
          <div className="col-span-2 flex items-center justify-end">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto" style={{ height: 'calc(100% - 45px)' }}>
        <div className="divide-y divide-gray-100">
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              className={`group transition duration-150 ease-in-out hover:bg-gray-50/80 ${
                index === categories.length - 1 ? 'hover:rounded-b-xl' : ''
              }`}
            >
              <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                <div className="col-span-5">
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </div>
                <div className="col-span-3 flex justify-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                    getCategoryTypeColor(category.type)
                  }`}>
                    {getBadgeIcon(category.type)}
                    {category.type === 'INCOME' ? 'Income' : 'Expense'}
                  </span>
                </div>
                <div className="col-span-2">
                  <div className="flex justify-center items-center gap-1">
                    {category.transactionCount ? (
                      <>
                        <span className="text-sm font-medium text-gray-900">
                          {category.transactionCount}
                        </span>
                        <span className="text-xs text-gray-400">
                          {category.transactionCount === 1 ? 'item' : 'items'}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">No items</span>
                    )}
                  </div>
                </div>
                <div className="col-span-2 flex justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <CategoryActions
                      category={category}
                      hasTransactions={Boolean(category.transactionCount)}
                      onDelete={() => onDelete?.(category)}
                      onUpdate={onUpdate}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};