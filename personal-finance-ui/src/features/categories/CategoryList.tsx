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
      <table className="min-w-full table-fixed divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="w-1/3 px-3 py-2 text-left text-sm font-medium text-gray-500">
              Name
            </th>
            <th scope="col" className="w-1/6 px-3 py-2 text-center text-sm font-medium text-gray-500">
              Type
            </th>
            <th scope="col" className="w-1/6 px-3 py-2 text-center text-sm font-medium text-gray-500">
              Transactions
            </th>
            <th scope="col" className="w-1/6 px-3 py-2 text-center text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  getCategoryTypeColor(category.type)
                }`}>
                  {category.type}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                {category.transactionCount || 0}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-center">
                <div className="flex justify-center items-center space-x-2">
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