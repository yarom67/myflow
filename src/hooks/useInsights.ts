import { useMemo } from 'react';
import { useMonthTransactions, useCategories } from '../db/hooks';
import { getPreviousMonth } from '../lib/dates';

interface Insight {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral';
  value?: number;
}

export function useInsights(month: string) {
  const currentTransactions = useMonthTransactions(month);
  const prevMonth = getPreviousMonth(month);
  const prevTransactions = useMonthTransactions(prevMonth);
  const categories = useCategories();

  return useMemo(() => {
    const insights: Insight[] = [];

    const currentExpenses = currentTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const prevExpenses = prevTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Total spending comparison
    if (prevExpenses > 0) {
      const change = ((currentExpenses - prevExpenses) / prevExpenses) * 100;
      if (Math.abs(change) > 5) {
        insights.push({
          id: 'total-spending',
          text: change > 0
            ? `ההוצאות עלו ב-${Math.round(Math.abs(change))}% בהשוואה לחודש שעבר`
            : `ההוצאות ירדו ב-${Math.round(Math.abs(change))}% בהשוואה לחודש שעבר`,
          type: change > 0 ? 'negative' : 'positive',
          value: change,
        });
      }
    }

    // Per-category comparison
    for (const cat of categories) {
      if (cat.name === 'הכנסה') continue;

      const currentCatSpend = currentTransactions
        .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      const prevCatSpend = prevTransactions
        .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);

      if (prevCatSpend > 0 && currentCatSpend > 0) {
        const change = ((currentCatSpend - prevCatSpend) / prevCatSpend) * 100;
        if (Math.abs(change) > 15) {
          insights.push({
            id: `cat-${cat.id}`,
            text: change > 0
              ? `הוצאת ${Math.round(Math.abs(change))}% יותר על ${cat.name} מאשר בחודש שעבר`
              : `חסכת ${Math.round(Math.abs(change))}% על ${cat.name} בהשוואה לחודש שעבר`,
            type: change > 0 ? 'negative' : 'positive',
            value: change,
          });
        }
      }

      // Budget warning
      if (cat.monthlyBudget && currentCatSpend > cat.monthlyBudget) {
        insights.push({
          id: `budget-${cat.id}`,
          text: `חרגת מתקציב ${cat.name} ב-${Math.round(currentCatSpend - cat.monthlyBudget)} ₪`,
          type: 'negative',
        });
      }
    }

    // Top spending category
    const categorySpending = new Map<string, number>();
    for (const t of currentTransactions) {
      if (t.type === 'expense') {
        categorySpending.set(t.categoryId, (categorySpending.get(t.categoryId) ?? 0) + t.amount);
      }
    }
    const topCategory = [...categorySpending.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      const cat = categories.find((c) => c.id === topCategory[0]);
      if (cat) {
        insights.push({
          id: 'top-category',
          text: `הקטגוריה עם ההוצאה הכי גבוהה: ${cat.name}`,
          type: 'neutral',
        });
      }
    }

    return insights;
  }, [currentTransactions, prevTransactions, categories, month]);
}

export function useMonthComparison(month: string, monthsBack: number = 6) {
  const months: string[] = [];
  let current = month;
  for (let i = 0; i < monthsBack; i++) {
    months.unshift(current);
    current = getPreviousMonth(current);
  }

  // We need to use the individual month hooks
  // Since we can't call hooks in a loop, we'll compute this differently
  const m1 = useMonthTransactions(months[0] ?? month);
  const m2 = useMonthTransactions(months[1] ?? month);
  const m3 = useMonthTransactions(months[2] ?? month);
  const m4 = useMonthTransactions(months[3] ?? month);
  const m5 = useMonthTransactions(months[4] ?? month);
  const m6 = useMonthTransactions(months[5] ?? month);

  return useMemo(() => {
    const allMonths = [m1, m2, m3, m4, m5, m6];
    return months.map((m, i) => {
      const txs = allMonths[i] ?? [];
      const income = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expenses = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const [, monthNum] = m.split('-');
      const hebrewMonths = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
      return {
        month: m,
        label: hebrewMonths[parseInt(monthNum!) - 1],
        income,
        expenses,
      };
    });
  }, [months, m1, m2, m3, m4, m5, m6]);
}
