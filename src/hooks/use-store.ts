import { create } from "zustand";

interface UIState {
  isMenuOpen: boolean;
  activeSection: string;
  setIsMenuOpen: (open: boolean) => void;
  setActiveSection: (section: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  activeSection: "home",
  setIsMenuOpen: (open) => set({ isMenuOpen: open }),
  setActiveSection: (section) => set({ activeSection: section }),
}));
