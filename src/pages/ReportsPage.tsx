import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { getMonthLabel, getPreviousMonth, getNextMonth } from '../lib/dates';
import { MonthComparison } from '../components/reports/MonthComparison';
import { InsightsGrid } from '../components/reports/InsightsGrid';
import { CategoryBreakdown } from '../components/reports/CategoryBreakdown';
import { useBudget } from '../hooks/useBudget';
import { useCurrency } from '../hooks/useCurrency';

export function ReportsPage() {
  const { selectedMonth, setSelectedMonth } = useUiStore();
  const budget = useBudget(selectedMonth);
  const { format } = useCurrency();

  return (
    <div className="space-y-8 pb-8">
      {/* Header with month selector */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">דוחות</h1>
          <p className="text-text-muted text-sm mt-0.5">ניתוח הוצאות והכנסות</p>
        </div>
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl px-1 py-1">
          <button
            onClick={() => setSelectedMonth(getPreviousMonth(selectedMonth))}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <span className="text-sm font-semibold text-text-primary px-2 min-w-20 text-center">
            {getMonthLabel(selectedMonth)}
          </span>
          <button
            onClick={() => setSelectedMonth(getNextMonth(selectedMonth))}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      {/* Monthly summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
        {[
          { label: 'סה״כ הכנסות', value: format(budget.totalIncome), color: 'text-success' },
          { label: 'סה״כ הוצאות', value: format(budget.totalExpenses), color: 'text-danger' },
          { label: 'הוצאות קבועות', value: format(budget.totalFixedExpenses), color: 'text-warning' },
          { label: 'חיסכון', value: `${Math.round(budget.savingsRate)}%`, color: 'text-accent' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-surface border border-border rounded-xl p-4">
            <p className="text-xs font-medium text-text-muted mb-1.5">{label}</p>
            <p className={`text-lg sm:text-xl font-black tracking-tight ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <MonthComparison month={selectedMonth} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        <InsightsGrid month={selectedMonth} />
        <CategoryBreakdown month={selectedMonth} />
      </div>
    </div>
  );
}
