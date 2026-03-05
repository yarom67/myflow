import { Link } from 'react-router';
import { ArrowLeft, Plus } from 'lucide-react';
import { icons } from 'lucide-react';
import { useMonthTransactions, useCategories } from '../../db/hooks';
import { useCurrency } from '../../hooks/useCurrency';
import { formatShortDate } from '../../lib/dates';
import { useUiStore } from '../../store/uiStore';
import { BlurFade } from '../magicui/blur-fade';
import { ScrollArea } from '../ui/scroll-area';

const LucideIcon = ({ name, ...props }: { name: string } & Record<string, any>) => {
  const Icon = icons[name as keyof typeof icons];
  return Icon ? <Icon {...props} /> : null;
};

export function RecentTransactions({ month }: { month: string }) {
  const transactions = useMonthTransactions(month);
  const categories = useCategories();
  const { format } = useCurrency();
  const openModal = useUiStore((s) => s.openModal);

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const getCat = (id: string) => categories.find((c) => c.id === id);

  return (
    <div className="bg-surface shadow-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-text-primary tracking-tight">תנועות אחרונות</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('addTransaction')}
            className="flex items-center gap-1.5 text-xs font-semibold text-accent-violet hover:text-accent-violet/80 transition-colors bg-accent-violet/10 hover:bg-accent-violet/15 px-2.5 py-1.5 rounded-lg"
          >
            <Plus size={12} />
            הוסף
          </button>
          <Link
            to="/transactions"
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            הכל
            <ArrowLeft size={13} className="rotate-180" />
          </Link>
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <p className="text-text-muted text-sm">אין תנועות לחודש זה</p>
          <button
            onClick={() => openModal('addTransaction')}
            className="text-xs text-accent-violet hover:text-accent-violet/80 transition-colors mt-1"
          >
            הוסף תנועה ראשונה
          </button>
        </div>
      ) : (
        <ScrollArea className="max-h-[300px]">
          <div className="space-y-0.5">
            {recent.map((tx, i) => {
              const cat = getCat(tx.categoryId);
              return (
                <BlurFade key={tx.id} delay={i * 0.05} direction="up">
                  <div
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer group"
                    onClick={() => openModal('addTransaction', tx.id)}
                  >
                    {cat && (
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: cat.color + '18' }}
                      >
                        <LucideIcon name={cat.icon} size={16} style={{ color: cat.color }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {tx.description || cat?.name || '—'}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">{formatShortDate(tx.date)}</p>
                    </div>
                    <span
                      className={`text-sm font-bold ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {tx.type === 'income' ? '+' : '-'}{format(tx.amount)}
                    </span>
                  </div>
                </BlurFade>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
