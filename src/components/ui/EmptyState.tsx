import type { ReactNode, ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

interface EmptyStateProps {
  icon: ComponentType<LucideProps>;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 p-4 rounded-full bg-surface border border-border">
        <Icon size={32} className="text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-xs mb-5">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
