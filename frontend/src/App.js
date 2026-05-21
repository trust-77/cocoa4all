import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { isAuthenticated, logout, getUser } from './utils/auth';
 
// ─── Design Tokens ────────────────────────────────────────────────────────────
export const COLORS = {
  bg:          '#0B0D12',
  surface:     '#12151C',
  surfaceHigh: '#1A1E29',
  border:      'rgba(255,255,255,0.07)',
  primary:     '#00E5C3',       // electric mint
  primaryDim:  'rgba(0,229,195,0.12)',
  secondary:   '#F5A623',       // amber gold
  secondaryDim:'rgba(245,166,35,0.12)',
  danger:      '#FF5C6C',
  success:     '#2ECC71',
  textPrimary: '#EEF0F6',
  textSecondary:'#6B7280',
  textMuted:   '#3D4250',
};
 
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: COLORS.primary },
    secondary:  { main: COLORS.secondary },
    error:      { main: COLORS.danger },
    success:    { main: COLORS.success },
    background: { default: COLORS.bg, paper: COLORS.surface },
    text:       { primary: COLORS.textPrimary, secondary: COLORS.textSecondary },
    divider:    COLORS.border,
  },
  typography: {
    fontFamily: '"Sora", "Inter", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 500 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6, color: COLORS.textSecondary },
    caption: { color: COLORS.textSecondary, letterSpacing: '0.04em' },
    button: { fontWeight: 600, letterSpacing: '0.02em', textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        body {
          background-color: ${COLORS.bg};
          background-image:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(0,229,195,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(245,166,35,0.05) 0%, transparent 60%);
          background-attachment: fixed;
          min-height: 100vh;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.textMuted}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.textSecondary}; }
        .mono { font-family: 'Space Mono', monospace !important; }
      `,
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(11,13,18,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${COLORS.border}`,
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          transition: 'border-color 0.2s',
          '&:hover': { borderColor: 'rgba(0,229,195,0.15)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 22px',
          fontSize: '0.875rem',
          fontWeight: 600,
        },
        contained: {
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, #00B8A0 100%)`,
          color: COLORS.bg,
          boxShadow: `0 0 20px rgba(0,229,195,0.25)`,
          '&:hover': {
            background: `linear-gradient(135deg, #1AFFE0 0%, ${COLORS.primary} 100%)`,
            boxShadow: `0 0 30px rgba(0,229,195,0.4)`,
          },
          '&:disabled': {
            background: COLORS.surfaceHigh,
            color: COLORS.textMuted,
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: COLORS.border,
          color: COLORS.textPrimary,
          '&:hover': { borderColor: COLORS.primary, background: COLORS.primaryDim },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: COLORS.surfaceHigh,
            borderRadius: 10,
            '& fieldset': { borderColor: COLORS.border },
            '&:hover fieldset': { borderColor: 'rgba(0,229,195,0.3)' },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.primary,
              boxShadow: `0 0 0 3px rgba(0,229,195,0.08)`,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: COLORS.primary },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          background: COLORS.surfaceHigh,
          borderRadius: 10,
          padding: '4px',
          minHeight: 44,
          border: `1px solid ${COLORS.border}`,
        },
        indicator: {
          height: '100%',
          borderRadius: 8,
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, #00B8A0 100%)`,
          zIndex: 0,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          zIndex: 1,
          minHeight: 36,
          fontWeight: 600,
          fontSize: '0.8rem',
          letterSpacing: '0.03em',
          color: COLORS.textSecondary,
          '&.Mui-selected': { color: COLORS.bg },
          transition: 'color 0.2s',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, border: `1px solid ${COLORS.border}` },
        standardError: { background: 'rgba(255,92,108,0.08)', borderColor: 'rgba(255,92,108,0.2)' },
        standardInfo:  { background: 'rgba(0,229,195,0.06)', borderColor: 'rgba(0,229,195,0.15)' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            background: COLORS.surfaceHigh,
            borderBottom: `1px solid ${COLORS.border}`,
            color: COLORS.textSecondary,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background 0.15s',
            '&:hover': { background: 'rgba(255,255,255,0.02)' },
          },
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${COLORS.border}`,
            fontSize: '0.82rem',
            fontFamily: '"Space Mono", monospace',
            padding: '10px 16px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.03em' },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: { color: COLORS.primary },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: COLORS.border },
      },
    },
  },
});
 
// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [user, setUser]                   = useState(null);
 
  useEffect(() => {
    if (authenticated) setUser(getUser());
  }, [authenticated]);
 
  const handleAuthSuccess = () => {
    setAuthenticated(true);
    setUser(getUser());
  };
 
  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
  };
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              authenticated
                ? <DashboardPage user={user} onLogout={handleLogout} />
                : <Navigate to="/auth" />
            }
          />
          <Route
            path="/auth"
            element={
              !authenticated
                ? <AuthPage onAuthSuccess={handleAuthSuccess} />
                : <Navigate to="/" />
            }
          />
          <Route path="*" element={<Navigate to={authenticated ? '/' : '/auth'} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
 
export default App;