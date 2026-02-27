import { useState } from 'react';
import { Plus, Trash2, Download, FileJson } from 'lucide-react';
import { useSettings, useFixedExpenses } from '../db/hooks';
import { db } from '../db';
import { generateId } from '../lib/id';
import { exportAsCSV, exportAsJSON } from '../lib/export';
import { CURRENCY_OPTIONS } from '../lib/constants';

export function SettingsPage() {
  const settings = useSettings();
  const fixedExpenses = useFixedExpenses();

  const [income, setIncome] = useState('');
  const [incomeSaved, setIncomeSaved] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const saveIncome = async () => {
    const val = parseFloat(income);
    if (!val) return;
    await db.settings.put({
      id: 'main',
      name: settings?.name ?? '',
      monthlyIncome: val,
      savingsGoal: settings?.savingsGoal ?? 0,
      currency: settings?.currency ?? 'ILS',
      dateFormat: settings?.dateFormat ?? 'dd/MM/yyyy',
    });
    setIncomeSaved(true);
    setTimeout(() => setIncomeSaved(false), 2000);
  };

  const saveCurrency = async (currency: string) => {
    await db.settings.put({
      id: 'main',
      name: settings?.name ?? '',
      monthlyIncome: settings?.monthlyIncome ?? 0,
      savingsGoal: settings?.savingsGoal ?? 0,
      currency,
      dateFormat: settings?.dateFormat ?? 'dd/MM/yyyy',
    });
  };

  const addFixedExpense = async () => {
    if (!newExpenseName || !newExpenseAmount) return;
    await db.fixedExpenses.add({ id: generateId(), name: newExpenseName, amount: parseFloat(newExpenseAmount) });
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const deleteFixedExpense = async (id: string) => {
    await db.fixedExpenses.delete(id);
  };

  const inputCls = "bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors w-full";

  return (
    <div className="space-y-7 pb-8 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">הגדרות</h1>
        <p className="text-text-muted text-sm mt-0.5">הגדר הכנסה, הוצאות קבועות ועוד</p>
      </div>

      {/* Income */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-text-primary">הכנסה חודשית</h2>
          <p className="text-xs text-text-muted mt-0.5">משכורת חודשית ברוטו / נטו</p>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={settings?.monthlyIncome?.toString() ?? '0'}
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveIncome()}
            className={`flex-1 ${inputCls}`}
          />
          <button
            onClick={saveIncome}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0 ${
              incomeSaved
                ? 'bg-success/20 text-success border border-success/30'
                : 'bg-accent hover:bg-accent-light text-white shadow-[0_0_16px_rgba(124,58,237,0.2)]'
            }`}
          >
            {incomeSaved ? '✓ נשמר' : 'שמור'}
          </button>
        </div>
        {settings?.monthlyIncome ? (
          <p className="text-xs text-text-muted">הכנסה נוכחית: {settings.monthlyIncome.toLocaleString()} ₪</p>
        ) : null}
      </div>

      {/* Fixed Expenses */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-text-primary">הוצאות קבועות</h2>
          <p className="text-xs text-text-muted mt-0.5">שכירות, מנויים, הלוואות — מנוכים אוטומטית מהתקציב הפנוי</p>
        </div>

        {fixedExpenses.length > 0 && (
          <div className="space-y-2">
            {fixedExpenses.map((fe) => (
              <div key={fe.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                <span className="text-sm text-text-primary">{fe.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-danger">{fe.amount.toLocaleString()} ₪</span>
                  <button
                    onClick={() => deleteFixedExpense(fe.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            <p className="text-xs text-text-muted pt-1">
              סה״כ: {fixedExpenses.reduce((s, f) => s + f.amount, 0).toLocaleString()} ₪ / חודש
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="שם ההוצאה (לדוגמה: שכירות)"
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
            className={inputCls}
          />
          <input
            type="number"
            placeholder="סכום"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addFixedExpense()}
            className={`${inputCls} sm:w-32`}
          />
          <button
            onClick={addFixedExpense}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-surface-hover border border-border rounded-xl text-sm font-medium text-text-primary hover:bg-surface hover:border-border-strong transition-colors shrink-0"
          >
            <Plus size={14} /> הוסף
          </button>
        </div>
      </div>

      {/* Currency */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
        <div>
          <h2 className="text-base font-bold text-text-primary">מטבע</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CURRENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => saveCurrency(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                settings?.currency === opt.value
                  ? 'bg-accent border-accent text-white shadow-[0_0_12px_rgba(124,58,237,0.2)]'
                  : 'bg-background border-border text-text-secondary hover:text-text-primary hover:border-border-strong'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
        <div>
          <h2 className="text-base font-bold text-text-primary">ייצוא נתונים</h2>
          <p className="text-xs text-text-muted mt-0.5">הורד את כל הנתונים שלך</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportAsCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
          >
            <Download size={15} /> ייצא CSV
          </button>
          <button
            onClick={exportAsJSON}
            className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
          >
            <FileJson size={15} /> ייצא JSON
          </button>
        </div>
      </div>
    </div>
  );
}
