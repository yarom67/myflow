import { db } from './index';
import { DEFAULT_CATEGORIES } from '../lib/constants';
import { generateId } from '../lib/id';
import type { Transaction } from '../types';

export async function seedDatabase() {
  const categoryCount = await db.categories.count();
  if (categoryCount === 0) {
    const categories = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      id: generateId(),
    }));
    await db.categories.bulkAdd(categories);

    // Seed default settings
    await db.settings.put({
      id: 'main',
      monthlyIncome: 15000,
      currency: 'ILS',
      dateFormat: 'dd/MM/yyyy',
    });

    // Seed sample fixed expenses
    await db.fixedExpenses.bulkAdd([
      { id: generateId(), name: 'שכירות', amount: 4500 },
      { id: generateId(), name: 'ארנונה', amount: 350 },
      { id: generateId(), name: 'חשמל', amount: 400 },
      { id: generateId(), name: 'אינטרנט', amount: 120 },
    ]);

    // Seed demo transactions for the current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const incomeCategory = categories.find((c) => c.name === 'הכנסה')!;
    const foodCategory = categories.find((c) => c.name === 'מזון')!;
    const transportCategory = categories.find((c) => c.name === 'תחבורה')!;
    const entertainmentCategory = categories.find((c) => c.name === 'בילויים')!;
    const shoppingCategory = categories.find((c) => c.name === 'קניות')!;
    const billsCategory = categories.find((c) => c.name === 'חשבונות')!;
    const healthCategory = categories.find((c) => c.name === 'בריאות')!;

    const demoTransactions: Transaction[] = [
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-01`, amount: 15000, type: 'income', categoryId: incomeCategory.id, description: 'משכורת' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-02`, amount: 320, type: 'expense', categoryId: foodCategory.id, description: 'שופרסל' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-03`, amount: 85, type: 'expense', categoryId: transportCategory.id, description: 'דלק' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-04`, amount: 150, type: 'expense', categoryId: entertainmentCategory.id, description: 'מסעדה' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-05`, amount: 250, type: 'expense', categoryId: foodCategory.id, description: 'רמי לוי' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-06`, amount: 450, type: 'expense', categoryId: shoppingCategory.id, description: 'זארה' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-07`, amount: 200, type: 'expense', categoryId: billsCategory.id, description: 'חשבון מים' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-08`, amount: 180, type: 'expense', categoryId: foodCategory.id, description: 'מכולת' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-09`, amount: 120, type: 'expense', categoryId: healthCategory.id, description: 'קופת חולים' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-10`, amount: 95, type: 'expense', categoryId: transportCategory.id, description: 'חניה + דלק' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-11`, amount: 280, type: 'expense', categoryId: entertainmentCategory.id, description: 'סרט + פופקורן' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-12`, amount: 190, type: 'expense', categoryId: foodCategory.id, description: 'יוחננוף' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-13`, amount: 350, type: 'expense', categoryId: shoppingCategory.id, description: 'H&M' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-14`, amount: 2000, type: 'income', categoryId: incomeCategory.id, description: 'פרילנס' },
      { id: generateId(), date: `${year}-${String(month + 1).padStart(2, '0')}-15`, amount: 160, type: 'expense', categoryId: foodCategory.id, description: 'שוק הכרמל' },
    ];

    // Also seed some last month transactions for reports
    const lastMonth = month === 0 ? 11 : month - 1;
    const lastMonthYear = month === 0 ? year - 1 : year;
    const lastMonthStr = `${lastMonthYear}-${String(lastMonth + 1).padStart(2, '0')}`;

    const lastMonthTransactions: Transaction[] = [
      { id: generateId(), date: `${lastMonthStr}-01`, amount: 15000, type: 'income', categoryId: incomeCategory.id, description: 'משכורת' },
      { id: generateId(), date: `${lastMonthStr}-03`, amount: 400, type: 'expense', categoryId: foodCategory.id, description: 'שופרסל' },
      { id: generateId(), date: `${lastMonthStr}-05`, amount: 200, type: 'expense', categoryId: transportCategory.id, description: 'דלק' },
      { id: generateId(), date: `${lastMonthStr}-07`, amount: 500, type: 'expense', categoryId: entertainmentCategory.id, description: 'הופעה' },
      { id: generateId(), date: `${lastMonthStr}-10`, amount: 300, type: 'expense', categoryId: foodCategory.id, description: 'רמי לוי' },
      { id: generateId(), date: `${lastMonthStr}-12`, amount: 600, type: 'expense', categoryId: shoppingCategory.id, description: 'קניון' },
      { id: generateId(), date: `${lastMonthStr}-15`, amount: 350, type: 'expense', categoryId: billsCategory.id, description: 'חשמל' },
      { id: generateId(), date: `${lastMonthStr}-18`, amount: 250, type: 'expense', categoryId: foodCategory.id, description: 'מכולת' },
      { id: generateId(), date: `${lastMonthStr}-20`, amount: 180, type: 'expense', categoryId: healthCategory.id, description: 'רופא' },
      { id: generateId(), date: `${lastMonthStr}-22`, amount: 150, type: 'expense', categoryId: transportCategory.id, description: 'רכבת' },
      { id: generateId(), date: `${lastMonthStr}-25`, amount: 220, type: 'expense', categoryId: foodCategory.id, description: 'סופר' },
    ];

    await db.transactions.bulkAdd([...demoTransactions, ...lastMonthTransactions]);
  }
}
