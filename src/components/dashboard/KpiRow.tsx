import { TrendingUp, TrendingDown } from 'lucide-react';
import { useBudget } from '../../hooks/useBudget';
import { useCurrency } from '../../hooks/useCurrency';
import { KpiCard } from './KpiCard';

interface KpiRowProps {
  month: string;
}

export function KpiRow({ month }: KpiRowProps) {
  const { totalIncome, totalExpenses, savingsRate } = useBudget(month);
  const { format } = useCurrency();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard
        label="סה״כ הכנסות"
        value={totalIncome}
        formatValue={format}
        icon={<TrendingUp className="h-5 w-5 text-success" />}
      />
      <KpiCard
        label="סה״כ הוצאות"
        value={totalExpenses}
        formatValue={format}
        icon={<TrendingDown className="h-5 w-5 text-danger" />}
      />
      <KpiCard
        label="אחוז חיסכון"
        value={savingsRate}
        formatValue={(v) => `${Math.round(v)}%`}
        icon={<span />}
        ring={{ percent: savingsRate, color: '#7C3AED' }}
      />
    </div>
  );
}
