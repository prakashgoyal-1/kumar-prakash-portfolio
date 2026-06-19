import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ────────────────────────────────────────────────
      user: null,
      accessToken: null,
      refreshToken: null,
      // Tracks whether Zustand has finished rehydrating from localStorage.
      // False on first render, true once rehydration completes.
      // Components must wait for this before making auth decisions.
      _hasHydrated: false,

      // ── Computed (derived from state) ────────────────────────
      // get isAuthenticated() {
      //   return !!get().accessToken;
      // },
      // get isAdmin() {
      //   return get().user?.role === "admin";
      // },

      // ── Actions ──────────────────────────────────────────────
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Persist tokens only — user is re-fetched on load via useAuth
      // Only persist tokens — user is re-fetched on load
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      // Called when rehydration from localStorage is complete
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    },
  ),
);
