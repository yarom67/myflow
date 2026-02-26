import Dexie, { type EntityTable } from 'dexie';
import type { Transaction, Category, FixedExpense, Settings } from '../types';

export const db = new Dexie('myflow-db') as Dexie & {
  transactions: EntityTable<Transaction, 'id'>;
  categories: EntityTable<Category, 'id'>;
  settings: EntityTable<Settings, 'id'>;
  fixedExpenses: EntityTable<FixedExpense, 'id'>;
};

db.version(1).stores({
  transactions: 'id, date, categoryId, type',
  categories: 'id, name',
  settings: 'id',
  fixedExpenses: 'id',
});
