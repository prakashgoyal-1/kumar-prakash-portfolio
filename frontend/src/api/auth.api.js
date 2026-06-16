import client from "./client";

/**
 * Register a new user with email + password.
 * @param {{ email: string, password: string, full_name: string }} data
 */
export const register = (data) =>
  client.post("/api/auth/register", data).then((r) => r.data);

/**
 * Login with email + password.
 * @param {{ email: string, password: string }} data
 */
export const login = (data) =>
  client.post("/api/auth/login", data).then((r) => r.data);

/**
 * Login / register via Google ID token.
 * @param {string} idToken — credential from Google Identity Services callback
 */
export const loginWithGoogle = (idToken) =>
  client.post("/api/auth/google", { id_token: idToken }).then((r) => r.data);

/**
 * Exchange a refresh token for a new access token.
 * @param {string} refreshToken
 */
export const refresh = (refreshToken) =>
  client
    .post("/api/auth/refresh", { refresh_token: refreshToken })
    .then((r) => r.data);

/**
 * Fetch the currently authenticated user's profile.
 */
export const getMe = () => client.get("/api/auth/me").then((r) => r.data);
