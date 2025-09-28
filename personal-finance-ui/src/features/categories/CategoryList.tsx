import React, { useMemo, useState } from 'react';
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
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = categories.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // Clamp current page if data shrinks
  if (page > totalPages) {
    setPage(totalPages);
  }

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return categories.slice(start, start + pageSize);
  }, [categories, page, pageSize]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value) || 10;
    setPageSize(newSize);
    setPage(1); // reset to first page when page size changes
  };
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
    <div className={styles.stackMd}>
      <div className={styles.card}>
        <div className={styles.divide}>
          {paged.map((category) => (
            <div key={category.id} className={`${styles.row} ${styles.rowHover}`}>
              <div className={styles.left}>
                <div className={styles.meta}>
                  <div className={styles.name}>
                    <span
                      className={`${styles.typeInlineIcon} ${category.type === 'INCOME' ? styles.typeIncome : styles.typeExpense}`}
                      title={category.type === 'INCOME' ? 'Income category' : 'Expense category'}
                      role="img"
                      aria-label={category.type === 'INCOME' ? 'Income category' : 'Expense category'}
                    >
                      {category.type === 'INCOME' ? '↑' : '↓'}
                    </span>
                    {category.name}
                  </div>
                  <div className={styles.desc}>{category.description || ''}</div>
                </div>
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
                  {!('defaultCategory' in category) || (category as any).defaultCategory === false ? (
                    <CategoryActions
                      category={category}
                      hasTransactions={Boolean(category.transactionCount)}
                      onDelete={() => onDelete?.(category)}
                      onUpdate={onUpdate}
                    />
                  ) : (
                    <span className="text-[10px] font-medium text-gray-400" aria-label="System category" title="System category – cannot edit">—</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.paginationBar} aria-label="Pagination navigation">
        <div className={styles.paginationMeta}>
          Showing {paged.length === 0 ? 0 : (page - 1) * pageSize + 1}
          –{(page - 1) * pageSize + paged.length} of {total} categories
        </div>
        <div className={styles.paginationControls}>
          <button
            type="button"
            className={`${styles.pageBtn} ${page === 1 ? styles.pageBtnDisabled : ''}`}
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          {[...Array(totalPages)].slice(0, 5).map((_, idx) => {
            // Basic window: first 5 pages or fewer. Could be enhanced later.
            const p = idx + 1;
            return (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            );
          })}
          {totalPages > 5 && page < totalPages && (
            <>
              <span style={{ fontSize: '0.75rem', padding: '0 0.25rem' }}>…</span>
              <button
                type="button"
                className={`${styles.pageBtn} ${page === totalPages ? styles.pageBtnActive : ''}`}
                onClick={() => goToPage(totalPages)}
                aria-label={`Page ${totalPages}`}
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            type="button"
            className={`${styles.pageBtn} ${page === totalPages ? styles.pageBtnDisabled : ''}`}
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className={styles.pageSizeSelect}
            aria-label="Items per page"
          >
            {[10, 25, 50, 100].map(size => (
              <option key={size} value={size}>{size}/page</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};