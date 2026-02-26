import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: 'accent' | 'success' | 'warning' | 'danger' | boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const glowStyles = {
  accent: 'ring-1 ring-accent/20',
  success: 'ring-1 ring-success/20',
  warning: 'ring-1 ring-warning/20',
  danger: 'ring-1 ring-danger/20',
  true: 'ring-1 ring-accent/20',
  false: '',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className = '', glow = false, onClick, padding = 'md' }: CardProps) {
  const glowKey = glow === true ? 'true' : glow === false ? 'false' : glow;
  const glowClass = glowStyles[glowKey as keyof typeof glowStyles] || '';

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-surface shadow-card rounded-2xl
        transition-all duration-200
        ${glowClass}
        ${onClick ? 'cursor-pointer hover:bg-surface-hover hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
