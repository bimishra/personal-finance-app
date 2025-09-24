import React from 'react';
import { CategoryListItem } from './types';
import { CategoryActions } from './CategoryActions';
import Card from '@/components/Card';

interface CategoryListProps {
  categories: CategoryListItem[];
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const getCategoryTypeColor = (type: 'INCOME' | 'EXPENSE') => {
    return type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No categories found. Create your first category to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <div className="p-4 group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getCategoryTypeColor(
                    category.type
                  )}`}
                >
                  {category.type}
                </span>
                {category.description && (
                  <p className="mt-2 text-sm text-gray-500">{category.description}</p>
                )}
              </div>
              <CategoryActions
                category={category}
                hasTransactions={Boolean(category.transactionCount)}
              />
            </div>
            {category.transactionCount !== undefined && (
              <div className="mt-4 text-xs text-gray-500">
                Transactions: {category.transactionCount}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};