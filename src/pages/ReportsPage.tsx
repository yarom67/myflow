import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { getMonthLabel, getPreviousMonth, getNextMonth } from '../lib/dates';
import { MonthComparison } from '../components/reports/MonthComparison';
import { InsightsGrid } from '../components/reports/InsightsGrid';

export function ReportsPage() {
  const { selectedMonth, setSelectedMonth } = useUiStore();

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

      <MonthComparison month={selectedMonth} />

      <InsightsGrid month={selectedMonth} />
    </div>
  );
}
