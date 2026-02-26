import { useCategories, useMonthTransactions } from '../../db/hooks';
import { useCurrency } from '../../hooks/useCurrency';
import { useUiStore } from '../../store/uiStore';
import { CategoryCard } from './CategoryCard';

export function CategoryGrid() {
  const categories = useCategories();
  const { selectedMonth } = useUiStore();
  const transactions = useMonthTransactions(selectedMonth);
  const { format } = useCurrency();

  const getSpent = (catId: string) =>
    transactions.filter((t) => t.type === 'expense' && t.categoryId === catId).reduce((s, t) => s + t.amount, 0);

  if (categories.length === 0) {
    return <p className="text-text-secondary text-center py-12">אין קטגוריות</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} spent={getSpent(cat.id)} formatCurrency={format} />
      ))}
    </div>
  );
}
