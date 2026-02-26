import type { ReactNode } from 'react';

type BadgeVariant = 'filled' | 'outline';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  variant?: BadgeVariant;
}

export function Badge({
  children,
  color = '#7C3AED',
  variant = 'filled',
}: BadgeProps) {
  const filledStyle = {
    backgroundColor: `${color}20`,
    color: color,
  };

  const outlineStyle = {
    backgroundColor: 'transparent',
    color: color,
    borderColor: `${color}40`,
  };

  return (
    <span
      style={variant === 'filled' ? filledStyle : outlineStyle}
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-medium rounded-md
        ${variant === 'outline' ? 'border' : ''}
      `}
    >
      {children}
    </span>
  );
}
