import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  // ── Form validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Minimum 8 characters";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Email/password submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await login(email, password);
    if (ok) navigate("/");
  };

  // ── Google Sign-In ───────────────────────────────────────────────────────────
  const handleGoogleLogin = () => {
    if (!window.google) {
      console.error("Google Identity Services not loaded");
      return;
    }
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const ok = await loginWithGoogle(response.credential);
        if (ok) navigate("/");
      },
    });
    window.google.accounts.id.prompt();
  };

  return (
    <Box className="login-page">
      <Card className="login-card" elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={0.5}>
            Welcome back
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Sign in to your portfolio account
          </Typography>

          {/* API error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Email + Password form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              margin="normal"
              autoComplete="email"
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              margin="normal"
              autoComplete="current-password"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2, mb: 1 }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">
              or
            </Typography>
          </Divider>

          {/* Google Sign-In */}
          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Sign in with Google
          </Button>

          {/* Register link */}
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mt={3}
          >
            Don't have an account?{" "}
            <RouterLink
              to="/register"
              style={{ color: "inherit", fontWeight: 600 }}
            >
              Register
            </RouterLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
