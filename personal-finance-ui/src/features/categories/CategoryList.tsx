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
    return type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="text-center p-8 text-gray-500">
          No categories found. Create your first category to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transactions
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {/* <span className="sr-only">Actions</span> */}
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getCategoryTypeColor(category.type)
                }`}>
                  {category.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {category.transactionCount || 0}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {category.description || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <CategoryActions
                    category={category}
                    hasTransactions={Boolean(category.transactionCount)}
                    onDelete={() => onDelete?.(category)}
                    onUpdate={onUpdate}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};