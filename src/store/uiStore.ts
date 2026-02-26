import { create } from 'zustand';
import { getCurrentMonth } from '../lib/dates';

interface UiState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  activeModal: string | null;
  editingId: string | null;
  openModal: (name: string, editingId?: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  mobileMenuOpen: false,
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  selectedMonth: getCurrentMonth(),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  activeModal: null,
  editingId: null,
  openModal: (name, editingId) => set({ activeModal: name, editingId: editingId ?? null }),
  closeModal: () => set({ activeModal: null, editingId: null }),
}));
