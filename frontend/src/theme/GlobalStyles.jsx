import { GlobalStyles as MuiGlobalStyles } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "./animations.css";

/**
 * Injects global CSS resets and base styles into the document.
 * Reads colors/fonts from the active MUI theme — no hardcoded values.
 * Place this once, inside <ThemeProvider>, near the root of the app.
 */
export default function GlobalStyles() {
  const theme = useTheme();

  return (
    <MuiGlobalStyles
      styles={{
        /* Box-model reset */
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },

        /* Remove default margin / padding */
        "*": {
          margin: 0,
          padding: 0,
        },

        /* Smooth scrolling + font rendering */
        html: {
          scrollBehavior: "smooth",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textSizeAdjust: "100%",
        },

        /* Base body styles pulled from theme tokens */
        body: {
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body1.fontSize,
          lineHeight: theme.typography.body1.lineHeight,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          transition: "background-color 0.3s ease, color 0.3s ease",
        },

        /* Full-height root */
        "#root": {
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },

        /* Images */
        "img, picture, video, canvas, svg": {
          display: "block",
          maxWidth: "100%",
        },

        /* Inputs inherit font from body */
        "input, button, textarea, select": {
          font: "inherit",
        },

        /* Prevent text overflow in headings */
        "h1, h2, h3, h4, h5, h6": {
          overflowWrap: "break-word",
        },

        /* Links */
        a: {
          color: theme.palette.primary.main,
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },

        /* Scrollbar styling (Webkit) */
        "::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        "::-webkit-scrollbar-track": {
          background: theme.palette.background.default,
        },
        "::-webkit-scrollbar-thumb": {
          background: theme.palette.divider,
          borderRadius: "3px",
          "&:hover": {
            background: theme.palette.text.secondary,
          },
        },

        /* Selection highlight */
        "::selection": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
      }}
    />
  );
}
