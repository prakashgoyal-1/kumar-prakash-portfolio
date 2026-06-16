import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

/**
 * Wraps routes that require authentication.
 * Redirects unauthenticated users to /login.
 */
export default function AuthGuard({ children }) {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
