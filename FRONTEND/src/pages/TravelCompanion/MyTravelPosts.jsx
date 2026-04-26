import React from 'react';
import { useQuery } from 'react-query';
import api from '../../utils/api';
import TravelPostCard from '../../components/TravelCompanion/TravelPostCard';
import { CircularProgress, Box, Typography, Button, Container, Tabs, Tab } from '@mui/material';
import { Add, TravelExplore } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const MyTravelPosts = () => {
  const [tab, setTab] = React.useState(0);

  const { data, isLoading, isError } = useQuery('myTravelPosts', async () => {
    const res = await api.get('/api/travel-companion/my-posts');
    return res.data;
  });

  const requests = data?.requests || [];
  const volunteers = data?.volunteers || [];

  if (isError) return (
    <div className="text-center py-20 text-red-500 font-bold">
      Error loading your posts. Please try again.
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen font-poppins">
      <Navbar />
      <div className="flex-grow bg-gray-50 pt-6 pb-20 px-4">
        <Container maxWidth="lg">
          <div className="mb-6">
            <Link to="/" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Home</Link>
            <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
            <Link to="/travel-companion" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Travel Companion</Link>
            <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
            <span className="text-gray-900 text-sm font-bold font-dmsans">My Posts</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Travel Posts</h1>
              <p className="text-gray-500 font-medium">Manage your requests and volunteer offers</p>
            </div>
            <div className="flex gap-4">
              <Link to="/travel-companion/post-request">
                <Button 
                  variant="contained" 
                  startIcon={<Add sx={{ color: 'white' }} />} 
                  sx={{ 
                    bgcolor: '#2563eb', 
                    color: 'white !important', 
                    '&:hover': { bgcolor: '#1d4ed8' }, 
                    borderRadius: '16px', 
                    py: 1.5, 
                    fontWeight: 700, 
                    textTransform: 'none',
                    '& .MuiButton-startIcon': { color: 'white' }
                  }}
                >
                  New Request
                </Button>
              </Link>
              <Link to="/travel-companion/post-volunteer">
                <Button 
                  variant="contained" 
                  startIcon={<Add sx={{ color: 'white' }} />} 
                  sx={{ 
                    bgcolor: '#2563eb', 
                    color: 'white !important', 
                    '&:hover': { bgcolor: '#1d4ed8' }, 
                    borderRadius: '16px', 
                    py: 1.5, 
                    fontWeight: 700, 
                    textTransform: 'none',
                    '& .MuiButton-startIcon': { color: 'white' }
                  }}
                >
                  New Volunteer Offer
                </Button>
              </Link>
            </div>
          </div>

          <Tabs 
            value={tab} 
            onChange={(_, v) => setTab(v)} 
            sx={{ 
              mb: 6,
              '& .MuiTabs-indicator': { bgcolor: '#2563eb', height: 4, borderRadius: '4px' },
              '& .MuiTab-root': { fontWeight: 700, fontSize: '1.1rem', textTransform: 'none' },
              '& .Mui-selected': { color: '#2563eb !important' }
            }}
          >
            <Tab label={`My Requests (${requests.length})`} />
            <Tab label={`My Volunteer Offers (${volunteers.length})`} />
          </Tabs>

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={10}>
              <CircularProgress sx={{ color: '#2563eb' }} />
            </Box>
          ) : (
            <>
              {tab === 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {requests.length > 0 ? (
                    requests.map(post => <TravelPostCard key={post.id} post={post} type="seeker" isOwner />)
                  ) : (
                    <EmptyState type="requests" />
                  )}
                </div>
              )}
              {tab === 1 && (
                <div className="flex flex-col gap-6">
                  {volunteers.length > 0 ? (
                    volunteers.map(post => <TravelPostCard key={post.id} post={post} type="volunteer" isOwner horizontal />)
                  ) : (
                    <EmptyState type="volunteer offers" />
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      </div>
      <Footer />
    </div>
  );
};

const EmptyState = ({ type }) => (
  <div className="col-span-full bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100 shadow-sm">
    <div className="text-6xl mb-6">📭</div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">No {type} yet</h3>
    <p className="text-gray-500 font-medium mb-8">Ready to post your first {type}?</p>
    <Link to="/travel-companion">
      <Button 
        variant="contained"
        startIcon={<TravelExplore />} 
        sx={{ 
          bgcolor: '#2563eb', 
          color: 'white',
          '&:hover': { bgcolor: '#1d4ed8' },
          fontWeight: 800, 
          textTransform: 'none',
          borderRadius: '16px',
          px: 6,
          py: 1.5
        }}
      >
        Back to Travel Network
      </Button>
    </Link>
  </div>
);

export default MyTravelPosts;
