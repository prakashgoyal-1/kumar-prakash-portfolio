import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUIStore = create(
  persist(
    (set) => ({
      // ── State ──────────────────────────────────────────────
      themeMode: "light",
      toast: {
        open: false,
        message: "",
        severity: "info", // "success" | "error" | "warning" | "info"
      },

      // ── Actions ────────────────────────────────────────────
      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === "light" ? "dark" : "light",
        })),

      showToast: (message, severity = "info") =>
        set({ toast: { open: true, message, severity } }),

      closeToast: () =>
        set((state) => ({
          toast: { ...state.toast, open: false },
        })),
    }),
    {
      name: "ui-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist themeMode — toast state is ephemeral
      partialize: (state) => ({ themeMode: state.themeMode }),
    },
  ),
);
