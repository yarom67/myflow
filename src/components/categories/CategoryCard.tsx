import { useState } from 'react';
import { motion } from 'motion/react';
import { icons, Pencil, Trash2 } from 'lucide-react';
import { db } from '../../db';
import { useUiStore } from '../../store/uiStore';
import type { Category } from '../../types';

const LucideIcon = ({ name, ...props }: { name: string } & Record<string, unknown>) => {
  const Icon = icons[name as keyof typeof icons];
  return Icon ? <Icon {...props} /> : null;
};

interface CategoryCardProps {
  category: Category;
  spent: number;
  formatCurrency: (amount: number) => string;
}

export function CategoryCard({ category, spent, formatCurrency }: CategoryCardProps) {
  const openModal = useUiStore((s) => s.openModal);
  const [isHovered, setIsHovered] = useState(false);

  const budgetPercent = category.monthlyBudget
    ? Math.round((spent / category.monthlyBudget) * 100)
    : null;

  const barColor =
    budgetPercent === null
      ? ''
      : budgetPercent > 100
        ? '#EF4444'
        : budgetPercent >= 80
          ? '#F59E0B'
          : '#10B981';

  const handleDelete = async () => {
    const confirmed = window.confirm(`למחוק את הקטגוריה "${category.name}"?`);
    if (confirmed) {
      await db.categories.delete(category.id);
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="
        relative bg-surface shadow-card rounded-2xl p-5
        hover:shadow-card-hover transition-all duration-200
      "
    >
      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className="absolute top-3 start-3 flex items-center gap-1"
      >
        <button
          onClick={() => openModal('categoryForm', category.id)}
          className="
            p-1.5 rounded-md text-text-muted
            hover:text-text-primary hover:bg-surface
            transition-colors cursor-pointer
          "
          title="ערוך"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={handleDelete}
          className="
            p-1.5 rounded-md text-text-muted
            hover:text-red-400 hover:bg-surface
            transition-colors cursor-pointer
          "
          title="מחק"
        >
          <Trash2 size={15} />
        </button>
      </motion.div>

      {/* Icon & Name */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-md"
          style={{ backgroundColor: `${category.color}18` }}
        >
          <LucideIcon name={category.icon} size={20} style={{ color: category.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate">
            {category.name}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {formatCurrency(spent)}
          </p>
        </div>
      </div>

      {/* Budget progress */}
      {category.monthlyBudget != null && budgetPercent !== null && (
        <div className="mt-2">
          <div className="w-full h-1.5 rounded-full bg-surface-hover overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetPercent, 100)}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: barColor }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1.5 text-start">
            {formatCurrency(spent)} / {formatCurrency(category.monthlyBudget)}
          </p>
        </div>
      )}
    </motion.div>
  );
}
