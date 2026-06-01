import React, { useState, useEffect } from 'react';
import { LinearProgress, Box } from '@mui/material';

const GlobalLoadingIndicator = () => {
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    const start = () => setActiveRequests(prev => prev + 1);
    const stop = () => setActiveRequests(prev => Math.max(0, prev - 1));

    window.addEventListener('api-loading-start', start);
    window.addEventListener('api-loading-stop', stop);

    return () => {
      window.removeEventListener('api-loading-start', start);
      window.removeEventListener('api-loading-stop', stop);
    };
  }, []);

  if (activeRequests === 0) return null;

  return (
    <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <LinearProgress 
        sx={{ 
          height: 3,
          backgroundColor: 'transparent',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#a855f7',
            backgroundImage: 'linear-gradient(90deg, #6366f1, #a855f7, #d946ef)'
          }
        }} 
      />
    </Box>
  );
};

export default GlobalLoadingIndicator;
