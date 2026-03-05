import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { icons } from 'lucide-react';
import { db } from '../../db';
import { useUiStore } from '../../store/uiStore';
import { generateId } from '../../lib/id';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../lib/constants';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../ui/dialog';

const LucideIcon = ({ name, ...props }: { name: string } & Record<string, any>) => {
  const Icon = icons[name as keyof typeof icons];
  return Icon ? <Icon {...props} /> : null;
};

export function CategoryFormModal() {
  const { activeModal, editingId, closeModal } = useUiStore();
  const isOpen = activeModal === 'categoryForm';

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('ShoppingCart');
  const [color, setColor] = useState('#10B981');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    if (!editingId || !isOpen) return;
    db.categories.get(editingId).then((cat) => {
      if (!cat) return;
      setName(cat.name);
      setIcon(cat.icon);
      setColor(cat.color);
      setBudget(cat.monthlyBudget?.toString() ?? '');
    });
  }, [editingId, isOpen]);

  const reset = () => { setName(''); setIcon('ShoppingCart'); setColor('#10B981'); setBudget(''); };
  const handleClose = () => { closeModal(); reset(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const cat = { name: name.trim(), icon, color, monthlyBudget: budget ? parseFloat(budget) : undefined };
    if (editingId) {
      await db.categories.put({ ...cat, id: editingId });
    } else {
      await db.categories.add({ ...cat, id: generateId() });
    }
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingId ? 'ערוך קטגוריה' : 'הוסף קטגוריה'}</DialogTitle>
          <DialogClose asChild>
            <button className="absolute start-4 top-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
              <X size={18} />
            </button>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label>שם הקטגוריה</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: מזון"
              required
            />
          </div>

          {/* Icon picker */}
          <div className="space-y-1.5">
            <Label>אייקון</Label>
            <div className="grid grid-cols-8 gap-1.5">
              {CATEGORY_ICONS.map((ic) => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
                    icon === ic ? 'border-accent-violet bg-accent-violet/10' : 'border-border bg-surface hover:bg-surface-hover'
                  }`}>
                  <LucideIcon name={ic} size={16} style={{ color: icon === ic ? '#7C3AED' : '#94A3B8' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-1.5">
            <Label>צבע</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <Label>תקציב חודשי (אופציונלי)</Label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
              <LucideIcon name={icon} size={18} style={{ color }} />
            </div>
            <span className="text-sm text-text-primary">{name || 'שם הקטגוריה'}</span>
          </div>

          <Button type="submit" className="w-full" size="lg">
            {editingId ? 'שמור' : 'הוסף קטגוריה'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
