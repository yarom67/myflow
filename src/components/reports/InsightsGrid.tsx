import { useInsights } from '../../hooks/useInsights';
import { InsightCard } from './InsightCard';

export function InsightsGrid({ month }: { month: string }) {
  const insights = useInsights(month);

  if (insights.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 text-center">
        <p className="text-text-secondary">אין מספיק נתונים לתובנות</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">תובנות</h3>
      <div className="grid gap-3">
        {insights.map((insight) => (
          <InsightCard key={insight.id} text={insight.text} type={insight.type} />
        ))}
      </div>
    </div>
  );
}
