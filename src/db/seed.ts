import { db } from './index';
import { DEFAULT_CATEGORIES } from '../lib/constants';
import { generateId } from '../lib/id';

export async function seedDatabase() {
  const categoryCount = await db.categories.count();
  if (categoryCount === 0) {
    const categories = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      id: generateId(),
    }));
    await db.categories.bulkAdd(categories);

    await db.settings.put({
      id: 'main',
      name: '',
      monthlyIncome: 0,
      savingsGoal: 0,
      currency: 'ILS',
      dateFormat: 'dd/MM/yyyy',
    });
  }
}
