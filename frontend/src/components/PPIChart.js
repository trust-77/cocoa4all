import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { COLORS } from '../App';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        background: COLORS.surfaceHigh,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '10px',
        p: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <Typography variant="caption" sx={{ color: COLORS.textSecondary, display: 'block', mb: 0.5 }}>
        Year {label}
      </Typography>
      <Typography
        sx={{ fontFamily: '"Space Mono", monospace', fontSize: '0.9rem', color: COLORS.secondary, fontWeight: 700 }}
      >
        {payload[0].value.toFixed(2)}
      </Typography>
    </Box>
  );
};

// ─── PPIChart ─────────────────────────────────────────────────────────────────
const PPIChart = ({ data }) => {
  const chartData = data.filter((d) => d.ppi !== null);
  const min = Math.min(...chartData.map((d) => d.ppi));
  const max = Math.max(...chartData.map((d) => d.ppi));

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Producer Price Index
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
            PPI · Yearly variation
          </Typography>
        </Box>
        <Chip
          label={`${min.toFixed(0)} – ${max.toFixed(0)}`}
          size="small"
          sx={{
            height: 22, fontSize: '0.68rem', fontFamily: '"Space Mono", monospace',
            background: COLORS.secondaryDim, color: COLORS.secondary,
            border: `1px solid rgba(245,166,35,0.2)`,
            '& .MuiChip-label': { px: 1.2 },
          }}
        />
      </Box>

      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="ppiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={COLORS.secondary} stopOpacity={0.2} />
                <stop offset="100%" stopColor={COLORS.secondary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke={COLORS.border} vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: COLORS.textSecondary, fontSize: 11, fontFamily: '"Space Mono", monospace' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: COLORS.textSecondary, fontSize: 11, fontFamily: '"Space Mono", monospace' }}
              axisLine={false} tickLine={false}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="ppi"
              stroke={COLORS.secondary}
              strokeWidth={2}
              fill="url(#ppiGrad)"
              dot={false}
              activeDot={{ r: 5, fill: COLORS.secondary, stroke: COLORS.bg, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PPIChart;