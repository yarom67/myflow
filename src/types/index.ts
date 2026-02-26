export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  receiptImageBase64?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  monthlyBudget?: number;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
}

export interface Settings {
  id: string;
  monthlyIncome: number;
  currency: string;
  dateFormat: string;
}

export interface TransactionFilters {
  month?: string;
  categoryId?: string;
  type?: TransactionType;
  search?: string;
}
