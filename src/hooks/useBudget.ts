import { useMemo } from 'react';
import { useMonthTransactions, useSettings, useFixedExpenses, useCategories } from '../db/hooks';
import { getDaysLeftInMonth, getDaysInMonth } from '../lib/dates';

export function useBudget(month: string) {
  const transactions = useMonthTransactions(month);
  const settings = useSettings();
  const fixedExpenses = useFixedExpenses();
  const categories = useCategories();

  return useMemo(() => {
    const monthlyIncome = settings?.monthlyIncome ?? 0;
    const totalFixedExpenses = fixedExpenses.reduce((sum, fe) => sum + fe.amount, 0);

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const freeToSpend = monthlyIncome - totalFixedExpenses - totalExpenses;
    const daysLeft = getDaysLeftInMonth();
    const dailyBudget = daysLeft > 0 ? Math.max(0, freeToSpend / daysLeft) : 0;
    const totalBudget = monthlyIncome - totalFixedExpenses;
    const spentPercent = totalBudget > 0 ? ((totalExpenses / totalBudget) * 100) : 0;
    const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses - totalFixedExpenses) / totalIncome) * 100) : 0;

    // Status: green (>30% left), yellow (10-30%), red (<10%)
    const remainingPercent = totalBudget > 0 ? (freeToSpend / totalBudget) * 100 : 0;
    const status: 'good' | 'warning' | 'danger' =
      remainingPercent > 30 ? 'good' : remainingPercent > 10 ? 'warning' : 'danger';

    // Per-category spending
    const categorySpending = categories.map((cat) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        ...cat,
        spent,
        budgetPercent: cat.monthlyBudget ? (spent / cat.monthlyBudget) * 100 : 0,
      };
    });

    return {
      monthlyIncome,
      totalFixedExpenses,
      totalIncome,
      totalExpenses,
      freeToSpend,
      daysLeft,
      dailyBudget,
      spentPercent,
      savingsRate: Math.max(0, savingsRate),
      status,
      categorySpending,
      daysInMonth: getDaysInMonth(month),
    };
  }, [transactions, settings, fixedExpenses, categories, month]);
}
