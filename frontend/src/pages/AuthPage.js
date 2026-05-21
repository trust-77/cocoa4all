import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Tabs, Tab } from '@mui/material';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { COLORS } from '../App';

// ─── decorative orbs ──────────────────────────────────────────────────────────
const Orb = ({ sx }) => (
  <Box
    sx={{
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(80px)',
      pointerEvents: 'none',
      ...sx,
    }}
  />
);

// ─── authPage ─────────────────────────────────────────────────────────────────
const AuthPage = ({ onAuthSuccess }) => {
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
      }}
    >
      {/* background orbs */}
      <Orb sx={{ width: 500, height: 500, top: -100, left: -150, background: 'rgba(0,229,195,0.07)' }} />
      <Orb sx={{ width: 400, height: 400, bottom: -80, right: -100, background: 'rgba(245,166,35,0.06)' }} />

      {/* grid texture overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* card */}
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          position: 'relative',
          zIndex: 1,
          background: 'rgba(18,21,28,0.85)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          borderRadius: '20px',
          overflow: 'visible',
        }}
      >
        {/* top accent line */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`,
            opacity: 0.7,
          }}
        />

        <CardContent sx={{ p: 4 }}>
          {/* logo / brand */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${COLORS.primaryDim}, rgba(0,229,195,0.05))`,
                border: `1px solid rgba(0,229,195,0.2)`,
                mb: 2,
                fontSize: '1.6rem',
              }}
            >
              🌱
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: `linear-gradient(135deg, ${COLORS.textPrimary} 40%, ${COLORS.primary} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 0.5,
              }}
            >
              Cocoa4All
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: COLORS.textSecondary, fontSize: '0.82rem' }}
            >
              THINK IMPACT
            </Typography>
          </Box>

          {/* tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Sign In" />
            <Tab label="Create Account" />
          </Tabs>

          {/* forms */}
          <Box sx={{ minHeight: 260 }}>
            {tab === 0 && <LoginForm onLoginSuccess={onAuthSuccess} />}
            {tab === 1 && <RegisterForm onRegisterSuccess={onAuthSuccess} />}
          </Box>
        </CardContent>
      </Card>

      {/* footer */}
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: COLORS.textMuted,
          letterSpacing: '0.05em',
          fontSize: '0.7rem',
        }}
      >
        COCOA4ALL 2026 · ALL RIGHTS RESERVED
      </Typography>
    </Box>
  );
};

export default AuthPage;