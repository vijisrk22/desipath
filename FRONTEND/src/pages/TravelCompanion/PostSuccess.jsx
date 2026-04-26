import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Box, Typography, Container, Paper } from '@mui/material';
import { CheckCircleOutline, ArrowBack, ListAlt } from '@mui/icons-material';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const PostSuccess = () => {
  const location = useLocation();
  const isEdit = location.state?.isEdit;

  return (
    <div className="flex flex-col min-h-screen font-poppins">
      <Navbar />
      <div className="bg-gray-50 pt-6 px-4">
        <div className="max-w-sm mx-auto">
          <Link to="/" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Home</Link>
          <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
          <Link to="/travel-companion" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Travel Companion</Link>
          <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
          <span className="text-gray-900 text-sm font-bold font-dmsans">Success</span>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center bg-gray-50 pb-20 pt-10 px-4">
        <Container maxWidth="sm">
          <Paper elevation={0} className="p-10 rounded-[40px] text-center border border-gray-100 shadow-xl shadow-blue-500/5">
            <Box className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircleOutline sx={{ fontSize: 60, color: '#10b981' }} />
            </Box>
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {isEdit ? 'Update Successful!' : 'Post Published!'}
            </h1>
            
            <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">
              {isEdit 
                ? 'Your travel companion post has been updated. The changes are now live for other travelers.'
                : 'Your travel companion post is now live. We\'ve sent a confirmation email to you. Others travelers on your route can now connect with you.'}
            </p>

            <div className="flex flex-col gap-4">
              <Link to="/travel-companion/my-posts">
                <Button 
                  variant="contained" 
                  fullWidth
                  startIcon={<ListAlt />}
                  sx={{ 
                    bgcolor: '#2563eb', 
                    '&:hover': { bgcolor: '#1d4ed8' }, 
                    borderRadius: '20px', 
                    py: 2, 
                    fontWeight: 800, 
                    textTransform: 'none',
                    fontSize: '1rem',
                    color: 'white !important',
                    '& .MuiButton-startIcon': { color: 'white' }
                  }}
                >
                  Manage My Posts
                </Button>
              </Link>
              
              <Link to="/travel-companion">
                <Button 
                  variant="outlined" 
                  fullWidth
                  startIcon={<ArrowBack />}
                  sx={{ 
                    borderColor: '#e5e7eb', 
                    color: '#6b7280',
                    '&:hover': { borderColor: '#2563eb', color: '#2563eb', bgcolor: 'blue.50' }, 
                    borderRadius: '20px', 
                    py: 2, 
                    fontWeight: 800, 
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Back to Network
                </Button>
              </Link>
            </div>
          </Paper>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default PostSuccess;
