import { createTheme } from "@mui/material/styles";
import tokens from "./theme.json";

/**
 * Returns an MUI theme for the given mode ("light" | "dark").
 * All design decisions live in theme.json — nothing is hardcoded here.
 */
export function getTheme(mode = "light") {
  const modeTokens = tokens[mode]; // tokens.light or tokens.dark
  const { typography, spacing, borderRadius, shadows } = tokens;

  return createTheme({
    palette: {
      mode,
      primary: modeTokens.primary,
      secondary: modeTokens.secondary,
      background: modeTokens.background,
      text: modeTokens.text,
      error: modeTokens.error,
      success: modeTokens.success,
      warning: modeTokens.warning,
      divider: modeTokens.divider,
    },

    typography: {
      fontFamily: typography.fontFamily.join(", "),
      h1: typography.h1,
      h2: typography.h2,
      h3: typography.h3,
      h4: typography.h4,
      h5: typography.h5,
      h6: typography.h6,
      body1: typography.body1,
      body2: typography.body2,
    },

    spacing, // 8px base unit — theme.spacing(2) === 16px

    shape: {
      borderRadius, // 4px default for all MUI components
    },

    shadows: [
      "none",
      shadows.sm,
      shadows.md,
      shadows.lg,
      // MUI needs 25 shadow levels; fill the rest with the lg preset
      ...Array(21).fill(shadows.lg),
    ],

    components: {
      // Ensure buttons inherit the border-radius token
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none", // no ALL-CAPS labels
            borderRadius,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: borderRadius * 2 }, // 8px for cards
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" }, // kill MUI's default gradient
        },
      },
    },
  });
}
