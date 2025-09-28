import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Category } from '@/types';
import { useAppDispatch } from '@/state/hooks';
import { createCategory } from '@/state/slices/categoriesSlice';

interface CategorySelectProps {
  label?: string;
  categories: Category[];
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  persistenceKey?: string; // used to remember last selection per context (e.g., transaction kind)
  pinnedIds?: string[]; // categories to show at top
  allowCreate?: boolean;
  newCategoryType?: 'INCOME' | 'EXPENSE';
  hideLabel?: boolean;
}

// Accessible custom select / listbox for categories with dynamic direction
export const CategorySelect: React.FC<CategorySelectProps> = ({
  label = 'Category',
  categories,
  value,
  onChange,
  placeholder = 'Select category',
  disabled,
  required,
  className,
  persistenceKey,
  pinnedIds = [],
  allowCreate = false,
  newCategoryType,
  hideLabel = false
}) => {
  const dispatch = useAppDispatch();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const listboxId = useId();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [rawQuery, setRawQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [createMode, setCreateMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(rawQuery.trim().toLowerCase()), 160);
    return () => clearTimeout(handle);
  }, [rawQuery]);

  // Persistence
  useEffect(() => {
    if (!persistenceKey || !value) return;
    try { localStorage.setItem(`cat:last:${persistenceKey}`, value); } catch {}
  }, [value, persistenceKey]);
  useEffect(() => {
    if (!persistenceKey || value) return;
    try {
      const stored = localStorage.getItem(`cat:last:${persistenceKey}`);
      if (stored && categories.some(c => c.id === stored)) {
        onChange(stored);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistenceKey, categories.length]);

  // Fuzzy filter (simple scoring: substring priority, then char sequence)
  const filtered = React.useMemo(() => {
    if (!debouncedQuery) return categories;
    const q = debouncedQuery;
    const scored = categories.map(c => {
      const name = c.name.toLowerCase();
      if (name === q) return { c, score: 0 };
      const idx = name.indexOf(q);
      if (idx >= 0) return { c, score: 10 + idx }; // direct substring modest score
      // sequential char match
      let qi = 0; let seq = 0;
      for (let i = 0; i < name.length && qi < q.length; i++) {
        if (name[i] === q[qi]) { qi++; seq++; }
      }
      if (qi === q.length) return { c, score: 100 + (name.length - seq) };
      return { c, score: 1000 };
    });
    return scored.filter(s => s.score < 1000).sort((a,b) => a.score - b.score).map(s => s.c);
  }, [debouncedQuery, categories]);

  // Grouping: pinned first section, then alphabetical rest
  const grouped = React.useMemo(() => {
    const pinned: Category[] = [];
    const rest: Category[] = [];
    const setPinned = new Set(pinnedIds);
    filtered.forEach(c => (setPinned.has(c.id) ? pinned.push(c) : rest.push(c)));
    rest.sort((a,b) => a.name.localeCompare(b.name));
    if (pinned.length) return [{ label: 'Pinned', items: pinned }, { label: 'All', items: rest }];
    return [{ label: 'All', items: rest }];
  }, [filtered, pinnedIds]);

  // Compute active index from current value
  useEffect(() => {
    // active index within filtered list (flattened grouped)
    const flat = grouped.flatMap(g => g.items);
    const idx = flat.findIndex(c => c.id === value);
    setActiveIndex(idx);
  }, [value, grouped]);

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    setOpen(o => !o);
    setCreateMode(false);
  }, [disabled]);

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  // Positioning: decide if list should open upward or downward
  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const estimatedHeight = Math.min(320, 40 + categories.length * 36); // rough estimate
    setDirection(spaceBelow < estimatedHeight && rect.top > estimatedHeight ? 'up' : 'down');
  }, [open, categories.length]);

  // Handle create new category
  const handleCreate = async () => {
    if (!allowCreate) return;
    if (!newCategoryType) {
      setError('Category type not specified');
      return;
    }
    if (!newName.trim()) {
      setError('Name required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const action = await dispatch(createCategory({ name: newName.trim(), type: newCategoryType, description: newDesc || undefined } as any));
      if ('payload' in action && (action as any).payload?.id) {
        const created = (action as any).payload as Category;
        onChange(created.id);
        setCreateMode(false);
        setOpen(false);
        setNewName('');
        setNewDesc('');
      } else if ((action as any).error) {
        setError((action as any).error?.message || 'Failed to create');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  const cancelCreate = () => {
    setCreateMode(false);
    setNewName('');
    setNewDesc('');
    setError(null);
  };

  // Keyboard interactions
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => {
          const flat = grouped.flatMap(g => g.items);
          if (!flat.length) return -1;
          const n = i + 1 >= flat.length ? 0 : i + 1; return n;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => {
          const flat = grouped.flatMap(g => g.items);
          if (!flat.length) return -1;
          const n = i - 1 < 0 ? flat.length - 1 : i - 1; return n;
        });
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(() => {
          const flat = grouped.flatMap(g => g.items);
          return flat.length - 1;
        });
        break;
      case 'Enter':
      case ' ': {
        if (open && !createMode) {
          e.preventDefault();
          const flat = grouped.flatMap(g => g.items);
            if (activeIndex >= 0 && flat[activeIndex]) {
            onChange(flat[activeIndex].id);
            close();
          } else if (flat.length === 0) {
            close();
          }
        }
        // In create mode Enter triggers save
        if (open && createMode && (e.key === 'Enter')) {
          e.preventDefault();
          handleCreate();
        }
        break;
      }
      case 'Escape':
        if (open && !createMode) {
          e.preventDefault();
          close();
        }
        if (open && createMode) {
          e.preventDefault();
          cancelCreate();
        }
        break;
      case 'Tab':
        // Allow normal tab but close menu
        close();
        break;
    }
  };

  // Scroll active option into view
  useEffect(() => {
    if (!open || activeIndex < 0 || !listRef.current) return;
    const flat = grouped.flatMap(g => g.items);
    const el = listRef.current.querySelector(`[data-index='${activeIndex}']`) as HTMLElement | null;
    if (el && flat.length) {
      const parent = listRef.current;
      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      if (elRect.top < parentRect.top) {
        parent.scrollTop -= (parentRect.top - elRect.top);
      } else if (elRect.bottom > parentRect.bottom) {
        parent.scrollTop += (elRect.bottom - parentRect.bottom);
      }
    }
  }, [activeIndex, open, grouped]);

  const flatAll = grouped.flatMap(g => g.items);
  const selected = flatAll.find(c => c.id === value);

  return (
    <div className={['relative flex flex-col', className].filter(Boolean).join(' ')} ref={containerRef}>
      {label && !hideLabel && (
        <label className="text-xs font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={toggleOpen}
        onKeyDown={onKeyDown}
        className={[
          'group inline-flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-left text-sm transition',
          'shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500',
          disabled ? 'cursor-not-allowed opacity-60' : 'hover:border-gray-400 border-gray-300'
        ].join(' ')}
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected ? selected.name : placeholder}
        </span>
        <span className="ml-2 flex items-center text-gray-400 group-hover:text-gray-500">
          <svg
            className={['h-4 w-4 transition-transform', open ? 'rotate-180' : ''].join(' ')}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className={[
            'absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white text-sm shadow-lg ring-1 ring-black/5',
            direction === 'up' ? 'bottom-full mb-1 origin-bottom animate-scale-in-up' : 'top-full origin-top animate-scale-in'
          ].join(' ')}
        >
          {!createMode && (
            <>
              <div className="p-2 border-b border-gray-100">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search categories..."
                  value={rawQuery}
                  onChange={e => setRawQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  autoFocus
                />
              </div>
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                tabIndex={-1}
                className="max-h-72 overflow-auto py-1 focus:outline-none"
              >
                {grouped.map((group, groupIndex) => (
                  <React.Fragment key={group.label}>
                    {group.items.length > 0 && (
                      <li className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 select-none">{group.label}</li>
                    )}
                    {group.items.map((c, localIdx) => {
                      const flatIndex = grouped.slice(0, groupIndex).reduce((acc, g) => acc + g.items.length, 0) + localIdx;
                      const selected = c.id === value;
                      const active = flatIndex === activeIndex;
                      return (
                        <li
                          data-index={flatIndex}
                          id={`${listboxId}-opt-${flatIndex}`}
                          key={c.id}
                          role="option"
                          aria-selected={selected}
                          className={[
                            'flex cursor-pointer items-center justify-between px-3 py-2',
                            active && !selected ? 'bg-indigo-50 text-indigo-700' : '',
                            selected ? 'bg-indigo-600 text-white hover:bg-indigo-600' : 'hover:bg-gray-50',
                            'transition-colors'
                          ].join(' ')}
                          onMouseEnter={() => setActiveIndex(flatIndex)}
                          onMouseDown={e => { e.preventDefault(); }}
                          onClick={() => { onChange(c.id); close(); }}
                        >
                          <span className="truncate">{c.name}</span>
                          {selected && (
                            <svg className="ml-2 h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </li>
                      );
                    })}
                  </React.Fragment>
                ))}
                {grouped.every(g => g.items.length === 0) && (
                  <li className="px-3 py-2 text-gray-400 select-none" role="option" aria-disabled>
                    No results
                  </li>
                )}
                {allowCreate && !rawQuery && (
                  <li
                    role="option"
                    aria-selected={false}
                    className="mt-1 flex cursor-pointer items-center gap-2 border-t border-gray-100 px-3 py-2 text-indigo-600 hover:bg-indigo-50"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => { setCreateMode(true); setTimeout(() => { searchInputRef.current?.focus(); }, 0); }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" /></svg>
                    Create new category…
                  </li>
                )}
              </ul>
            </>
          )}
          {createMode && (
            <div className="flex flex-col gap-2 p-3" role="form" aria-label="Create new category">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Name</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Category name"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Description <span className="text-gray-400 lowercase font-normal">(optional)</span></label>
                <input
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Short description"
                />
              </div>
              {error && <div className="text-[10px] text-red-600">{error}</div>}
              <div className="mt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  onClick={cancelCreate}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={saving}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-60 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                >
                  {saving ? 'Saving…' : 'Create'}
                </button>
              </div>
              <div className="-mx-3 -mb-3 border-t border-gray-100 pt-2 px-3 text-[10px] text-gray-400 flex items-center gap-1">
                <span className="inline-block rounded bg-indigo-50 px-1.5 py-0.5 font-medium text-indigo-600">{newCategoryType || '—'}</span>
                category will be created
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
