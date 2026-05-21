import React from 'react';
import {
  Container, Box, Typography, Button, AppBar, Toolbar,
  CircularProgress, Alert, Divider,
} from '@mui/material';
import useVisualizationData from '../hooks/useVisualizationData';
import DataTable from '../components/DataTable';
import CocoaPriceChart from '../components/CocoaPriceChart';
import PPIChart from '../components/PPIChart';
import MixedIndicatorsChart from '../components/MixedIndicatorsChart';
import { COLORS } from '../App';

// stat card
const StatCard = ({ label, value, unit, trend }) => (
  <Box
    sx={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '14px',
      p: 2.5,
      flex: 1,
      minWidth: 160,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      '&:hover': {
        borderColor: 'rgba(0,229,195,0.2)',
        boxShadow: '0 4px 20px rgba(0,229,195,0.06)',
      },
    }}
  >
    <Typography variant="caption" sx={{ color: COLORS.textMuted, letterSpacing: '0.06em', fontSize: '0.68rem' }}>
      {label}
    </Typography>
    <Typography
      variant="h5"
      sx={{ fontFamily: '"Space Mono", monospace', fontWeight: 700, mt: 0.5, letterSpacing: '-0.02em' }}
    >
      {value ?? '—'}
      {unit && (
        <Typography component="span" sx={{ fontSize: '0.75rem', color: COLORS.textSecondary, ml: 0.5 }}>
          {unit}
        </Typography>
      )}
    </Typography>
    {trend !== undefined && (
      <Typography
        variant="caption"
        sx={{
          color: trend >= 0 ? COLORS.success : COLORS.danger,
          fontSize: '0.72rem',
          fontFamily: '"Space Mono", monospace',
        }}
      >
        {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(2)}%
      </Typography>
    )}
  </Box>
);

// section header
const SectionHeader = ({ title, subtitle }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
      <Box sx={{ width: 3, height: 18, borderRadius: 2, background: COLORS.primary }} />
      <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
        {title}
      </Typography>
    </Box>
    {subtitle && (
      <Typography variant="body2" sx={{ color: COLORS.textSecondary, ml: 2.75, fontSize: '0.8rem' }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

// DashboardPage
const DashboardPage = ({ user, onLogout }) => {
  const { data, loading, error } = useVisualizationData();

  // quick stats from latest data point
  const latest  = data?.[data.length - 1] ?? null;
  const prevVal  = data?.[data.length - 2] ?? null;
  const cocoaTrend = latest && prevVal && prevVal.cocoa_price
    ? ((latest.cocoa_price - prevVal.cocoa_price) / prevVal.cocoa_price) * 100
    : undefined;
  const ppiTrend = latest && prevVal && prevVal.ppi
    ? ((latest.ppi - prevVal.ppi) / prevVal.ppi) * 100
    : undefined;

  return (
    <>
      {/* ── navbar ── */}
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2, minHeight: '60px !important', px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box
              sx={{
                width: 32, height: 32, borderRadius: '10px',
                background: `linear-gradient(135deg, ${COLORS.primaryDim}, rgba(0,229,195,0.04))`,
                border: `1px solid rgba(0,229,195,0.2)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              🌱
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: COLORS.textPrimary }}
            >
              Cocoa4All
            </Typography>
          </Box>

          {user && (
            <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.textPrimary, fontSize: '0.80rem' }}>
              {user.username}
            </Typography>
          )}

          <Button
            variant="outlined"
            size="small"
            onClick={onLogout}
            sx={{
              fontSize: '0.75rem', py: 0.5, px: 1.5,
              borderColor: COLORS.border,
              color: COLORS.textSecondary,
              '&:hover': { borderColor: COLORS.danger, color: COLORS.danger, background: 'rgba(255,92,108,0.06)' },
            }}
          >
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      {/* ── content ── */}
      <Container maxWidth="xl" sx={{ py: 5, px: { xs: 2, sm: 4 } }}>

        {/* page header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800, letterSpacing: '-0.03em',
              background: `linear-gradient(135deg, ${COLORS.textPrimary} 50%, ${COLORS.primary} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', mb: 1,
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
            Cocoa price & Producer Price Index analytics - Yearly historical data
          </Typography>
        </Box>

        {/* error */}
        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {/* loading */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 8 }}>
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
              Fetching data…
            </Typography>
          </Box>
        ) : data.length > 0 ? (
          <>
            {/* ── Stat cards ── */}
            <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap' }}>
              <StatCard
                label="LATEST COCOA PRICE"
                value={latest?.cocoa_price?.toFixed(2)}
                unit="USD"
                trend={cocoaTrend}
              />
              <StatCard
                label="LATEST PPI"
                value={latest?.ppi?.toFixed(2)}
                trend={ppiTrend}
              />
              <StatCard
                label="YEAR"
                value={latest?.year}
              />
              <StatCard
                label="DATA POINTS"
                value={data.length}
              />
            </Box>

            <Divider sx={{ mb: 5 }} />

            {/* ── Data Table ── */}
            <SectionHeader title="Yearly Summary" subtitle="All metrics across the full dataset" />
            <Box sx={{ mb: 6 }}>
              <DataTable data={data} />
            </Box>

            <Divider sx={{ mb: 5 }} />

            {/* ── charts ── */}
            <SectionHeader title="Charts" subtitle="Time-series charts for key indicators" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <CocoaPriceChart data={data} />
              <PPIChart data={data} />
              <MixedIndicatorsChart data={data} />
            </Box>
          </>
        ) : (
          <Alert severity="info">
            No data available. Please ensure the ETL process has completed successfully.
          </Alert>
        )}
      </Container>
    </>
  );
};

export default DashboardPage;