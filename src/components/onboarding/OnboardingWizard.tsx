import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';
import { db } from '../../db';
import { generateId } from '../../lib/id';
import { CURRENCY_OPTIONS } from '../../lib/constants';

interface FixedExpenseRow {
  name: string;
  amount: string;
}

const TOTAL_STEPS = 5;

const variants = {
  enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
};

const inputCls =
  'w-full bg-background border border-border rounded-xl px-4 py-3 text-lg text-text-primary focus:outline-none focus:border-accent transition-colors text-center font-data placeholder:text-text-muted';

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpenseRow[]>([{ name: '', amount: '' }]);
  const [savingsGoal, setSavingsGoal] = useState('');
  const [currency, setCurrency] = useState('ILS');

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, TOTAL_STEPS)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };

  const addRow = () => setFixedExpenses((rows) => [...rows, { name: '', amount: '' }]);
  const removeRow = (i: number) => setFixedExpenses((rows) => rows.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: 'name' | 'amount', val: string) =>
    setFixedExpenses((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));

  const handleFinish = async () => {
    const validExpenses = fixedExpenses.filter((fe) => fe.name.trim() && fe.amount);
    await db.settings.put({
      id: 'main',
      name: name.trim() || 'משתמש',
      monthlyIncome: parseFloat(monthlyIncome) || 0,
      savingsGoal: parseFloat(savingsGoal) || 0,
      currency,
      dateFormat: 'dd/MM/yyyy',
    });
    if (validExpenses.length > 0) {
      await db.fixedExpenses.bulkAdd(
        validExpenses.map((fe) => ({
          id: generateId(),
          name: fe.name.trim(),
          amount: parseFloat(fe.amount),
        }))
      );
    }
  };

  const currencySymbol = CURRENCY_OPTIONS.find((c) => c.value === currency)?.symbol ?? '₪';

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i + 1 === step
                  ? 'w-6 h-2 bg-accent'
                  : i + 1 < step
                  ? 'w-2 h-2 bg-accent/50'
                  : 'w-2 h-2 bg-border-strong'
              }`}
            />
          ))}
        </div>

        {/* Step card */}
        <div className="bg-surface shadow-card rounded-2xl p-8 overflow-hidden min-h-56">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Step 1 — Name */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary">שלום! 👋</h2>
                    <p className="text-text-muted mt-1 text-sm">מה שמך?</p>
                  </div>
                  <input
                    autoFocus
                    type="text"
                    placeholder="הכנס את שמך"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && name.trim() && goNext()}
                    className={inputCls}
                  />
                </div>
              )}

              {/* Step 2 — Monthly income */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary">הכנסה חודשית</h2>
                    <p className="text-text-muted mt-1 text-sm">משכורת נטו / הכנסה חודשית</p>
                  </div>
                  <div className="relative">
                    <span className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted font-semibold text-lg">
                      {currencySymbol}
                    </span>
                    <input
                      autoFocus
                      type="number"
                      placeholder="0"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && goNext()}
                      className={`${inputCls} ps-10`}
                    />
                  </div>
                </div>
              )}

              {/* Step 3 — Fixed expenses */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary">הוצאות קבועות</h2>
                    <p className="text-text-muted mt-1 text-sm">שכירות, מנויים, הלוואות — אפשר לדלג</p>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {fixedExpenses.map((row, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="שם"
                          value={row.name}
                          onChange={(e) => updateRow(i, 'name', e.target.value)}
                          className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                        />
                        <input
                          type="number"
                          placeholder={currencySymbol}
                          value={row.amount}
                          onChange={(e) => updateRow(i, 'amount', e.target.value)}
                          className="w-24 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                        />
                        {fixedExpenses.length > 1 && (
                          <button
                            onClick={() => removeRow(i)}
                            className="p-1.5 text-text-muted hover:text-danger transition-colors shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addRow}
                    className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-light transition-colors"
                  >
                    <Plus size={14} /> הוסף שורה
                  </button>
                </div>
              )}

              {/* Step 4 — Savings goal */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary">יעד חיסכון</h2>
                    <p className="text-text-muted mt-1 text-sm">כמה תרצה לחסוך בחודש? ינוכה מהתקציב הפנוי</p>
                  </div>
                  <div className="relative">
                    <span className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted font-semibold text-lg">
                      {currencySymbol}
                    </span>
                    <input
                      autoFocus
                      type="number"
                      placeholder="0"
                      value={savingsGoal}
                      onChange={(e) => setSavingsGoal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && goNext()}
                      className={`${inputCls} ps-10`}
                    />
                  </div>
                </div>
              )}

              {/* Step 5 — Currency */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary">מטבע</h2>
                    <p className="text-text-muted mt-1 text-sm">באיזה מטבע לעבוד?</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {CURRENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setCurrency(opt.value)}
                        className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                          currency === opt.value
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border text-text-secondary hover:border-border-strong'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className={`flex mt-5 gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
          {step > 1 && (
            <button
              onClick={goBack}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary bg-surface shadow-card hover:shadow-card-hover transition-all"
            >
              חזרה
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button
              onClick={goNext}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent-light shadow-[0_2px_8px_rgba(109,40,217,0.3)] transition-all"
            >
              הבא
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent-light shadow-[0_2px_8px_rgba(109,40,217,0.3)] transition-all"
            >
              {name.trim() ? `בוא נתחיל, ${name.trim()} 🎉` : 'סיום'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
