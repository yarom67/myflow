import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { icons } from 'lucide-react';
import { db } from '../../db';
import { useUiStore } from '../../store/uiStore';
import { formatShortDate } from '../../lib/dates';
import type { Transaction, Category } from '../../types';

const LucideIcon = ({ name, ...props }: { name: string } & Record<string, any>) => {
  const Icon = icons[name as keyof typeof icons];
  return Icon ? <Icon {...props} /> : null;
};

interface TransactionRowProps {
  transaction: Transaction;
  categories: Category[];
  formatCurrency: (n: number) => string;
}

export function TransactionRow({ transaction: tx, categories, formatCurrency }: TransactionRowProps) {
  const [hovered, setHovered] = useState(false);
  const openModal = useUiStore((s) => s.openModal);
  const cat = categories.find((c) => c.id === tx.categoryId);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('למחוק תנועה זו?')) {
      await db.transactions.delete(tx.id);
    }
  };

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => openModal('addTransaction', tx.id)}
    >
      {cat && (
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: cat.color + '18' }}
        >
          <LucideIcon name={cat.icon} size={17} style={{ color: cat.color }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {tx.description || cat?.name || '—'}
        </p>
        <p className="text-xs text-text-muted mt-0.5">{cat?.name} · {formatShortDate(tx.date)}</p>
      </div>
      <div className="flex items-center gap-1.5">
        {/* Action buttons on hover (desktop only) */}
        <div className={`hidden sm:flex items-center gap-1 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); openModal('addTransaction', tx.id); }}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
        <span
          className={`text-sm font-bold ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
        </span>
      </div>
    </div>
  );
}
