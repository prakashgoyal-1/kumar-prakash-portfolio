import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import * as authApi from "../api/auth.api";

export function useAuth() {
  const {
    user,
    accessToken,
    refreshToken,
    _hasHydrated,
    setTokens,
    setUser,
    logout: storeLogout,
  } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!accessToken;
  const isAdmin = user?.role === "admin";

  // ── Re-fetch user profile on mount if token exists but user is null ─────────
  useEffect(() => {
    if (!_hasHydrated) return; // wait for localStorage rehydration
    if (!accessToken) return; // no token — nothing to do
    if (user) return; // user already loaded — skip

    if (isAuthenticated && !user) {
      authApi
        .getMe()
        .then(setUser)
        .catch(() => storeLogout()); // token is invalid — clear everything
    }
  }, [_hasHydrated, accessToken, user, setUser, storeLogout]);

  // ── Login with email + password ──────────────────────────────────────────────
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const tokens = await authApi.login({ email, password });

        setTokens({
          accessToken: tokens?.access_token,
          refreshToken: tokens?.refresh_token,
        });

        const me = await authApi.getMe();
        setUser(me);
        return true;
      } catch (err) {
        setError(err.response?.data?.detail || "Login failed");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setTokens, setUser],
  );

  // ── Register ─────────────────────────────────────────────────────────────────
  const register = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const tokens = await authApi.register(data);
        setTokens(tokens);
        const me = await authApi.getMe();
        setUser(me);
        return true;
      } catch (err) {
        setError(err.response?.data?.detail || "Registration failed");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setTokens, setUser],
  );

  // ── Login with Google ID token ───────────────────────────────────────────────
  const loginWithGoogle = useCallback(
    async (idToken) => {
      setLoading(true);
      setError(null);
      try {
        const tokens = await authApi.loginWithGoogle(idToken);
        setTokens(tokens);
        const me = await authApi.getMe();
        setUser(me);
        return true;
      } catch (err) {
        setError(err.response?.data?.detail || "Google login failed");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setTokens, setUser],
  );

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isAdmin,
    isHydrated: _hasHydrated, // expose so guards can wait
    login,
    register,
    loginWithGoogle,
    logout,
    loading,
    error,
  };
}
