import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

/**
 * Wraps routes that require admin role.
 * Redirects non-admins to home.
 */
export default function AdminGuard({ children }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // user is null but token exists — still loading profile, render children
  // useAuth will redirect if token turns out invalid
  return children;
}
