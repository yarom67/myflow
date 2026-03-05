import { Outlet } from 'react-router';
import { Sidebar } from '../components/sidebar/Sidebar';
import { MobileHeader } from '../components/sidebar/MobileHeader';
import { MobileNav } from '../components/sidebar/MobileNav';
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import { useUiStore } from '../store/uiStore';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSettings } from '../db/hooks';
import { Particles } from '../components/magicui/particles';
import { Toaster } from '../components/ui/sonner';

export function AppLayout() {
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen);
  const closeMobileMenu = useUiStore((s) => s.closeMobileMenu);
  const isMobile = useIsMobile();
  const settings = useSettings();

  // Still loading from IndexedDB
  if (settings === undefined) return null;

  // First-time user (or after migration wipes mock data)
  if (settings.name === '') return <OnboardingWizard />;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Particles background */}
      <Particles
        className="fixed inset-0 z-0 pointer-events-none"
        quantity={25}
        color="#6D28D9"
        size={0.5}
        staticity={60}
      />

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

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
