import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState(
    localStorage.getItem("themeMode") || "light",
  );

  const currentRole = user?.role || "ROLE_USER";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#2563eb",
          },
          secondary: {
            main: "#7c3aed",
          },
          background: {
            default: mode === "dark" ? "#020617" : "#f8fafc",
            paper: mode === "dark" ? "#0f172a" : "#ffffff",
          },
        },
        shape: {
          borderRadius: 14,
        },
        typography: {
          fontFamily: "Inter, Arial, sans-serif",
          h4: {
            fontWeight: 800,
          },
          h5: {
            fontWeight: 800,
          },
          h6: {
            fontWeight: 800,
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 22,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode],
  );

  const handleThemeToggle = () => {
    const nextMode = mode === "light" ? "dark" : "light";
    setMode(nextMode);
    localStorage.setItem("themeMode", nextMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          onThemeToggle={handleThemeToggle}
          mode={mode}
        />

        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          currentRole={currentRole}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { lg: "calc(100% - 280px)" },
            minHeight: "100vh",
            background:
              mode === "dark"
                ? "radial-gradient(circle at top right, rgba(37,99,235,0.16), transparent 30%), #020617"
                : "radial-gradient(circle at top right, rgba(37,99,235,0.10), transparent 30%), #f8fafc",
          }}
        >
          <Toolbar />

          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
