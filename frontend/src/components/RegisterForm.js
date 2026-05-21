import React, { useState } from 'react';
import {
  TextField, Button, Box, Alert, CircularProgress, Typography, Grid,
} from '@mui/material';
import { authApi } from '../api/authApi';
import { setUser } from '../utils/auth';
import { COLORS } from '../App';

const Label = ({ children }) => (
  <Typography
    variant="caption"
    sx={{ color: COLORS.textSecondary, letterSpacing: '0.06em', mb: 0.5, display: 'block' }}
  >
    {children}
  </Typography>
);

const RegisterForm = ({ onRegisterSuccess }) => {
  const [username,        setUsername]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error,           setError]           = useState('');
  const [loading,         setLoading]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== passwordConfirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const response = await authApi.register(username, email, password);
      setUser(response.data);
      onRegisterSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const monoInput = { style: { fontFamily: '"Space Mono", monospace', fontSize: '0.875rem' } };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5, fontSize: '0.8rem' }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={1.5}>
        <Grid item xs={12} sm={6}>
          <Label>USERNAME</Label>
          <TextField
            fullWidth placeholder="username" value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading} required inputProps={monoInput}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Label>EMAIL</Label>
          <TextField
            fullWidth placeholder="you@email.com" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading} required inputProps={monoInput}
          />
        </Grid>
        <Grid item xs={12}>
          <Label>PASSWORD</Label>
          <TextField
            fullWidth placeholder="your_password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading} required inputProps={monoInput}
          />
        </Grid>
        <Grid item xs={12}>
          <Label>CONFIRM PASSWORD</Label>
          <TextField
            fullWidth placeholder="your_password" type="password" value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={loading} required inputProps={monoInput}
            error={!!passwordConfirm && password !== passwordConfirm}
            helperText={!!passwordConfirm && password !== passwordConfirm ? 'Passwords do not match' : ''}
          />
        </Grid>
      </Grid>

      <Button
        fullWidth
        variant="contained"
        type="submit"
        disabled={loading}
        sx={{ mt: 3, py: 1.4, fontSize: '0.875rem', letterSpacing: '0.04em' }}
      >
        {loading ? <CircularProgress size={20} sx={{ color: COLORS.bg }} /> : 'Create Account →'}
      </Button>
    </Box>
  );
};

export default RegisterForm;