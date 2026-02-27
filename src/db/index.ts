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

db.version(2).stores({
  transactions: 'id, date, categoryId, type',
  categories: 'id, name',
  settings: 'id',
  fixedExpenses: 'id',
}).upgrade(async (tx) => {
  await tx.table('transactions').clear();
  await tx.table('fixedExpenses').clear();
  await tx.table('settings').put({
    id: 'main',
    name: '',
    monthlyIncome: 0,
    savingsGoal: 0,
    currency: 'ILS',
    dateFormat: 'dd/MM/yyyy',
  });
});
