import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Upload, Check } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useCategories } from '../../db/hooks';
import { db } from '../../db';
import { parseCSVFile, mapRows, type ParsedCSV, type ColumnMapping } from '../../lib/csv';
import { generateId } from '../../lib/id';

type Step = 'upload' | 'map' | 'preview' | 'done';

export function CsvImportModal() {
  const { activeModal, closeModal } = useUiStore();
  const categories = useCategories();
  const isOpen = activeModal === 'csvImport';
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('upload');
  const [parsed, setParsed] = useState<ParsedCSV | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({ date: 0, amount: 1, description: 2 });
  const [defaultCatId, setDefaultCatId] = useState('');
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [error, setError] = useState('');

  const defaultCat = categories[0];

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const result = await parseCSVFile(file);
      setParsed(result);
      setDefaultCatId(defaultCat?.id ?? '');
      // Auto-detect columns
      const headers = result.headers.map((h) => h.toLowerCase());
      const dateIdx = headers.findIndex((h) => h.includes('תאריך') || h.includes('date'));
      const amtIdx = headers.findIndex((h) => h.includes('סכום') || h.includes('amount') || h.includes('credit') || h.includes('debit'));
      const descIdx = headers.findIndex((h) => h.includes('תיאור') || h.includes('description') || h.includes('memo'));
      setMapping({
        date: dateIdx >= 0 ? dateIdx : 0,
        amount: amtIdx >= 0 ? amtIdx : 1,
        description: descIdx >= 0 ? descIdx : 2,
      });
      setStep('map');
    } catch {
      setError('שגיאה בקריאת הקובץ');
    }
  };

  const previewRows = parsed ? mapRows(parsed.rows.slice(0, 5), mapping, defaultCatId) : [];

  const handleImport = async () => {
    if (!parsed) return;
    setImporting(true);
    const rows = mapRows(parsed.rows, mapping, defaultCatId || defaultCat?.id || '');
    const txs = rows.map((r) => ({ ...r, id: generateId() }));
    await db.transactions.bulkAdd(txs);
    setImportedCount(txs.length);
    setImporting(false);
    setStep('done');
  };

  const handleClose = () => {
    closeModal();
    setTimeout(() => { setStep('upload'); setParsed(null); setError(''); }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} />
          <motion.div
            className="relative w-full max-w-xl bg-surface border border-border rounded-2xl p-6 z-10 mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-text-primary">ייבוא CSV</h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"><X size={18} /></button>
            </div>

            {/* Step: Upload */}
            {step === 'upload' && (
              <div className="space-y-4">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-accent rounded-xl p-10 text-center cursor-pointer transition-colors"
                >
                  <Upload size={32} className="text-text-muted mx-auto mb-3" />
                  <p className="text-text-primary font-medium mb-1">לחץ להעלאת קובץ CSV</p>
                  <p className="text-text-muted text-sm">מבנק, אמריקן אקספרס, ויזה ועוד</p>
                </div>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
                {error && <p className="text-danger text-sm text-center">{error}</p>}
              </div>
            )}

            {/* Step: Map columns */}
            {step === 'map' && parsed && (
              <div className="space-y-4">
                <p className="text-sm text-text-secondary">בחר איזה עמודה מכילה כל שדה:</p>
                {(['date', 'amount', 'description'] as const).map((field) => (
                  <div key={field} className="flex items-center gap-3">
                    <label className="text-sm text-text-primary w-24">
                      {field === 'date' ? 'תאריך' : field === 'amount' ? 'סכום' : 'תיאור'}
                    </label>
                    <select
                      value={mapping[field]}
                      onChange={(e) => setMapping((m) => ({ ...m, [field]: parseInt(e.target.value) }))}
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
                    >
                      {parsed.headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
                    </select>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <label className="text-sm text-text-primary w-24">קטגוריה</label>
                  <select
                    value={defaultCatId}
                    onChange={(e) => setDefaultCatId(e.target.value)}
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
                  >
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setStep('upload')} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">חזור</button>
                  <button onClick={() => setStep('preview')} className="px-4 py-2 bg-accent text-white rounded-lg text-sm">תצוגה מקדימה</button>
                </div>
              </div>
            )}

            {/* Step: Preview */}
            {step === 'preview' && (
              <div className="space-y-4">
                <p className="text-sm text-text-secondary">{previewRows.length} שורות לדוגמה (מתוך {parsed?.rows.length ?? 0} סה״כ):</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-border text-text-muted">
                      <th className="text-start py-2 ps-2">תאריך</th><th className="text-start py-2">תיאור</th><th className="text-start py-2">סכום</th><th className="text-start py-2">סוג</th>
                    </tr></thead>
                    <tbody>
                      {previewRows.map((r, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2 ps-2 text-text-primary">{r.date}</td>
                          <td className="py-2 text-text-secondary truncate max-w-32">{r.description}</td>
                          <td className="py-2 text-text-primary">{r.amount}</td>
                          <td className={`py-2 ${r.type === 'income' ? 'text-success' : 'text-danger'}`}>{r.type === 'income' ? 'הכנסה' : 'הוצאה'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setStep('map')} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">חזור</button>
                  <button onClick={handleImport} disabled={importing} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm disabled:opacity-50">
                    {importing ? 'מייבא...' : `ייבא ${parsed?.rows.length ?? 0} תנועות`}
                  </button>
                </div>
              </div>
            )}

            {/* Step: Done */}
            {step === 'done' && (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-success" />
                </div>
                <p className="text-text-primary font-semibold text-lg">הייבוא הצליח!</p>
                <p className="text-text-secondary text-sm mt-1">{importedCount} תנועות יובאו</p>
                <button onClick={handleClose} className="mt-6 px-6 py-2 bg-accent text-white rounded-lg text-sm">סגור</button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
