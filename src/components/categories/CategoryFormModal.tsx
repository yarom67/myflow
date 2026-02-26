import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { icons } from 'lucide-react';
import { db } from '../../db';
import { useUiStore } from '../../store/uiStore';
import { generateId } from '../../lib/id';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../lib/constants';

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} />
          <motion.div
            className="relative w-full max-w-lg bg-surface border border-border rounded-2xl p-6 z-10 mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-text-primary">{editingId ? 'ערוך קטגוריה' : 'הוסף קטגוריה'}</h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-xs text-text-muted block mb-1.5">שם הקטגוריה</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="לדוגמה: מזון" required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors" />
              </div>

              {/* Icon picker */}
              <div>
                <label className="text-xs text-text-muted block mb-1.5">אייקון</label>
                <div className="grid grid-cols-8 gap-1.5">
                  {CATEGORY_ICONS.map((ic) => (
                    <button key={ic} type="button" onClick={() => setIcon(ic)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${icon === ic ? 'border-accent bg-accent/10' : 'border-border bg-surface hover:bg-surface-hover'}`}>
                      <LucideIcon name={ic} size={16} style={{ color: icon === ic ? '#7C3AED' : '#94A3B8' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="text-xs text-text-muted block mb-1.5">צבע</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface scale-110' : ''}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="text-xs text-text-muted block mb-1.5">תקציב חודשי (אופציונלי)</label>
                <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors" />
              </div>

              {/* Preview */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                  <LucideIcon name={icon} size={18} style={{ color }} />
                </div>
                <span className="text-sm text-text-primary">{name || 'שם הקטגוריה'}</span>
              </div>

              <button type="submit" className="w-full py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-colors">
                {editingId ? 'שמור' : 'הוסף קטגוריה'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
