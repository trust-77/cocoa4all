import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box, Chip,
} from '@mui/material';
import { COLORS } from '../App';

// ─── Colored cell ─────────────────────────────────────────────────────────────
const ColoredCell = ({ value, isPercent = false }) => {
  if (value === null || value === undefined) {
    return (
      <TableCell align="right" sx={{ color: COLORS.textMuted }}>
        —
      </TableCell>
    );
  }
  const isPositive = value >= 0;
  const color   = isPositive ? COLORS.success : COLORS.danger;
  const bg      = isPositive ? 'rgba(46,204,113,0.08)' : 'rgba(255,92,108,0.08)';
  const display = isPercent ? `${value.toFixed(2)}%` : value.toFixed(2);

  return (
    <TableCell align="right" sx={{ p: '6px 16px' }}>
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          color,
          background: bg,
          fontFamily: '"Space Mono", monospace',
          fontSize: '0.75rem',
          fontWeight: 700,
          px: 0.8,
          py: 0.2,
          borderRadius: '4px',
          border: `1px solid ${isPositive ? 'rgba(46,204,113,0.2)' : 'rgba(255,92,108,0.2)'}`,
        }}
      >
        {isPositive ? '+' : ''}{display}
      </Box>
    </TableCell>
  );
};

// ─── DataTable ────────────────────────────────────────────────────────────────
const DataTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  const years = data.map((d) => d.year);
  const metrics = [
    { key: 'cocoa_price',               label: 'Cocoa Price',           unit: 'USD' },
    { key: 'cocoa_price_change',         label: 'Price Change',          isColored: true },
    { key: 'cocoa_price_pct_change',     label: 'Price Δ%',              isColored: true, isPercent: true },
    { key: 'ppi',                        label: 'PPI' },
    { key: 'ppi_change',                 label: 'PPI Change',            isColored: true },
    { key: 'ppi_pct_change',             label: 'PPI Δ%',                isColored: true, isPercent: true },
    { key: 'ppi_pct_change_reference',   label: 'PPI vs 2011',           isColored: true, isPercent: true },
  ];

  const pivoted = metrics.map((m) => {
    const row = { ...m };
    data.forEach((d) => { row[d.year] = d[m.key]; });
    return row;
  });

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        borderRadius: '16px',
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <Box
        sx={{
          px: 3, py: 2,
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex', alignItems: 'center', gap: 1.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flexGrow: 1, letterSpacing: '-0.01em' }}>
          Yearly Data Summary
        </Typography>
        <Chip
          label={`${years.length} years`}
          size="small"
          sx={{
            height: 20, fontSize: '0.68rem', fontWeight: 600,
            background: COLORS.primaryDim, color: COLORS.primary,
            border: `1px solid rgba(0,229,195,0.2)`,
            fontFamily: '"Space Mono", monospace',
            '& .MuiChip-label': { px: 1 },
          }}
        />
      </Box>

      <TableContainer sx={{ maxHeight: 420 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  minWidth: 180,
                  background: `${COLORS.surfaceHigh} !important`,
                  borderRight: `1px solid ${COLORS.border}`,
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                }}
              >
                METRIC
              </TableCell>
              {years.map((y) => (
                <TableCell
                  key={y}
                  align="right"
                  sx={{ background: `${COLORS.surfaceHigh} !important`, minWidth: 90 }}
                >
                  {y}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {pivoted.map((row, i) => (
              <TableRow key={row.key}>
                <TableCell
                  sx={{
                    color: COLORS.textPrimary,
                    fontFamily: 'inherit !important',
                    fontSize: '0.78rem !important',
                    fontWeight: 500,
                    borderRight: `1px solid ${COLORS.border}`,
                    background: `${i % 2 === 0 ? COLORS.surface : COLORS.bg} !important`,
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {row.label}
                    {row.unit && (
                      <Typography component="span" sx={{ fontSize: '0.65rem', color: COLORS.textMuted }}>
                        ({row.unit})
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                {years.map((y) => {
                  const val = row[y];
                  if (row.isColored) {
                    return <ColoredCell key={y} value={val} isPercent={row.isPercent} />;
                  }
                  return (
                    <TableCell
                      key={y}
                      align="right"
                      sx={{ color: COLORS.textPrimary, fontFamily: '"Space Mono", monospace', fontSize: '0.78rem' }}
                    >
                      {val !== null && val !== undefined ? val.toFixed(2) : '—'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataTable;