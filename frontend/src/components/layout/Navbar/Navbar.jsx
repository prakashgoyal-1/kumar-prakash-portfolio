import { Link as RouterLink, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useUIStore } from "../../../store/uiStore";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Resume", to: "/resume" },
  { label: "Feedback", to: "/feedback" },
  { label: "Login", to: "/login" },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const { themeMode, toggleTheme } = useUIStore();

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

        {/* Nav links + theme toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {!isMobile &&
            NAV_LINKS.map(({ label, to }) => (
              <Button
                key={to}
                component={RouterLink}
                to={to}
                color="inherit"
                size="small"
                sx={{
                  fontWeight: location.pathname === to ? 700 : 400,
                  borderBottom:
                    location.pathname === to
                      ? `2px solid ${theme.palette.primary.light}`
                      : "2px solid transparent",
                  borderRadius: 0,
                  px: 1.5,
                  py: 0.75,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {label}
              </Button>
            ))}

          <IconButton
            color="inherit"
            onClick={toggleTheme}
            aria-label="toggle theme"
            size="small"
            sx={{ ml: 1 }}
          >
            {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
