import { db } from '../db';

export async function exportAsJSON() {
  const [transactions, categories, settings, fixedExpenses] = await Promise.all([
    db.transactions.toArray(),
    db.categories.toArray(),
    db.settings.toArray(),
    db.fixedExpenses.toArray(),
  ]);
  const data = { transactions, categories, settings, fixedExpenses, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  download(blob, `myflow-export-${new Date().toISOString().slice(0, 10)}.json`);
}

export async function exportAsCSV() {
  const [transactions, categories] = await Promise.all([
    db.transactions.toArray(),
    db.categories.toArray(),
  ]);
  const catMap = new Map(categories.map((c) => [c.id, c.name]));
  const rows = [
    ['תאריך', 'סוג', 'קטגוריה', 'תיאור', 'סכום'],
    ...transactions.map((t) => [
      t.date,
      t.type === 'income' ? 'הכנסה' : 'הוצאה',
      catMap.get(t.categoryId) ?? '',
      t.description,
      t.amount.toString(),
    ]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  download(blob, `myflow-export-${new Date().toISOString().slice(0, 10)}.csv`);
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
