import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './index';
import type { Transaction, Category, Settings, FixedExpense } from '../types';

export function useAllTransactions(): Transaction[] {
  return useLiveQuery(() => db.transactions.toArray(), []) ?? [];
}

export function useMonthTransactions(month: string): Transaction[] {
  return useLiveQuery(
    () => {
      const [year, m] = month.split('-').map(Number);
      const start = `${year}-${String(m).padStart(2, '0')}-01`;
      const lastDay = new Date(year!, m!, 0).getDate();
      const end = `${year}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      return db.transactions.where('date').between(start, end, true, true).toArray();
    },
    [month]
  ) ?? [];
}

export function useCategories(): Category[] {
  return useLiveQuery(() => db.categories.toArray(), []) ?? [];
}

export function useSettings(): Settings | undefined {
  return useLiveQuery(() => db.settings.get('main'), []);
}

export function useFixedExpenses(): FixedExpense[] {
  return useLiveQuery(() => db.fixedExpenses.toArray(), []) ?? [];
}
