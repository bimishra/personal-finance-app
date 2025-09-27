import React from 'react';
import { CategoryListItem, CategoryFormData } from './types';
import { CategoryActions } from './CategoryActions';
import styles from './CategoryList.module.css';
import layout from '@/styles/layout.module.css';

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
      <div className={styles.emptyContainer}>
        <div className={styles.emptyInner}>
          <div className={styles.emptyIcon}>
            <svg className={layout.svgMd} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className={`${styles.emptyTitle} ${layout.textSm}`}>No Categories Yet</h3>
          <p className={`${styles.emptySubtitle} ${layout.textSm}`}>
            Get started by creating your first category to organize your transactions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={styles.card}>
        <div className={styles.divide}>
          {categories.map((category) => (
            <div key={category.id} className={`${styles.row} ${styles.rowHover}`}>
              <div className={styles.left}>
                <div className={`${styles.avatar} ${category.type === 'INCOME' ? styles.avatarIncome : styles.avatarExpense}`}>
                  <div className={`${styles.dot} ${category.type === 'INCOME' ? styles.dotIncome : styles.dotExpense}`} />
                </div>
                <div className={styles.meta}>
                  <div className={styles.name}>{category.name}</div>
                  <div className={styles.desc}>{category.description || ''}</div>
                </div>
              </div>

              <div className={styles.typeCol}>
                <span className={`${styles.badge} ${category.type === 'INCOME' ? styles.badgeIncome : styles.badgeExpense}`}>
                  {category.type === 'INCOME' ? 'Income' : 'Expense'}
                </span>
              </div>

              <div className={styles.transactionsCol}>
                {category.transactionCount ? (
                  <span className={styles.txnBadge}>
                    <span className={styles.txnCount}>{category.transactionCount}</span>
                    <span className={styles.txnText}>{category.transactionCount === 1 ? 'transaction' : 'transactions'}</span>
                  </span>
                ) : (
                  <span className={styles.noTxn}>No transactions</span>
                )}
              </div>

              <div className={styles.actionsCol}>
                <div className={styles.actionsInner}>
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