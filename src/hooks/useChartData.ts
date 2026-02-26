import { useMemo } from 'react';
import { useMonthTransactions, useCategories } from '../db/hooks';
import { getDaysInMonth } from '../lib/dates';

export function useChartData(month: string) {
  const transactions = useMonthTransactions(month);
  const categories = useCategories();

  return useMemo(() => {
    // Donut chart data: expenses by category
    const expensesByCategory = new Map<string, number>();
    for (const t of transactions) {
      if (t.type === 'expense') {
        expensesByCategory.set(t.categoryId, (expensesByCategory.get(t.categoryId) ?? 0) + t.amount);
      }
    }

    const donutData = categories
      .map((cat) => ({
        name: cat.name,
        value: expensesByCategory.get(cat.id) ?? 0,
        color: cat.color,
        icon: cat.icon,
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);

    // Area chart data: cumulative spending by day
    const daysInMonth = getDaysInMonth(month);
    const [year, m] = month.split('-');
    const dailyExpenses = new Map<number, number>();

    for (const t of transactions) {
      if (t.type === 'expense') {
        const day = new Date(t.date).getDate();
        dailyExpenses.set(day, (dailyExpenses.get(day) ?? 0) + t.amount);
      }
    }

    let cumulative = 0;
    const areaData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${year}-${m}-${String(day).padStart(2, '0')}`;
      const today = new Date();
      const currentDate = new Date(dayStr);
      if (currentDate > today) break;

      cumulative += dailyExpenses.get(day) ?? 0;
      areaData.push({
        day,
        label: `${day}/${m}`,
        expenses: cumulative,
      });
    }

    return { donutData, areaData };
  }, [transactions, categories, month]);
}
