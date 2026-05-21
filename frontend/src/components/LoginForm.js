import React, { useState } from 'react';
import {
  TextField, Button, Box, Alert, CircularProgress, Typography,
} from '@mui/material';
import { authApi } from '../api/authApi';
import { setToken, setUser } from '../utils/auth';
import { COLORS } from '../App';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.login(username, password);
      const { access_token, user } = response.data;
      setToken(access_token);
      setUser(user);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5, fontSize: '0.8rem' }}>
          {error}
        </Alert>
      )}

      <Typography
        variant="caption"
        sx={{ color: COLORS.textSecondary, letterSpacing: '0.06em', mb: 0.5, display: 'block' }}
      >
        USERNAME
      </Typography>
      <TextField
        fullWidth
        placeholder="your_username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        required
        sx={{ mb: 2 }}
        inputProps={{ style: { fontFamily: '"Space Mono", monospace', fontSize: '0.875rem' } }}
      />

      <Typography
        variant="caption"
        sx={{ color: COLORS.textSecondary, letterSpacing: '0.06em', mb: 0.5, display: 'block' }}
      >
        PASSWORD
      </Typography>
      <TextField
        fullWidth
        placeholder="your_password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
        sx={{ mb: 3 }}
        inputProps={{ style: { fontFamily: '"Space Mono", monospace', fontSize: '0.875rem' } }}
      />

      <Button
        fullWidth
        variant="contained"
        type="submit"
        disabled={loading}
        sx={{ py: 1.4, fontSize: '0.875rem', letterSpacing: '0.04em' }}
      >
        {loading ? <CircularProgress size={20} sx={{ color: COLORS.bg }} /> : 'Sign In →'}
      </Button>
    </Box>
  );
};

export default LoginForm;