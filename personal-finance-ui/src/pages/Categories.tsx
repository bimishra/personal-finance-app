import React, { useEffect, useMemo, useRef, useState, useId } from 'react'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { fetchCategories, deleteCategory, createCategory, updateCategory } from '@/state/slices/categoriesSlice'
import CategoryForm from '@/features/categories/CategoryForm'
import { CategoryList } from '@/features/categories/CategoryList'
import { CategoryFormData } from '@/features/categories/types'
import toast from 'react-hot-toast'
import styles from './Categories.module.css'
import { Category } from '@/types'
import Fuse from 'fuse.js'
import { duplicateDetectionConfig, canonicalizeName, synonyms } from '@/features/categories/duplicateConfig'
import Modal from '@/components/Modal'

export default function Categories() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(s => s.categories.items)
  const [open, setOpen] = useState(false)

  // Fuzzy duplicate detection state
  const [duplicateWarning, setDuplicateWarning] = useState<null | { name: string; matches: Category[] }>(null)
  const [overridePending, setOverridePending] = useState(false)
  const pendingCreateRef = useRef<CategoryFormData | null>(null)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleUpdateCategory = async (category: Category, formData: CategoryFormData) => {
    try {
      await dispatch(updateCategory({ id: category.id, ...formData })).unwrap();
      toast.success(`Category "${formData.name}" updated successfully!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update category');
      throw err;
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await dispatch(deleteCategory(category.id)).unwrap();
      toast.success(`Category "${category.name}" deleted successfully!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete category');
      throw err;
    }
  };
  // Segmentation
  const defaultCategories = useMemo(() => categories.filter(c => c.defaultCategory).sort((a,b)=>a.name.localeCompare(b.name)), [categories]);
  const userCategories = useMemo(() => categories.filter(c => !c.defaultCategory).sort((a,b)=>a.name.localeCompare(b.name)), [categories]);

  // Fuse index for fuzzy detection across ALL categories (so duplicates with defaults also flagged)
  const fuse = useMemo(() => {
    if (!categories.length) return null;
    return new Fuse(categories, {
      keys: ['name'],
      threshold: duplicateDetectionConfig.fuseScoreThreshold,
      ignoreLocation: true,
      minMatchCharLength: duplicateDetectionConfig.minMatchCharLength,
      distance: duplicateDetectionConfig.distance,
      includeScore: true,
    });
  }, [categories]);

  // Canonical cache to avoid recomputation for existing categories
  const canonicalCache = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(c => {
      map.set(c.id, canonicalizeName(c.name, synonyms));
    });
    return map;
  }, [categories]);

  // Levenshtein distance for additional semantic closeness beyond Fuse scoring
  const levenshtein = (a: string, b: string): number => {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (m === 0) return n; if (n === 0) return m;
    const dp: number[] = Array(n + 1).fill(0);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = dp[j];
        if (a[i - 1] === b[j - 1]) {
          dp[j] = prev;
        } else {
          dp[j] = Math.min(prev + 1, dp[j] + 1, dp[j - 1] + 1);
        }
        prev = tmp;
      }
    }
    return dp[n];
  };

  const runDuplicateCheck = (values: CategoryFormData) => {
    const original = values.name.trim();
    if (!original) return null;
    const lc = original.toLowerCase();
  const canon = canonicalizeName(original, synonyms);

    // 1. Exact (case-insensitive) match
    const exact = categories.filter(c => c.name.toLowerCase() === lc);
    if (exact.length) return exact;

    // 2. Canonical form match (singular/plural normalization)
  const canonicalMatches = categories.filter(c => canonicalCache.get(c.id) === canon);
    if (canonicalMatches.length) return canonicalMatches;

    // 3. Levenshtein near match (distance threshold relative to length)
    const levMatches = categories.filter(c => {
  const otherCanon = canonicalCache.get(c.id) || canonicalizeName(c.name, synonyms);
  const dist = levenshtein(canon, otherCanon);
      if (canon.length <= 4) return dist === 1; // very short words tolerance
      if (canon.length <= 7) return dist <= 2;
      return dist <= 3;
    });
    if (levMatches.length) return levMatches;

    // 4. Fuse fuzzy search as a broader net
    if (!fuse) return null;
    const fuseResults = fuse.search(original)
      .filter(r => typeof r.score === 'number' && r.score <= duplicateDetectionConfig.fuseScoreThreshold)
      .map(r => r.item);
    if (fuseResults.length) return fuseResults;

    return null;
  };

  const handleCreate = async (values: CategoryFormData, keepOpen?: boolean) => {
    // If we already allowed override just proceed
    if (!overridePending) {
      const matches = runDuplicateCheck(values);
      if (matches && matches.length) {
        pendingCreateRef.current = values;
        setDuplicateWarning({ name: values.name.trim(), matches });
        setOverridePending(true);
        return; // wait for user confirmation
      }
    }
    try {
      await dispatch(createCategory(values)).unwrap();
      toast.success('Category created successfully');
      pendingCreateRef.current = null;
      setDuplicateWarning(null);
      setOverridePending(false);
      if (!keepOpen) setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    }
  }

  const confirmOverride = () => {
    if (pendingCreateRef.current) {
      handleCreate(pendingCreateRef.current, true /* keepOpen so form stays if user wants more */);
    }
  }

  return (
    <div>
      <div className={styles.headerWrap}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Categories</h1>
            <p className={styles.subtitle}>
              Manage your income and expense categories
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className={styles.newBtn}
          >
            <svg 
              className={styles.icon} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Category
          </button>
        </div>
      </div>

      { /* Modern two-panel layout */ }
      <div className={styles.panels}>
        {(() => {
          const panelTitleId = `user-categories-${useId()}`;
          return (
            <section className={styles.panel} aria-labelledby={panelTitleId}>
              <header className={styles.panelHeader}>
                <span className={styles.panelBadge}>Custom</span>
                <h2 id={panelTitleId} className={styles.panelTitle}>Your Categories</h2>
                <div className={styles.panelHeaderActions}>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={styles.inlineNewBtn}
                    aria-label="Create category"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
                    <span>Add</span>
                  </button>
                </div>
              </header>
              <p className={styles.panelDescription}>Create custom categories to better classify your transactions.</p>
              {userCategories.length > 0 ? (
                <CategoryList
                  categories={userCategories}
                  onDelete={handleDeleteCategory}
                  onUpdate={handleUpdateCategory}
                />
              ) : (
                <div className={styles.emptyState} role="status" aria-live="polite">
                  <div className={styles.emptyStateInner}>
                    <div className={styles.emptyIconWrap} aria-hidden="true">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M5 7l1.5 12.5A2 2 0 008.49 21h7.02a2 2 0 001.99-1.5L19 7M9 7V5a3 3 0 016 0v2"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6M9 15h3"/></svg>
                    </div>
                    <h3 className={styles.emptyTitle}>No custom categories yet</h3>
                    <p className={styles.emptySubtitle}>You can start by creating one. Default categories are always available alongside your custom ones.</p>
                    <button type="button" onClick={() => setOpen(true)} className={styles.emptyCtaBtn}>Create Category</button>
                  </div>
                </div>
              )}
            </section>
          )
        })()}

        {(() => {
          const panelTitleId = `default-categories-${useId()}`;
          return (
            <section className={styles.panel} aria-labelledby={panelTitleId}>
              <header className={styles.panelHeader}>
                <span className={`${styles.panelBadge} ${styles.panelBadgeMuted}`}>System</span>
                <h2 id={panelTitleId} className={styles.panelTitle}>Default Library</h2>
              </header>
              <p className={styles.panelDescription}>Predefined categories you can immediately use. These cannot be edited or deleted.</p>
              <CategoryList
                categories={defaultCategories}
              />
            </section>
          )
        })()}
      </div>

      <Modal
        layer="top"
        open={Boolean(duplicateWarning)}
        onClose={() => { setDuplicateWarning(null); setOverridePending(false); pendingCreateRef.current = null; }}
        title="Possible duplicates"
      >
        {duplicateWarning && (
          <div role="alert" aria-live="polite" className={styles.warningBody}>
            <div className={styles.warningIconRow}>
              <div className={styles.warningIconWrap} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.516 11.59c.75 1.335-.213 2.986-1.742 2.986H3.483c-1.53 0-2.492-1.651-1.742-2.986L8.257 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5A.75.75 0 0110 12z" />
                </svg>
              </div>
              <div className={styles.warningContent}>
                <p className={styles.warningIntro}>Possible duplicates detected</p>
                <p className={styles.warningDetails}>The name "{duplicateWarning.name}" is similar to existing category{duplicateWarning.matches.length > 1 ? 'ies' : ''}. Review the list below – you can still create it if you really need a new one.</p>
                <ul className={styles.warningList}>
                  {duplicateWarning.matches.map(m => (
                    <li key={m.id}>{m.name}{m.defaultCategory ? ' (default)' : ''}</li>
                  ))}
                </ul>
                <div className={styles.duplicateActions}>
                  <button type="button" onClick={confirmOverride} className={styles.overrideBtn}>Create Anyway</button>
                  <button type="button" onClick={() => { setDuplicateWarning(null); setOverridePending(false); pendingCreateRef.current = null; }} className={styles.cancelOverrideBtn}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <CategoryForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
