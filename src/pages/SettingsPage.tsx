import { useState } from 'react';
import { Plus, Trash2, Download, FileJson } from 'lucide-react';
import { useSettings, useFixedExpenses } from '../db/hooks';
import { db } from '../db';
import { generateId } from '../lib/id';
import { exportAsCSV, exportAsJSON } from '../lib/export';
import { CURRENCY_OPTIONS } from '../lib/constants';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { CategoryGrid } from '../components/categories/CategoryGrid';
import { CategoryFormModal } from '../components/categories/CategoryFormModal';
import { useUiStore } from '../store/uiStore';

export function SettingsPage() {
  const settings = useSettings();
  const fixedExpenses = useFixedExpenses();
  const openModal = useUiStore((s) => s.openModal);

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

  return (
    <div className="space-y-6 pb-8 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">הגדרות</h1>
        <p className="text-text-muted text-sm mt-0.5">הגדר הכנסה, קטגוריות, הוצאות קבועות ועוד</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">כללי</TabsTrigger>
          <TabsTrigger value="categories" className="flex-1">קטגוריות</TabsTrigger>
          <TabsTrigger value="export" className="flex-1">ייצוא</TabsTrigger>
        </TabsList>

        {/* General tab */}
        <TabsContent value="general" className="space-y-4 mt-4">
          {/* Income */}
          <Card>
            <CardHeader>
              <CardTitle>הכנסה חודשית</CardTitle>
              <CardDescription>משכורת חודשית ברוטו / נטו</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={settings?.monthlyIncome?.toString() ?? '0'}
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveIncome()}
                  className="flex-1"
                />
                <Button
                  onClick={saveIncome}
                  variant={incomeSaved ? 'outline' : 'default'}
                  className={incomeSaved ? 'text-success border-success/30 bg-success/10' : ''}
                >
                  {incomeSaved ? '✓ נשמר' : 'שמור'}
                </Button>
              </div>
              {settings?.monthlyIncome ? (
                <p className="text-xs text-text-muted">הכנסה נוכחית: {settings.monthlyIncome.toLocaleString()} ₪</p>
              ) : null}
            </CardContent>
          </Card>

          {/* Fixed Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>הוצאות קבועות</CardTitle>
              <CardDescription>שכירות, מנויים, הלוואות — מנוכים אוטומטית מהתקציב הפנוי</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
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
                <Input
                  type="text"
                  placeholder="שם ההוצאה (לדוגמה: שכירות)"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="סכום"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addFixedExpense()}
                  className="sm:w-32"
                />
                <Button variant="outline" onClick={addFixedExpense} className="shrink-0">
                  <Plus size={14} /> הוסף
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Currency */}
          <Card>
            <CardHeader>
              <CardTitle>מטבע</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {CURRENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => saveCurrency(opt.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      settings?.currency === opt.value
                        ? 'bg-accent-violet border-accent-violet text-white shadow-[0_0_12px_rgba(124,58,237,0.2)]'
                        : 'bg-background border-border text-text-secondary hover:text-text-primary hover:border-border-strong'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories tab */}
        <TabsContent value="categories" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary">קטגוריות</h2>
                <p className="text-xs text-text-muted mt-0.5">נהל את הקטגוריות שלך</p>
              </div>
              <Button onClick={() => openModal('categoryForm')}>
                <Plus size={14} /> קטגוריה חדשה
              </Button>
            </div>
            <CategoryGrid />
          </div>
          <CategoryFormModal />
        </TabsContent>

        {/* Export tab */}
        <TabsContent value="export" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ייצוא נתונים</CardTitle>
              <CardDescription>הורד את כל הנתונים שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={exportAsCSV}>
                  <Download size={15} /> ייצא CSV
                </Button>
                <Button variant="outline" onClick={exportAsJSON}>
                  <FileJson size={15} /> ייצא JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
