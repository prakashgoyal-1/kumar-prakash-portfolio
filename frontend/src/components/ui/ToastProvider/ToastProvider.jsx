import { createContext, useContext, useCallback, useRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useUIStore } from "../../../store/uiStore";
import "./ToastProvider.css";

// Module-level ref so showToast can be called outside React (e.g. axios interceptors)
let _showToast = null;

/**
 * Call this from non-component code (axios interceptors, service files, etc.)
 * Will no-op if ToastProvider hasn't mounted yet.
 */
export function showToast(message, severity = "info") {
  if (_showToast) _showToast(message, severity);
}

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const { toast, showToast: storeShowToast, closeToast } = useUIStore();

  // Wire the module-level ref to the Zustand action on mount
  const showToastRef = useCallback(
    (message, severity = "info") => {
      storeShowToast(message, severity);
    },
    [storeShowToast],
  );

  // Keep module-level ref current
  _showToast = showToastRef;

  return (
    <ToastContext.Provider value={showToastRef}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

/** Use inside React components */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
