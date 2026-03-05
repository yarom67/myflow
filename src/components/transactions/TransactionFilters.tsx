import { Search } from 'lucide-react';
import { useCategories } from '../../db/hooks';
import type { TransactionFilters } from '../../types';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface Props {
  filters: TransactionFilters;
  onFilterChange: (filters: TransactionFilters) => void;
}

export function TransactionFilters({ filters, onFilterChange }: Props) {
  const categories = useCategories();
  const set = (partial: Partial<TransactionFilters>) => onFilterChange({ ...filters, ...partial });

  const activeType = filters.type ?? 'all';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <Input
          type="text"
          placeholder="חיפוש..."
          value={filters.search ?? ''}
          onChange={(e) => set({ search: e.target.value })}
          className="ps-9"
        />
      </div>

      {/* Type tabs */}
      <Tabs
        value={activeType}
        onValueChange={(v) => set({ type: v === 'all' ? undefined : (v as 'expense' | 'income') })}
      >
        <TabsList>
          <TabsTrigger value="all">הכל</TabsTrigger>
          <TabsTrigger value="expense">הוצאות</TabsTrigger>
          <TabsTrigger value="income">הכנסות</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Category filter */}
      <Select
        value={filters.categoryId ?? '__all__'}
        onValueChange={(v) => set({ categoryId: v === '__all__' ? undefined : v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="כל הקטגוריות" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">כל הקטגוריות</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
