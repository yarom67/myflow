import { useMemo } from 'react';
import { useMonthTransactions } from '../db/hooks';
import type { TransactionFilters, Transaction } from '../types';

export function useFilteredTransactions(month: string, filters: TransactionFilters) {
  const transactions = useMonthTransactions(month);

  return useMemo(() => {
    let filtered = [...transactions];

    if (filters.categoryId) {
      filtered = filtered.filter((t) => t.categoryId === filters.categoryId);
    }

    if (filters.type) {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((t) => t.description.toLowerCase().includes(search));
    }

    // Sort by date descending
    filtered.sort((a, b) => b.date.localeCompare(a.date));

    return filtered;
  }, [transactions, filters]);
}

export function groupTransactionsByDate(transactions: Transaction[]): [string, Transaction[]][] {
  const groups = new Map<string, Transaction[]>();
  for (const t of transactions) {
    if (!groups.has(t.date)) groups.set(t.date, []);
    groups.get(t.date)!.push(t);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => b.localeCompare(a));
}
