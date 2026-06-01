import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../utils/api";
import { 
  Box, 
  Container, 
  Typography, 
  Avatar, 
  Button, 
  Chip, 
  Grid, 
  Paper,
  Divider,
  CircularProgress,
  IconButton
} from '@mui/material';
import { 
  LocationOn, 
  Work, 
  Translate, 
  Verified, 
  Star,
  Phone, 
  VideoCall, 
  Chat, 
  Article,
  Email,
  Public,
  ArrowBack,
  PlayArrow,
  Collections
} from '@mui/icons-material';

const AstrologerProfile = ({ idOrSlug }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get(`/api/astrologyads/${idOrSlug}`)
      .then(res => {
        setAd(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress sx={{ color: '#4f46e5' }} />
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Typography variant="h5" fontWeight={700}>Profile not found</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
      </div>
    );
  }

  const getModeIcon = (mode) => {
    switch(mode.toLowerCase()) {
      case 'phone': return <Phone />;
      case 'video': return <VideoCall />;
      case 'chat': return <Chat />;
      case 'report': return <Article />;
      case 'in-person': return <LocationOn />;
      default: return null;
    }
  };

  return (
    <div className="bg-[#fafbff] min-h-screen pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header Banner */}
      <div className="relative h-32 md:h-40 bg-gradient-to-r from-[#4f46e5] to-[#3b82f6] overflow-hidden">
        {ad.cover_img_url ? (
          <img src={ad.cover_img_url} className="w-full h-full object-cover opacity-60" alt="cover" />
        ) : (
          <div className="absolute inset-0 opacity-20">
             <div className="grid grid-cols-8 gap-4 p-10">
               {[...Array(24)].map((_, i) => <div key={i} className="text-white text-4xl opacity-20 rotate-45">✨</div>)}
             </div>
          </div>
        )}
        <div className="absolute top-4 left-6">
          <IconButton onClick={() => navigate(-1)} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
            <ArrowBack sx={{ fontSize: 20 }} />
          </IconButton>
        </div>
      </div>

      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 10 }}>
        <Grid container spacing={3}>
          {/* Left Column: Profile Card */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.04)' }}>
              <div className="flex flex-col items-center text-center">
                <Avatar 
                  src={ad.profile_pic_url} 
                  sx={{ 
                    width: 96, 
                    height: 96, 
                    mt: -8, 
                    border: '4px solid white', 
                    boxShadow: '0 8px 12px -3px rgb(0 0 0 / 0.08)',
                    bgcolor: '#4f46e5',
                    fontSize: '2.5rem',
                    fontWeight: 500
                  }}
                >
                  {ad.display_name?.[0]}
                </Avatar>
                
                <div className="mt-3 flex items-center gap-1">
                  <Typography variant="h6" fontWeight={500} color="#0f172a" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                    {ad.display_name}
                  </Typography>
                  <Verified sx={{ color: '#3b82f6', fontSize: 16 }} />
                </div>
                
                <Typography variant="body2" fontWeight={400} sx={{ color: '#4f46e5', mt: 0.25, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  {ad.astrologer_type} Specialist
                </Typography>

                <div className="mt-2 flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full border border-yellow-100">
                  <Star sx={{ color: '#fbbf24', fontSize: 14 }} />
                  <Typography variant="caption" fontWeight={500} color="#92400e">
                    4.9 <span className="text-[#d97706] opacity-60 font-normal">(120+ Reviews)</span>
                  </Typography>
                </div>

                <div className="w-full mt-6 space-y-3">
                   <div className="flex items-center gap-2.5 text-slate-600">
                     <LocationOn sx={{ color: '#94a3b8', fontSize: 18 }} />
                     <Typography variant="caption" fontWeight={400}>{ad.city}, {ad.country}</Typography>
                   </div>
                   <div className="flex items-center gap-2.5 text-slate-600">
                     <Work sx={{ color: '#94a3b8', fontSize: 18 }} />
                     <Typography variant="caption" fontWeight={400}>{ad.experience_years} Years Experience</Typography>
                   </div>
                   <div className="flex items-center gap-2.5 text-slate-600">
                     <Translate sx={{ color: '#94a3b8', fontSize: 18 }} />
                     <div className="flex flex-wrap gap-1">
                       {ad.languages_json?.map(l => <Chip key={l} label={l} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 400 }} />)}
                     </div>
                   </div>
                </div>

                <Button 
                  fullWidth 
                  variant="contained" 
                  size="medium"
                  sx={{ 
                    mt: 4, 
                    borderRadius: '12px', 
                    py: 1, 
                    textTransform: 'none', 
                    fontWeight: 500, 
                    fontSize: '0.85rem',
                    bgcolor: '#4f46e5',
                    boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)',
                    '&:hover': { bgcolor: '#4338ca' }
                  }}
                >
                  Message Now
                </Button>
              </div>
            </Paper>            <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: '24px', border: '1px solid #e2e8f0' }}>
               <Typography variant="subtitle2" fontWeight={500} mb={2} sx={{ fontFamily: "'Outfit', sans-serif", textTransform: 'uppercase', letterSpacing: '0.02em', color: '#64748b' }}>Consultation Modes</Typography>
               <div className="grid grid-cols-3 gap-3">
                 {['Phone', 'Video', 'Chat', 'Report', 'In-Person'].map(mode => {
                    const active = ad.consultation_modes?.includes(mode);
                    return (
                      <div key={mode} className={`flex flex-col items-center gap-1.5 ${active ? 'text-[#4f46e5]' : 'text-slate-200'}`}>
                         <div className={`p-2.5 rounded-xl ${active ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                            {React.cloneElement(getModeIcon(mode), { sx: { fontSize: 18 } })}
                         </div>
                         <Typography variant="caption" fontWeight={400} sx={{ fontSize: '0.65rem' }}>{mode}</Typography>
                      </div>
                    );
                 })}
               </div>
            </Paper>
          </Grid>

          {/* Right Column: Main Content */}
          <Grid item xs={12} md={8}>
            {/* About Section */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" fontWeight={500} mb={2} color="#0f172a" sx={{ fontFamily: "'Outfit', sans-serif" }}>About {ad.display_name}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: '0.875rem' }}>
                {ad.description}
              </Typography>
              
              {ad.certifications && (
                <Box sx={{ mt: 3, p: 2.5, bgcolor: '#f8fafc', borderRadius: '16px', borderLeft: '3px solid #4f46e5', border: '1px solid #e2e8f0' }}>
                  <Typography variant="caption" fontWeight={500} color="#4f46e5" mb={0.5} display="block" sx={{ textTransform: 'uppercase' }}>Certifications & Expertise</Typography>
                  <Typography variant="caption" fontWeight={400} color="#64748b" display="block">{ad.certifications}</Typography>
                </Box>
              )}
            </Paper>

            {/* Services Section */}
            <Paper elevation={0} sx={{ p: 4, mt: 3, borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" fontWeight={500} mb={2} sx={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', color: '#0f172a' }}>Specializations</Typography>
              <div className="flex flex-wrap gap-2">
                {ad.services_json?.map((service, idx) => {
                  const colors = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                  const color = colors[idx % colors.length];
                  return (
                    <Chip 
                      key={idx} 
                      label={service} 
                      size="small"
                      sx={{ 
                        bgcolor: `${color}08`, 
                        color: color, 
                        fontWeight: 500, 
                        border: `1px solid ${color}20`,
                        px: 0.5,
                        fontSize: '0.65rem',
                        borderRadius: '8px'
                      }} 
                    />
                  );
                })}
              </div>
            </Paper>

            {/* Packages Section */}
            <div className="mt-6">
              <Typography variant="subtitle1" fontWeight={500} mb={2} ml={1} sx={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', color: '#0f172a' }}>Consultation Packages</Typography>
              <Grid container spacing={2}>
                {ad.packages?.map((pkg, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        height: '100%', 
                        borderRadius: '24px', 
                        border: pkg.is_popular ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                        position: 'relative',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-4px)' }
                      }}
                    >
                      {pkg.is_popular && (
                        <div className="absolute top-3 right-3 bg-[#4f46e5] text-white px-2 py-0.5 rounded-lg text-[8px] font-medium uppercase tracking-wider">
                          Popular
                        </div>
                      )}
                      <Typography variant="subtitle1" fontWeight={500} color="#0f172a" sx={{ fontFamily: "'Outfit', sans-serif", lineHeight: 1.2 }}>{pkg.name}</Typography>
                      <div className="flex items-baseline gap-1 mt-1 mb-3">
                        <Typography variant="h6" fontWeight={500} color="#4f46e5" sx={{ fontFamily: "'Outfit', sans-serif" }}>${pkg.price}</Typography>
                        <Typography variant="caption" fontWeight={400} color="text.secondary">/ {pkg.duration}</Typography>
                      </div>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 3, minHeight: 40, display: 'block', lineHeight: 1.5 }}>
                        {pkg.description}
                      </Typography>
                      <Button 
                        fullWidth 
                        variant={pkg.is_popular ? "contained" : "outlined"}
                        size="small"
                        sx={{ 
                          borderRadius: '10px', 
                          fontWeight: 500, 
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          bgcolor: pkg.is_popular ? '#4f46e5' : 'transparent',
                          color: pkg.is_popular ? 'white' : '#4f46e5',
                          borderColor: '#4f46e5'
                        }}
                      >
                        Book Session
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            {/* Video Section */}
            <Paper elevation={0} sx={{ p: 4, mt: 3, borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" fontWeight={500} mb={2.5} sx={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', color: '#0f172a' }}>Featured Consultations</Typography>
              <Grid container spacing={2}>
                {[1, 2].map(i => (
                  <Grid item xs={12} sm={6} key={i}>
                    <div className="aspect-video bg-slate-50 rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer border border-slate-200 shadow-sm">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#4f46e5] group-hover:scale-110 transition-transform duration-300 z-10">
                        <PlayArrow sx={{ fontSize: 24 }} />
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 z-10 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <Typography variant="caption" fontWeight={500} sx={{ color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.4)', fontSize: '0.65rem' }}>Sample Consultation Session</Typography>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Gallery Section */}
            <Paper elevation={0} sx={{ p: 4, mt: 3, borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" fontWeight={500} mb={2.5} sx={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', color: '#0f172a' }}>Expert Gallery</Typography>
              <div className="grid grid-cols-4 grid-rows-2 gap-2 h-48 md:h-64">
                <div className="col-span-2 row-span-2 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center text-slate-300 hover:bg-slate-100 transition-colors">
                   <div className="flex flex-col items-center gap-1.5">
                     <Collections sx={{ fontSize: 24, opacity: 0.5 }} />
                     <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portfolio Main</Typography>
                   </div>
                </div>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-200 hover:bg-slate-100 transition-colors">
                    <Collections sx={{ fontSize: 18, opacity: 0.3 }} />
                  </div>
                ))}
              </div>
            </Paper>
            </div>
            
            {/* Locations Served */}
            <Paper elevation={0} sx={{ p: 4, mt: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: '#0f172a', color: 'white' }}>
               <div className="flex items-center gap-2.5 mb-3">
                 <Public sx={{ color: '#6366f1', fontSize: 20 }} />
                 <Typography variant="subtitle1" fontWeight={500} sx={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>Service Coverage</Typography>
               </div>
               <div className="flex flex-wrap gap-1.5">
                 {ad.locations_served?.map(loc => (
                   <div key={loc} className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                     <Typography variant="caption" fontWeight={400} sx={{ fontSize: '0.65rem' }}>{loc}</Typography>
                   </div>
                 ))}
                 {!ad.locations_served && <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 400 }}>Online (Worldwide)</Typography>}
               </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AstrologerProfile;
