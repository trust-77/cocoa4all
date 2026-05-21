import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthTabs = ({ onAuthSuccess }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="inherit"
        sx={{ mb: 3 }}
      >
        <Tab label="Login" sx={{ fontWeight: 600 }} />
        <Tab label="Register" sx={{ fontWeight: 600 }} />
      </Tabs>
      {tabIndex === 0 && <LoginForm onAuthSuccess={onAuthSuccess} />}
      {tabIndex === 1 && <RegisterForm onAuthSuccess={onAuthSuccess} />}
    </Box>
  );
};

export default AuthTabs;
