import { Menu, X, Wallet } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { getMonthLabel } from '../../lib/dates';

export function MobileHeader() {
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen);
  const toggleMobileMenu = useUiStore((s) => s.toggleMobileMenu);
  const selectedMonth = useUiStore((s) => s.selectedMonth);

  return (
    <header className="fixed top-0 inset-x-0 h-14 z-40 md:hidden flex items-center justify-between px-4 border-b border-border bg-surface/90 backdrop-blur-xl">
      {/* Hamburger */}
      <button
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-accent-violet/15 flex items-center justify-center">
          <Wallet size={16} className="text-accent-violet" />
        </div>
        <span className="text-base font-bold text-text-primary tracking-tight">MyFlow</span>
      </div>

      {/* Month indicator */}
      <span className="text-xs font-medium text-text-muted bg-surface px-2.5 py-1 rounded-lg border border-border">
        {getMonthLabel(selectedMonth)}
      </span>
    </header>
  );
}
