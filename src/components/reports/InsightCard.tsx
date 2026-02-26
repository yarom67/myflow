import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface InsightCardProps {
  text: string;
  type: 'positive' | 'negative' | 'neutral';
}

export function InsightCard({ text, type }: InsightCardProps) {
  const config = {
    positive: { icon: TrendingDown, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
    negative: { icon: TrendingUp, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20' },
    neutral: { icon: Info, color: 'text-cyan', bg: 'bg-cyan/10', border: 'border-cyan/20' },
  }[type];

  const Icon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 flex items-start gap-3`}>
      <Icon className={`${config.color} shrink-0 mt-0.5`} size={18} />
      <p className="text-sm text-text-primary leading-relaxed">{text}</p>
    </div>
  );
}
