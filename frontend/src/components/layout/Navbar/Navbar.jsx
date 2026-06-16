import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useUIStore } from "../../../store/uiStore";
import { useAuth } from "../../../hooks/useAuth";
import { truncate } from "../../../utils/helpers";
import "./Navbar.css";

const PUBLIC_NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Resume", to: "/resume" },
  { label: "Feedback", to: "/feedback" },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useUIStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (to) => location.pathname === to;

  const navBtnSx = (to) => ({
    fontWeight: isActive(to) ? 700 : 400,
    borderBottom: isActive(to)
      ? `2px solid ${theme.palette.primary.light}`
      : "2px solid transparent",
    borderRadius: 0,
    px: 1.5,
    py: 0.75,
    "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
  });

  return (
    <AppBar position="sticky" elevation={1} className="navbar">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ fontWeight: 700, color: "inherit", textDecoration: "none" }}
        >
          Portfolio
        </Typography>

        {/* Nav links + auth controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {!isMobile &&
            PUBLIC_NAV_LINKS.map(({ label, to }) => (
              <Button
                key={to}
                component={RouterLink}
                to={to}
                color="inherit"
                size="small"
                sx={navBtnSx(to)}
              >
                {label}
              </Button>
            ))}

          {/* Admin link — only visible to admins */}
          {!isMobile && isAdmin && (
            <Tooltip title="Admin Dashboard">
              <Button
                component={RouterLink}
                to="/admin"
                color="inherit"
                size="small"
                startIcon={<AdminPanelSettingsIcon fontSize="small" />}
                sx={navBtnSx("/admin")}
              >
                Admin
              </Button>
            </Tooltip>
          )}

          {/* Auth: logged-out state */}
          {!isAuthenticated && (
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              size="small"
              sx={navBtnSx("/login")}
            >
              Login
            </Button>
          )}

          {/* Auth: logged-in state */}
          {isAuthenticated && user && (
            <>
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: "0.8rem",
                  bgcolor: theme.palette.primary.main,
                  ml: 1,
                }}
              >
                {user.full_name?.[0]?.toUpperCase() ?? "U"}
              </Avatar>
              {!isMobile && (
                <Typography
                  variant="body2"
                  sx={{ ml: 0.75, color: "inherit", opacity: 0.9 }}
                >
                  {truncate(user.full_name || user.email, 20)}
                </Typography>
              )}
              <Tooltip title="Logout">
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={handleLogout}
                  aria-label="logout"
                  sx={{ ml: 0.5 }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* Theme toggle */}
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            aria-label="toggle theme"
            size="small"
            sx={{ ml: 0.5 }}
          >
            {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
