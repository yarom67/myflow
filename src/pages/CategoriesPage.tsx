import { Plus } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { CategoryGrid } from '../components/categories/CategoryGrid';
import { CategoryFormModal } from '../components/categories/CategoryFormModal';

export function CategoriesPage() {
  const { openModal } = useUiStore();

  return (
    <div className="space-y-7 pb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">קטגוריות</h1>
          <p className="text-text-muted text-sm mt-0.5">נהל קטגוריות ותקציבים חודשיים</p>
        </div>
        <button
          onClick={() => openModal('categoryForm')}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-xl text-sm font-semibold transition-colors shadow-[0_0_16px_rgba(124,58,237,0.25)] shrink-0"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">הוסף קטגוריה</span>
          <span className="sm:hidden">הוסף</span>
        </button>
      </div>

      <CategoryGrid />
      <CategoryFormModal />
    </div>
  );
}
