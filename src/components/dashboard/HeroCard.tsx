import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { CalendarDays, TrendingUp } from 'lucide-react';

interface HeroCardProps {
  freeToSpend: number;
  daysLeft: number;
  dailyBudget: number;
  status: 'good' | 'warning' | 'danger';
  formatCurrency: (amount: number) => string;
}

const statusConfig = {
  good: {
    color: 'text-success',
    accentColor: '#059669',
    label: 'מצב תקין',
    badgeClass: 'text-success bg-success/10',
  },
  warning: {
    color: 'text-warning',
    accentColor: '#D97706',
    label: 'שים לב',
    badgeClass: 'text-warning bg-warning/10',
  },
  danger: {
    color: 'text-danger',
    accentColor: '#DC2626',
    label: 'חריגה מהתקציב',
    badgeClass: 'text-danger bg-danger/10',
  },
};

function AnimatedNumber({
  value,
  formatCurrency,
}: {
  value: number;
  formatCurrency: (amount: number) => string;
}) {
  const spring = useSpring(0, { stiffness: 50, damping: 18 });
  const display = useTransform(spring, (v) => formatCurrency(Math.round(v)));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function HeroCard({
  freeToSpend,
  daysLeft,
  dailyBudget,
  status,
  formatCurrency,
}: HeroCardProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-2xl bg-surface shadow-card"
      style={{ borderTop: `3px solid ${config.accentColor}` }}
    >
      <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Left — main figure */}
        <div className="flex-1 flex flex-col gap-2">
          <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${config.badgeClass}`}>
            {config.label}
          </span>
          <p className="text-sm font-medium text-text-secondary">פנוי להוצאה החודש</p>
          <span
            className={`text-4xl sm:text-5xl lg:text-6xl font-black font-data tracking-tight ${config.color}`}
          >
            <AnimatedNumber value={freeToSpend} formatCurrency={formatCurrency} />
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px self-stretch bg-border" />
        <div className="sm:hidden h-px w-full bg-border" />

        {/* Right — stats */}
        <div className="flex sm:flex-col gap-5 sm:gap-4 sm:min-w-[120px]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-hover border border-border shrink-0">
              <CalendarDays size={14} className="text-text-muted" />
            </div>
            <div>
              <p className="text-xs text-text-muted">ימים נותרו</p>
              <p className="text-base font-bold font-data text-text-primary">{daysLeft}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-hover border border-border shrink-0">
              <TrendingUp size={14} className="text-text-muted" />
            </div>
            <div>
              <p className="text-xs text-text-muted">תקציב יומי</p>
              <p className="text-base font-bold font-data text-text-primary">
                {formatCurrency(Math.round(dailyBudget))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
