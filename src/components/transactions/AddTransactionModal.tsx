import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { db } from '../../db';
import { useCategories } from '../../db/hooks';
import { useUiStore } from '../../store/uiStore';
import { generateId } from '../../lib/id';
import { getToday } from '../../lib/dates';
import { CategoryIconGrid } from './CategoryIconGrid';
import type { TransactionType } from '../../types';

export function AddTransactionModal() {
  const { activeModal, editingId, closeModal } = useUiStore();
  const categories = useCategories();
  const isOpen = activeModal === 'addTransaction';

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getToday());

  // Preselect first expense category
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      const first = categories.find((c) => c.name !== 'הכנסה');
      if (first) setCategoryId(first.id);
    }
  }, [categories, categoryId]);

  // Load existing transaction when editing
  useEffect(() => {
    if (!editingId || !isOpen) return;
    db.transactions.get(editingId).then((tx) => {
      if (!tx) return;
      setAmount(tx.amount.toString());
      setType(tx.type);
      setCategoryId(tx.categoryId);
      setDescription(tx.description);
      setDate(tx.date);
    });
  }, [editingId, isOpen]);

  const reset = () => {
    setAmount('');
    setType('expense');
    const first = categories.find((c) => c.name !== 'הכנסה');
    setCategoryId(first?.id ?? '');
    setDescription('');
    setDate(getToday());
  };

  const handleClose = () => { closeModal(); reset(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || !categoryId) return;
    const tx = { amount: Math.abs(num), type, categoryId, description, date };
    if (editingId) {
      await db.transactions.put({ ...tx, id: editingId });
    } else {
      await db.transactions.add({ ...tx, id: generateId() });
    }
    handleClose();
  };

  // Adjust category when switching type
  const handleTypeSwitch = (t: TransactionType) => {
    setType(t);
    if (t === 'income') {
      const incomeCat = categories.find((c) => c.name === 'הכנסה');
      if (incomeCat) setCategoryId(incomeCat.id);
    } else {
      const first = categories.find((c) => c.name !== 'הכנסה');
      if (first) setCategoryId(first.id);
    }
  };

  const filteredCats = type === 'income'
    ? categories.filter((c) => c.name === 'הכנסה')
    : categories.filter((c) => c.name !== 'הכנסה');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="relative w-full sm:max-w-md bg-surface border border-border rounded-t-2xl sm:rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-text-primary">
                {editingId ? 'ערוך תנועה' : 'הוסף תנועה'}
              </h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Amount */}
              <div className="text-center">
                <div className="relative inline-flex items-center">
                  <span className="text-3xl text-text-muted ms-2">₪</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    autoFocus
                    className="text-5xl font-bold text-center w-48 bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                </div>
              </div>

              {/* Type toggle */}
              <div className="flex bg-background border border-border rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleTypeSwitch('expense')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors rounded-xl ${
                    type === 'expense' ? 'bg-danger text-white' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  הוצאה
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeSwitch('income')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors rounded-xl ${
                    type === 'income' ? 'bg-success text-white' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  הכנסה
                </button>
              </div>

              {/* Category grid */}
              <div>
                <p className="text-xs text-text-muted mb-2">קטגוריה</p>
                <CategoryIconGrid categories={filteredCats} selectedId={categoryId} onSelect={setCategoryId} />
              </div>

              {/* Description */}
              <input
                type="text"
                placeholder="תיאור (אופציונלי)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              />

              {/* Date */}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
              />

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-colors"
              >
                {editingId ? 'שמור שינויים' : 'הוסף תנועה'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
