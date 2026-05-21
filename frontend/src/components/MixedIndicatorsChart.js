import React from 'react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
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
        minWidth: 150,
      }}
    >
      <Typography variant="caption" sx={{ color: COLORS.textSecondary, display: 'block', mb: 1 }}>
        Year {label}
      </Typography>
      {payload.map((p) => (
        <Box key={p.name} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.3 }}>
          <Typography variant="caption" sx={{ color: p.color, fontSize: '0.72rem' }}>
            {p.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontFamily: '"Space Mono", monospace', fontSize: '0.72rem', color: COLORS.textPrimary, fontWeight: 700 }}
          >
            {p.value?.toFixed(2)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// ─── Custom legend ────────────────────────────────────────────────────────────
const CustomLegend = ({ payload }) => (
  <Box sx={{ display: 'flex', gap: 2.5, justifyContent: 'center', mt: 1 }}>
    {payload?.map((entry) => (
      <Box key={entry.value} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '2px', background: entry.color }} />
        <Typography variant="caption" sx={{ color: COLORS.textSecondary, fontSize: '0.72rem' }}>
          {entry.value}
        </Typography>
      </Box>
    ))}
  </Box>
);

// ─── MixedIndicatorsChart ─────────────────────────────────────────────────────
const MixedIndicatorsChart = ({ data }) => {
  const chartData = data.filter((d) => d.cocoa_price !== null && d.ppi !== null);

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Cocoa Price vs Producer Price Index
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
            Dual-axis comparison · All years
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 6" stroke={COLORS.border} vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: COLORS.textSecondary, fontSize: 11, fontFamily: '"Space Mono", monospace' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: COLORS.textSecondary, fontSize: 11, fontFamily: '"Space Mono", monospace' }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => `$${v}`}
              width={55}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: COLORS.textSecondary, fontSize: 11, fontFamily: '"Space Mono", monospace' }}
              axisLine={false} tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar
              yAxisId="left"
              dataKey="cocoa_price"
              fill={COLORS.primary}
              fillOpacity={0.25}
              radius={[3, 3, 0, 0]}
              name="Cocoa Price (USD)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="ppi"
              stroke={COLORS.secondary}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: COLORS.secondary, stroke: COLORS.bg, strokeWidth: 2 }}
              name="PPI"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MixedIndicatorsChart;