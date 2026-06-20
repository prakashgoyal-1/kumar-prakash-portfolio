import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useUIStore } from "../../../store/uiStore";
import "./ThemeToggle.css";

export default function ThemeToggle({ color = "inherit", size = "small" }) {
  const themeMode = useUIStore((s) => s.themeMode);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  const isDark = themeMode === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;

  return (
    <Tooltip title={label}>
      <IconButton
        color={color}
        size={size}
        onClick={toggleTheme}
        aria-label={label}
        className="theme-toggle"
      >
        {isDark ? (
          <LightModeIcon fontSize="small" />
        ) : (
          <DarkModeIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
