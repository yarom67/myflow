import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { db } from '../../db';
import { useCategories } from '../../db/hooks';
import { useUiStore } from '../../store/uiStore';
import { generateId } from '../../lib/id';
import { getToday } from '../../lib/dates';
import { CategoryIconGrid } from './CategoryIconGrid';
import type { TransactionType } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '../ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../ui/dialog';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

interface FormProps {
  editingId: string | null;
  categories: ReturnType<typeof useCategories>;
  onClose: () => void;
  isOpen: boolean;
}

function TransactionForm({ editingId, categories, onClose, isOpen }: FormProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getToday());

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      const first = categories.find((c) => c.name !== 'הכנסה');
      if (first) setCategoryId(first.id);
    }
  }, [categories, categoryId]);

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

  const handleClose = () => { onClose(); reset(); };

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
    <form onSubmit={handleSubmit} className="space-y-5 px-1">
      {/* Amount */}
      <div className="text-center pt-2">
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
        <Label className="text-xs text-text-muted mb-2 block">קטגוריה</Label>
        <CategoryIconGrid categories={filteredCats} selectedId={categoryId} onSelect={setCategoryId} />
      </div>

      {/* Description */}
      <Input
        type="text"
        placeholder="תיאור (אופציונלי)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Date */}
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Submit */}
      <Button type="submit" className="w-full" size="lg">
        {editingId ? 'שמור שינויים' : 'הוסף תנועה'}
      </Button>
    </form>
  );
}

export function AddTransactionModal() {
  const { activeModal, editingId, closeModal } = useUiStore();
  const categories = useCategories();
  const isOpen = activeModal === 'addTransaction';
  const isMobile = useIsMobile();

  const title = editingId ? 'ערוך תנועה' : 'הוסף תנועה';

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(o) => !o && closeModal()}>
        <DrawerContent>
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerClose asChild>
              <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
                <X size={18} />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            <TransactionForm
              editingId={editingId}
              categories={categories}
              onClose={closeModal}
              isOpen={isOpen}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild>
            <button className="absolute start-4 top-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
              <X size={18} />
            </button>
          </DialogClose>
        </DialogHeader>
        <TransactionForm
          editingId={editingId}
          categories={categories}
          onClose={closeModal}
          isOpen={isOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
