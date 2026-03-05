import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartData } from '../../hooks/useChartData';
import { useCurrency } from '../../hooks/useCurrency';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-surface-hover border border-border-strong rounded-xl p-3 text-sm shadow-xl">
      <p className="text-text-primary font-semibold">{data.name}</p>
      <p className="text-text-secondary mt-0.5">{data.value.toLocaleString()} ₪</p>
      <p className="text-text-muted text-xs mt-0.5">{Math.round(data.percent * 100)}%</p>
    </div>
  );
};

export function SpendingDonut({ month }: { month: string }) {
  const { donutData } = useChartData(month);
  const { format } = useCurrency();
  const total = donutData.reduce((s, d) => s + d.value, 0);

  const dataWithPercent = donutData.map((d) => ({
    ...d,
    percent: total > 0 ? d.value / total : 0,
  }));

  if (donutData.length === 0) {
    return (
      <div className="bg-surface shadow-card rounded-2xl p-6 flex flex-col items-center justify-center h-80 gap-3">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center">
          <span className="text-2xl">🍩</span>
        </div>
        <p className="text-text-secondary text-sm">אין הוצאות להצגה</p>
      </div>
    );
  }

  return (
    <div className="bg-surface shadow-card rounded-2xl p-5 sm:p-6">
      <h3 className="text-base font-bold text-text-primary mb-4 tracking-tight">הוצאות לפי קטגוריה</h3>
      <div className="h-60" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {dataWithPercent.map((entry, i) => (
                <radialGradient key={i} id={`donut-grad-${i}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                </radialGradient>
              ))}
            </defs>
            <Pie
              data={dataWithPercent}
              cx="50%" cy="50%"
              innerRadius={55} outerRadius={82}
              paddingAngle={3} dataKey="value" stroke="none"
            >
              {dataWithPercent.map((entry, i) => (
                <Cell key={i} fill={`url(#donut-grad-${i})`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <text x="50%" y="45%" textAnchor="middle" fill="#1E1B4B" fontSize={17} fontWeight={800}>
              {format(total)}
            </text>
            <text x="50%" y="58%" textAnchor="middle" fill="#6B7280" fontSize={11}>
              סה״כ הוצאות
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
        {dataWithPercent.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span>{d.name}</span>
            <span className="text-text-muted">({Math.round(d.percent * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
