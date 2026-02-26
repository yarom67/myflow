import { Search } from 'lucide-react';
import { useCategories } from '../../db/hooks';
import type { TransactionFilters } from '../../types';

interface Props {
  filters: TransactionFilters;
  onFilterChange: (filters: TransactionFilters) => void;
}

export function TransactionFilters({ filters, onFilterChange }: Props) {
  const categories = useCategories();
  const set = (partial: Partial<TransactionFilters>) => onFilterChange({ ...filters, ...partial });

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="חיפוש..."
          value={filters.search ?? ''}
          onChange={(e) => set({ search: e.target.value })}
          className="w-full bg-surface border border-border rounded-md ps-9 pe-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Type toggle */}
      <div className="flex bg-surface border border-border rounded-md overflow-hidden">
        {(['all', 'expense', 'income'] as const).map((t) => (
          <button
            key={t}
            onClick={() => set({ type: t === 'all' ? undefined : t })}
            className={`px-3 py-2 text-sm transition-colors ${
              (t === 'all' && !filters.type) || filters.type === t
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t === 'all' ? 'הכל' : t === 'expense' ? 'הוצאות' : 'הכנסות'}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <select
        value={filters.categoryId ?? ''}
        onChange={(e) => set({ categoryId: e.target.value || undefined })}
        className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
      >
        <option value="">כל הקטגוריות</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
