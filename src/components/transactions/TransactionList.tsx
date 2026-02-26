import { useCategories } from '../../db/hooks';
import { useCurrency } from '../../hooks/useCurrency';
import { groupTransactionsByDate } from '../../hooks/useTransactions';
import { formatHebrewDate } from '../../lib/dates';
import { TransactionRow } from './TransactionRow';
import type { Transaction } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const categories = useCategories();
  const { format } = useCurrency();
  const groups = groupTransactionsByDate(transactions);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-text-secondary">
        <p className="text-lg mb-1">אין תנועות</p>
        <p className="text-sm">הוסף תנועה ראשונה</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map(([date, txs]) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-xs text-text-muted font-medium">{formatHebrewDate(date)}</p>
            <div className="flex-1 h-px bg-border" />
            <p className="text-xs text-text-muted">
              {txs.reduce((s, t) => t.type === 'expense' ? s - t.amount : s + t.amount, 0) >= 0 ? '+' : ''}
              {txs.reduce((s, t) => t.type === 'expense' ? s - t.amount : s + t.amount, 0).toLocaleString()} ₪
            </p>
          </div>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            {txs.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} categories={categories} formatCurrency={format} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
