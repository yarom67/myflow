import { icons } from 'lucide-react';
import type { Category } from '../../types';

const LucideIcon = ({ name, ...props }: { name: string } & Record<string, any>) => {
  const Icon = icons[name as keyof typeof icons];
  return Icon ? <Icon {...props} /> : null;
};

interface CategoryIconGridProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CategoryIconGrid({ categories, selectedId, onSelect }: CategoryIconGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.map((cat) => {
        const selected = cat.id === selectedId;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all ${
              selected
                ? 'border-accent bg-accent/10 scale-105'
                : 'border-border bg-surface hover:bg-surface-hover hover:border-border-strong'
            }`}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
              <LucideIcon name={cat.icon} size={16} style={{ color: cat.color }} />
            </div>
            <span className="text-xs text-text-secondary leading-tight text-center">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
