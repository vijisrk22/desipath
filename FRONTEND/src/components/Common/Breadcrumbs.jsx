import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumbs as MUIBreadcrumbs, Typography, Container } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on the home page
  if (pathnames.length === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <MUIBreadcrumbs 
        separator={<NavigateNext fontSize="small" sx={{ color: '#9ca3af' }} />} 
        aria-label="breadcrumb"
      >
        <Link 
          to="/" 
          style={{ display: 'flex', alignItems: 'center', color: '#6b7280', textDecoration: 'none', fontWeight: 600 }}
          className="hover:text-[#2563eb] transition-colors"
        >
          <Home sx={{ mr: 0.5, fontSize: 18 }} />
          Home
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

          return last ? (
            <Typography 
              key={to} 
              sx={{ color: '#111827', fontWeight: 700, fontSize: '0.9rem' }}
            >
              {label}
            </Typography>
          ) : (
            <Link 
              key={to} 
              to={to} 
              style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
              className="hover:text-[#2563eb] transition-colors"
            >
              {label}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </Container>
  );
};

export default Breadcrumbs;
