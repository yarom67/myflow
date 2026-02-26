import { motion, AnimatePresence } from 'motion/react';
import { Wallet, ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { NavLink } from 'react-router';
import { useUiStore } from '../../store/uiStore';
import { NAV_ITEMS } from '../../lib/constants';
import { getMonthLabel } from '../../lib/dates';
import { SidebarLink } from './SidebarLink';
import { useIsMobile } from '../../hooks/useIsMobile';

export function Sidebar() {
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const selectedMonth = useUiStore((s) => s.selectedMonth);
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen);
  const closeMobileMenu = useUiStore((s) => s.closeMobileMenu);
  const isMobile = useIsMobile();

  // In RTL, ChevronRight visually points toward the sidebar (to collapse),
  // and ChevronLeft points away (to expand)
  const CollapseIcon = sidebarCollapsed ? ChevronLeft : ChevronRight;

  const sidebarContent = (
    <>
      {/* Logo / App name */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <NavLink
          to="/"
          onClick={isMobile ? closeMobileMenu : undefined}
          className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(124,58,237,0.2)]">
            <Wallet size={18} className="text-accent" />
          </div>
          {(!sidebarCollapsed || isMobile) && (
            <span className="text-base font-bold text-text-primary whitespace-nowrap tracking-tight">
              MyFlow
            </span>
          )}
        </NavLink>
        {/* Close button on mobile */}
        {isMobile && (
          <button
            onClick={closeMobileMenu}
            aria-label="סגור תפריט"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2.5 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.path}
            path={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>

      {/* Month indicator */}
      {!sidebarCollapsed || isMobile ? (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface/50 text-text-secondary text-sm border border-border">
            <Calendar size={16} className="shrink-0 text-text-muted" />
            <span className="whitespace-nowrap text-sm font-medium">{getMonthLabel(selectedMonth)}</span>
          </div>
        </div>
      ) : (
        <div className="px-3 pb-2 flex justify-center">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface/50 border border-border">
            <Calendar size={16} className="text-text-muted" />
          </div>
        </div>
      )}

      {/* Collapse toggle — desktop only */}
      {!isMobile && (
        <div className="px-3 pb-4">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl
              text-text-muted hover:bg-surface-hover hover:text-text-secondary
              transition-colors duration-200 cursor-pointer text-sm"
            aria-label={sidebarCollapsed ? 'הרחב תפריט' : 'כווץ תפריט'}
          >
            <CollapseIcon size={16} />
            {!sidebarCollapsed && <span className="whitespace-nowrap">{sidebarCollapsed ? 'הרחב' : 'כווץ'}</span>}
          </button>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed top-0 end-0 h-screen w-72 bg-surface border-e border-border flex flex-col z-50"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 end-0 h-screen bg-surface border-e border-border flex flex-col z-40"
    >
      {sidebarContent}
    </motion.aside>
  );
}
