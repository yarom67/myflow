import { useMemo } from 'react';
import { useMonthTransactions, useCategories } from '../../db/hooks';
import { useCurrency } from '../../hooks/useCurrency';
import { icons } from 'lucide-react';

const LucideIcon = ({ name, ...props }: { name: string } & Record<string, any>) => {
  const Icon = icons[name as keyof typeof icons];
  return Icon ? <Icon {...props} /> : null;
};

export function CategoryBreakdown({ month }: { month: string }) {
  const transactions = useMonthTransactions(month);
  const categories = useCategories();
  const { format } = useCurrency();

  const breakdown = useMemo(() => {
    const spending = new Map<string, number>();
    for (const t of transactions) {
      if (t.type === 'expense') {
        spending.set(t.categoryId, (spending.get(t.categoryId) ?? 0) + t.amount);
      }
    }

    return categories
      .map((cat) => ({
        ...cat,
        spent: spending.get(cat.id) ?? 0,
      }))
      .filter((c) => c.spent > 0)
      .sort((a, b) => b.spent - a.spent);
  }, [transactions, categories]);

  const totalExpenses = breakdown.reduce((s, c) => s + c.spent, 0);

  if (breakdown.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">פירוט לפי קטגוריה</h3>
      <div className="space-y-3">
        {breakdown.map((cat) => {
          const percent = totalExpenses > 0 ? (cat.spent / totalExpenses) * 100 : 0;
          return (
            <div key={cat.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: cat.color + '20' }}>
                <LucideIcon name={cat.icon} size={16} style={{ color: cat.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-primary">{cat.name}</span>
                  <span className="text-sm text-text-secondary">{format(cat.spent)}</span>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
              <span className="text-xs text-text-muted w-10 text-start">{Math.round(percent)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
