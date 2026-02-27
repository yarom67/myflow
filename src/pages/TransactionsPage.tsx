import { useState } from 'react';
import { Plus, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { useFilteredTransactions } from '../hooks/useTransactions';
import { getMonthLabel, getPreviousMonth, getNextMonth } from '../lib/dates';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { AddTransactionModal } from '../components/transactions/AddTransactionModal';
import { CsvImportModal } from '../components/transactions/CsvImportModal';
import type { TransactionFilters as TFilters } from '../types';

export function TransactionsPage() {
  const { selectedMonth, setSelectedMonth, openModal } = useUiStore();
  const [filters, setFilters] = useState<TFilters>({});
  const transactions = useFilteredTransactions(selectedMonth, filters);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 justify-between">
        {/* Month selector */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl px-1 py-1">
          <button
            onClick={() => setSelectedMonth(getPreviousMonth(selectedMonth))}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <h1 className="text-sm font-bold text-text-primary px-2 min-w-20 text-center">
            {getMonthLabel(selectedMonth)}
          </h1>
          <button
            onClick={() => setSelectedMonth(getNextMonth(selectedMonth))}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal('csvImport')}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-surface border border-border rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            aria-label="ייבוא CSV"
          >
            <Upload size={15} />
            <span className="hidden sm:inline text-sm">ייבוא</span>
          </button>
          <button
            onClick={() => openModal('addTransaction')}
            className="flex items-center gap-1.5 px-3 py-2 bg-accent hover:bg-accent-light text-white rounded-xl text-sm font-semibold transition-colors shadow-[0_0_16px_rgba(124,58,237,0.2)]"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">הוסף תנועה</span>
            <span className="sm:hidden">הוסף</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters filters={filters} onFilterChange={setFilters} />

      {/* List */}
      <TransactionList transactions={transactions} />

      <AddTransactionModal />
      <CsvImportModal />
    </div>
  );
}
