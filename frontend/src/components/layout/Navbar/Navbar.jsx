import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useUIStore } from "../../../store/uiStore";
import { useAuth } from "../../../hooks/useAuth";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const location = useLocation();
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useUIStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDrawerOpen(false);
  };

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

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

  // ── Drawer content ────────────────────────────────────────────────────────
  const drawerContent = (
    <Box sx={{ width: 260 }} role="presentation">
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Portfolio
        </Typography>
        {/* Theme toggle inside drawer too for convenience */}
        <IconButton
          size="small"
          onClick={toggleTheme}
          aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
        >
          {themeMode === "dark" ? (
            <LightModeIcon fontSize="small" />
          ) : (
            <DarkModeIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      <Divider />

      <List>
        {PUBLIC_NAV_LINKS.map(({ label, to }) => (
          <ListItem key={to} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={to}
              selected={isActive(to)}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}

        {isAdmin && (
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/admin"
              selected={isActive("/admin")}
              onClick={() => setDrawerOpen(false)}
            >
              <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1.5 }} />
              <ListItemText primary="Admin" />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      <Divider />

      <List>
        {!isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/login"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}

        {isAuthenticated && user && (
          <>
            <ListItem>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: "0.75rem",
                  mr: 1.5,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {user.full_name?.[0]?.toUpperCase() ?? "U"}
              </Avatar>
              <ListItemText
                primary={truncate(user.full_name || user.email, 22)}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={1} className="navbar">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            fontWeight: 700,
            color: "inherit",
            textDecoration: "none",
            letterSpacing: 0.5,
          }}
        >
          Portfolio
        </Typography>

        {isMobile ? (
          // ── Mobile/tablet: theme toggle + hamburger ──────────────────────
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ThemeToggle />
            <IconButton
              color="inherit"
              edge="end"
              aria-label="open navigation menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        ) : (
          // ── Desktop: full nav + theme toggle + auth ──────────────────────
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {PUBLIC_NAV_LINKS.map(({ label, to }) => (
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

            {isAdmin && (
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

            {/* ThemeToggle sits between nav links and auth section */}
            <ThemeToggle />

            {!isAuthenticated && (
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                size="small"
                sx={{ ...navBtnSx("/login"), ml: 0.5 }}
              >
                Login
              </Button>
            )}

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
                <Typography
                  variant="body2"
                  sx={{ ml: 0.75, color: "inherit", opacity: 0.9 }}
                >
                  {truncate(user.full_name || user.email, 20)}
                </Typography>
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
          </Box>
        )}
      </Toolbar>

      {/* Right-anchor drawer for mobile nav */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}
