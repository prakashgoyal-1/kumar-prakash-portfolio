import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ────────────────────────────────────────────────
      user: null,
      accessToken: null,
      refreshToken: null,

      // ── Computed (derived from state) ────────────────────────
      get isAuthenticated() {
        return !!get().accessToken;
      },
      get isAdmin() {
        return get().user?.role === "admin";
      },

      // ── Actions ──────────────────────────────────────────────
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Persist tokens only — user is re-fetched on load via useAuth
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
