import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useChartData } from '../../hooks/useChartData';
import { useCurrency } from '../../hooks/useCurrency';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-surface-hover border border-border-strong rounded-xl p-3 text-sm shadow-xl">
      <p className="text-text-secondary text-xs mb-1">{label}</p>
      <p className="text-accent font-bold">{payload[0].value.toLocaleString()} ₪</p>
    </div>
  );
};

export function SpendingAreaChart({ month }: { month: string }) {
  const { areaData } = useChartData(month);
  const { format } = useCurrency();

  if (areaData.length === 0) {
    return (
      <div className="bg-surface shadow-card rounded-2xl p-6 flex flex-col items-center justify-center h-80 gap-3">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center">
          <span className="text-2xl">📈</span>
        </div>
        <p className="text-text-secondary text-sm">אין נתונים להצגה</p>
      </div>
    );
  }

  return (
    <div className="bg-surface shadow-card rounded-2xl p-5 sm:p-6">
      <h3 className="text-base font-bold text-text-primary mb-4 tracking-tight">מגמת הוצאות יומית</h3>
      <div className="h-60" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={areaData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradientPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                <stop offset="60%" stopColor="#7C3AED" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: '#A0A0B8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#A0A0B8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(124,58,237,0.3)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#7C3AED"
              strokeWidth={2}
              fill="url(#areaGradientPurple)"
              dot={false}
              activeDot={{ r: 4, fill: '#7C3AED', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
