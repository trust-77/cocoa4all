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
        sx={{ fontFamily: '"Space Mono", monospace', fontSize: '0.9rem', color: COLORS.primary, fontWeight: 700 }}
      >
        ${payload[0].value.toFixed(2)}
      </Typography>
    </Box>
  );
};

// ─── CocoaPriceChart ──────────────────────────────────────────────────────────
const CocoaPriceChart = ({ data }) => {
  const chartData = data.filter((d) => d.cocoa_price !== null);
  const min = Math.min(...chartData.map((d) => d.cocoa_price));
  const max = Math.max(...chartData.map((d) => d.cocoa_price));

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Cocoa Price
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
            Yearly variation · USD
          </Typography>
        </Box>
        <Chip
          label={`$${min.toFixed(0)} – $${max.toFixed(0)}`}
          size="small"
          sx={{
            height: 22, fontSize: '0.68rem', fontFamily: '"Space Mono", monospace',
            background: COLORS.primaryDim, color: COLORS.primary,
            border: `1px solid rgba(0,229,195,0.2)`,
            '& .MuiChip-label': { px: 1.2 },
          }}
        />
      </Box>

      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="cocoaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={COLORS.primary} stopOpacity={0.25} />
                <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke={COLORS.border} vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: COLORS.textSecondary, fontSize: 11, fontFamily: '"Space Mono", monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: COLORS.textSecondary, fontSize: 11, fontFamily: '"Space Mono", monospace' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cocoa_price"
              stroke={COLORS.primary}
              strokeWidth={2}
              fill="url(#cocoaGrad)"
              dot={false}
              activeDot={{ r: 5, fill: COLORS.primary, stroke: COLORS.bg, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default CocoaPriceChart;