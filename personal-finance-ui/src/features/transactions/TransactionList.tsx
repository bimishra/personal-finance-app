import React from 'react';
import { Transaction } from '@/types';
import TransactionTable from './TransactionTable';
import { TransactionSummaryCards } from './components/TransactionSummaryCards';
import styles from './TransactionList.module.css';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => Promise<void>;
  page?: number;         // zero-based page index from API
  size?: number;         // current page size
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
  loading?: boolean;
  onPageChange?: (page: number) => void; // expects zero-based
  onPageSizeChange?: (size: number) => void;
  onAccountFilterChange?: (accountId: string) => void;
  currentAccountId?: string | null;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  page = 0,
  size = 10,
  totalElements = transactions.length,
  totalPages = 1,
  last = true,
  loading = false,
  onPageChange,
  onPageSizeChange,
  onAccountFilterChange,
  currentAccountId
}) => {
  // Fallback-derived total pages if server value seems incorrect
  const derivedTotalPages = totalPages && totalPages > 0 ? totalPages : (size > 0 ? Math.max(1, Math.ceil(totalElements / size)) : 1);
  const canPrev = page > 0;
  // Use totalElements to infer if more pages exist even if totalPages is wrong
  const moreByCount = totalElements > (page + 1) * size;
  const fullPage = transactions.length === size;
  // Multiple heuristics to decide if a next page likely exists
  const canNext = (
    page < derivedTotalPages - 1 || // derived pages say more
    moreByCount ||                  // totals indicate more rows exist
    (fullPage && !last)             // server says not last (when reliable)
  );
  const nextReasons: string[] = [];
  if (page < derivedTotalPages - 1) nextReasons.push('derivedPages');
  if (moreByCount) nextReasons.push('moreByCount');
  if (fullPage && !last) nextReasons.push('fullPageAndNotLast');
  const showingFrom = totalElements === 0 ? 0 : page * size + 1;
  const showingTo = Math.min(totalElements, page * size + transactions.length);

  return (
    <div className={styles.root}>
      {/* Summary Cards */}
      <TransactionSummaryCards transactions={transactions} />

      {transactions.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyInner}>
            <div className={styles.emptyIconWrap}>
              <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className={styles.emptyHeading}>No Transactions Yet</h3>
            <p className={styles.emptyText}>Get started by creating your first transaction.</p>
          </div>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <TransactionTable
            transactions={transactions}
            onEdit={onEdit}
            onDelete={onDelete}
            onAccountFilterChange={onAccountFilterChange}
            currentAccountId={currentAccountId}
          />
        </div>
      )}

      {/* Pagination Bar (server-driven) */}
      <div className={styles.paginationBar} aria-label="Transactions pagination">
        <div className={styles.paginationMeta}>
            {loading ? 'Loading…' : `Showing ${showingFrom}-${showingTo} of ${totalElements}`}
        </div>
        <div className={styles.paginationControls}>
          <button
            type="button"
            className={`${styles.pageBtn} ${!canPrev ? styles.pageBtnDisabled : ''}`}
            onClick={() => canPrev && onPageChange?.(page - 1)}
            disabled={!canPrev}
            aria-label="Previous page"
          >
            ‹
          </button>
          {/* Enhanced pagination window: always show 2 neighbors on each side of current.
              Gaps replaced by clickable ellipsis that jump to midpoint. */}
          {(() => {
            const total = derivedTotalPages;
            if (total <= 1) {
              return (
                <button
                  type="button"
                  className={`${styles.pageBtn} ${styles.pageBtnActive}`}
                  aria-current="page"
                >1</button>
              );
            }

            const first = 0;
            const lastIdx = total - 1;
            const start = Math.max(page - 2, 1);
            const end = Math.min(page + 2, lastIdx - 1);
            const core: number[] = [];
            for (let p = start; p <= end; p++) core.push(p);
            const set = new Set<number>([first, lastIdx, ...core]);
            const sorted = Array.from(set).sort((a,b) => a - b);

            interface GapDescriptor { kind: 'gap'; from: number; to: number; midpoint: number; key: string; }
            type Piece = number | GapDescriptor;
            const pieces: Piece[] = [];
            for (let i = 0; i < sorted.length; i++) {
              const current = sorted[i];
              const prev = sorted[i - 1];
              if (i > 0 && current - prev > 1) {
                const from = prev + 1;
                const to = current - 1;
                const midpoint = Math.floor((from + to) / 2);
                pieces.push({ kind: 'gap', from, to, midpoint, key: `gap-${prev}-${current}` });
              }
              pieces.push(current);
            }

            return pieces.map(piece => {
              if (typeof piece !== 'number') {
                return (
                  <button
                    key={piece.key}
                    type="button"
                    className={styles.pageBtn}
                    aria-label={`Jump to page ${piece.midpoint + 1}`}
                    onClick={() => onPageChange?.(piece.midpoint)}
                    title={`Jump to pages ${piece.from + 1}-${piece.to + 1}`}
                  >…</button>
                );
              }
              const p = piece;
              const isActive = p === page;
              const distance = Math.abs(p - page);
              const extraMobile = distance === 2 && p !== first && p !== lastIdx; // mark far neighbors
              return (
                <button
                  key={p}
                  type="button"
                  className={`${styles.pageBtn} ${isActive ? styles.pageBtnActive : ''} ${extraMobile ? styles.pageBtnExtraMobile : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Page ${p + 1}`}
                  onClick={() => !isActive && onPageChange?.(p)}
                >{p + 1}</button>
              );
            });
          })()}
          <button
            type="button"
            className={`${styles.pageBtn} ${!canNext ? styles.pageBtnDisabled : ''}`}
            onClick={() => canNext && onPageChange?.(page + 1)}
            disabled={!canNext}
            aria-label="Next page"
          >
            ›
          </button>
          <select
            value={size}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className={styles.pageSizeSelect}
            aria-label="Page size"
          >
            {[10,25,50,100].map(s => <option key={s} value={s}>{s}/page</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};