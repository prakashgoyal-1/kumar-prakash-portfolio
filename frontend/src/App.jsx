import { useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import { getTheme } from "./theme/theme";
import GlobalStyles from "./theme/GlobalStyles";
import { ToastProvider } from "./components/ui/ToastProvider/ToastProvider";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import AuthGuard from "./components/layout/AuthGuard/AuthGuard";
import AdminGuard from "./components/layout/AdminGuard/AdminGuard";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Resume from "./pages/Resume/Resume";
import Feedback from "./pages/Feedback/Feedback";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import NotFound from "./pages/NotFound/NotFound";

import { useUIStore } from "./store/uiStore";

export default function App() {
  const themeMode = useUIStore((s) => s.themeMode);
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <ToastProvider>
        <BrowserRouter>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                overflowY: "auto", // page content scrolls independently
                paddingBottom: "60px", // reserve space for fixed footer
              }}
            >
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/login" element={<Login />} />

                {/* Admin-only route */}
                <Route
                  path="/admin"
                  element={
                    <AdminGuard>
                      <AdminDashboard />
                    </AdminGuard>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
            <Box
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10,
              }}
            >
              <Footer />
            </Box>
            {/* <Footer /> */}
          </Box>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
