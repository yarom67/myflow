import { motion } from 'motion/react';

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  color = '#7C3AED',
  height = 8,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm text-text-secondary">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-text-primary">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full bg-surface-hover overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          }}
        />
      </div>
    </div>
  );
}
