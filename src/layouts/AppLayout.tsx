import { Outlet } from 'react-router';
import { Sidebar } from '../components/sidebar/Sidebar';
import { MobileHeader } from '../components/sidebar/MobileHeader';
import { MobileNav } from '../components/sidebar/MobileNav';
import { useUiStore } from '../store/uiStore';
import { useIsMobile } from '../hooks/useIsMobile';

function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Violet ambient orb — top-end corner */}
      <div
        className="absolute -top-48 -end-48 w-[600px] h-[600px] rounded-full opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Cyan ambient orb — bottom-start corner */}
      <div
        className="absolute -bottom-48 -start-48 w-[500px] h-[500px] rounded-full opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
}

export function AppLayout() {
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen);
  const closeMobileMenu = useUiStore((s) => s.closeMobileMenu);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      <BackgroundOrbs />

      {/* Mobile backdrop overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Mobile top header */}
      <MobileHeader />

      {/* Main content */}
      <main
        className="relative z-10 flex-1 min-h-screen overflow-y-auto transition-all duration-300"
        style={{
          marginInlineEnd: isMobile ? 0 : (sidebarCollapsed ? 72 : 240),
        }}
      >
        {/* Desktop padding / Mobile padding with safe zones for header + bottom nav */}
        <div className="p-5 pt-18 pb-24 md:p-8 md:pt-8 md:pb-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}
