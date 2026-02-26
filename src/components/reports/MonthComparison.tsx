import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useMonthComparison } from '../../hooks/useInsights';
import { useCurrency } from '../../hooks/useCurrency';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-surface border border-border rounded-md p-3 text-sm">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()} ₪
        </p>
      ))}
    </div>
  );
};

export function MonthComparison({ month }: { month: string }) {
  const data = useMonthComparison(month);
  const { symbol } = useCurrency();

  return (
    <div className="bg-surface shadow-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">השוואה חודשית</h3>
      <div className="h-72" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#A0A0B8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#A0A0B8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="הכנסות" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expenses" name="הוצאות" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
