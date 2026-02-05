import { create } from 'zustand';

type AppState = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentUser: { name: string; role: string; avatar: string | null } | null;
  setCurrentUser: (user: AppState['currentUser']) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  currentUser: { name: 'Dr. Maria Santos', role: 'admin', avatar: null },
  setCurrentUser: (user) => set({ currentUser: user }),

  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
}));
