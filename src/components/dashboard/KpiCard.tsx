import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { MagicCard } from '../magicui/magic-card';
import { NumberTicker } from '../magicui/number-ticker';

interface KpiCardProps {
  label: string;
  value: number;
  formatValue: (value: number) => string;
  icon: ReactNode;
  trend?: { value: number; positive: boolean };
  ring?: { percent: number; color: string };
}

function ProgressRing({ percent, color }: { percent: number; color: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clampedPercent / 100) * circumference;

  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <circle cx="22" cy="22" r={radius} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="3" />
      <motion.circle
        cx="22" cy="22" r={radius} fill="none"
        stroke={color} strokeWidth="3" strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        transform="rotate(-90 22 22)"
      />
      <text
        x="22" y="22" textAnchor="middle" dominantBaseline="central"
        fill="#52525B" fontSize="8" fontWeight="600"
        fontFamily="DM Mono, ui-monospace, monospace"
      >
        {Math.round(clampedPercent)}%
      </text>
    </svg>
  );
}

export function KpiCard({ label, value, formatValue, icon, trend, ring }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-surface shadow-card overflow-hidden"
    >
      <MagicCard className="p-4 sm:p-5 flex flex-col gap-3 w-full">
        {/* Top row: label + accessory */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium text-text-secondary leading-tight">{label}</span>
          {ring ? (
            <ProgressRing percent={ring.percent} color={ring.color} />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-hover border border-border">
              {icon}
            </div>
          )}
        </div>

        {/* Bottom: value + trend */}
        <div className="flex flex-col gap-0.5">
          <NumberTicker
            value={value}
            formatFn={formatValue}
            className="text-2xl font-black font-data text-text-primary tracking-tight"
          />
          {trend && (
            <span className={`text-xs font-semibold ${trend.positive ? 'text-success' : 'text-danger'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </MagicCard>
    </motion.div>
  );
}
