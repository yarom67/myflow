import { useUiStore } from '../store/uiStore';
import { useBudget } from '../hooks/useBudget';
import { useCurrency } from '../hooks/useCurrency';
import { HeroCard } from '../components/dashboard/HeroCard';
import { KpiRow } from '../components/dashboard/KpiRow';
import { SpendingDonut } from '../components/dashboard/SpendingDonut';
import { SpendingAreaChart } from '../components/dashboard/SpendingAreaChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { AddTransactionModal } from '../components/transactions/AddTransactionModal';

export function DashboardPage() {
  const { selectedMonth } = useUiStore();
  const budget = useBudget(selectedMonth);
  const { format } = useCurrency();

  return (
    <div className="space-y-7 pb-8">
      <HeroCard
        freeToSpend={budget.freeToSpend}
        daysLeft={budget.daysLeft}
        dailyBudget={budget.dailyBudget}
        status={budget.status}
        formatCurrency={format}
      />

      <KpiRow month={selectedMonth} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingDonut month={selectedMonth} />
        <SpendingAreaChart month={selectedMonth} />
      </div>

      <RecentTransactions month={selectedMonth} />

      <AddTransactionModal />
    </div>
  );
}
