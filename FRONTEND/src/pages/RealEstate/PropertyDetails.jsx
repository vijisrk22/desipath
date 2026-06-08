import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getFullImageUrl } from "../../utils/imageHelper";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  Button, 
  Chip,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  Slide
} from '@mui/material';
import { 
  Bed as BedIcon, 
  Bathtub as BathIcon, 
  SquareFoot as AreaIcon,
  LocationOn,
  ChevronLeft,
  ChevronRight,
  Close as CloseIcon,
  Share,
  FavoriteBorder,
  Business as CompanyIcon,
  CheckCircle as FeatureIcon,
  Phone,
  Email,
  PlayCircleOutline as VideoIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';

const CURRENCIES = [
  { code: "INR", symbol: "₹" },
  { code: "AED", symbol: "د.إ" },
  { code: "USD", symbol: "$" }
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PropertyDetails() {
  const { idOrSlug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.gallery_images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.gallery_images.length - 1 : prev - 1));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div role="tabpanel" hidden={value !== index} {...other}>
        {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
      </div>
    );
  }

  useEffect(() => {
    // Fetch live-cached exchange rates
    api.get('/api/realestate/exchange-rates')
      .then(res => {
        const ratesMap = {};
        res.data.forEach(curr => {
          ratesMap[curr.code] = parseFloat(curr.rate_to_usd);
        });
        setExchangeRates(ratesMap);
      })
      .catch(err => console.error("Error fetching rates:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/realestate/${idOrSlug}`)
      .then(res => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [idOrSlug]);

  const formatPrice = (amount, targetCode) => {
    let finalAmount = amount;
    const code = targetCode || property.currency;

    if (exchangeRates && property.currency !== code) {
      const originalRate = exchangeRates[property.currency] || 1;
      const targetRate = exchangeRates[code] || 1;
      finalAmount = (amount / originalRate) * targetRate;
    }

    if (code === 'INR') {
      if (finalAmount >= 10000000) return `₹ ${(finalAmount / 10000000).toFixed(2)} Cr`;
      if (finalAmount >= 100000) return `₹ ${(finalAmount / 100000).toFixed(2)} Lakhs`;
      return `₹ ${finalAmount.toLocaleString('en-IN')}`;
    }
    if (code === 'AED') return `AED ${Math.round(Number(finalAmount)).toLocaleString('en-US')}`;
    if (code === 'USD') return `$ ${Math.round(Number(finalAmount)).toLocaleString('en-US')}`;
    return `${code} ${Math.round(Number(finalAmount)).toLocaleString('en-US')}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: '#1d4ed8' }} />
      </Box>
    );
  }

  if (!property) {
    return (
      <Container sx={{ py: 10, textCenter: 'center' }}>
        <Typography variant="h5">Property not found</Typography>
        <Button component={Link} to="/real-estate/find" sx={{ mt: 2 }}>Back to Search</Button>
      </Container>
    );
  }

  return (
    <main style={{ zoom: "0.9" }} className="overflow-x-hidden w-full">
      <Navbar />
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
        {/* Header / Navigation */}
        <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', py: 2 }}>
          <Container maxWidth="lg">
            <div className="flex justify-between items-center">
              <Button 
                component={Link} 
                to="/real-estate/find" 
                startIcon={<ChevronLeft />}
                sx={{ color: '#475569', textTransform: 'none', fontWeight: 600 }}
              >
                Back to listings
              </Button>
              <div className="flex gap-2">
                <IconButton size="small" sx={{ border: '1px solid #e2e8f0' }}><Share sx={{ fontSize: 18 }} /></IconButton>
                <IconButton size="small" sx={{ border: '1px solid #e2e8f0' }}><FavoriteBorder sx={{ fontSize: 18 }} /></IconButton>
              </div>
            </div>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            {/* Left Column: Media & Info */}
            <Grid item xs={12} lg={8}>
              {/* Main Image Gallery */}
              <Box sx={{ mb: 4 }}>
                {property.gallery_images && property.gallery_images.length > 0 ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={property.gallery_images.length > 1 ? 8 : 12}>
                      <Paper elevation={0} sx={{ borderRadius: '32px', overflow: 'hidden', height: { xs: '300px', md: '500px' } }} onClick={() => openLightbox(0)}>
                        <img 
                          src={getFullImageUrl(property.gallery_images[0].image_path)} 
                          alt={property.title}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                        />
                      </Paper>
                    </Grid>
                    {property.gallery_images.length > 1 && (
                      <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2 }}>
                        {property.gallery_images.slice(1, 3).map((img, idx) => (
                          <Paper key={idx} elevation={0} sx={{ borderRadius: '32px', overflow: 'hidden', height: property.gallery_images.length > 2 ? 'calc(500px / 2 - 8px)' : '500px' }} onClick={() => openLightbox(idx + 1)}>
                            <img 
                              src={getFullImageUrl(img.image_path)} 
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                            />
                          </Paper>
                        ))}
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <Paper elevation={0} sx={{ borderRadius: '32px', overflow: 'hidden', height: { xs: '300px', md: '500px' } }}>
                    <img 
                      src={getFullImageUrl(property.main_image) || '/img/placeholder_property.jpg'} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </Paper>
                )}
              </Box>

              {/* Title & Stats */}
              <Box sx={{ mb: 6 }}>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Chip label={property.property_type} size="small" sx={{ bgcolor: '#1d4ed8', color: 'white', fontWeight: 600, fontSize: '0.65rem' }} />
                  <Chip label={property.country} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.65rem' }} />
                </div>
                <Typography variant="h4" fontWeight={500} gutterBottom sx={{ fontFamily: "'Outfit', sans-serif", color: '#0f172a' }}>
                  {property.title}
                </Typography>
                <div className="flex items-center gap-1 text-[#64748b] mb-6">
                  <LocationOn sx={{ fontSize: 18 }} />
                  <Typography variant="body1">{property.address}, {property.city}, {property.state}, {property.country}</Typography>
                </div>

                <Paper elevation={0} sx={{ p: 2, borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', bgcolor: 'white' }}>
                  <div className="text-center">
                    <BedIcon sx={{ color: '#94a3b8', mb: 0.5, fontSize: 20 }} />
                    <Typography variant="h6" fontWeight={600} color="#1e293b" sx={{ fontSize: '1.1rem' }}>{property.bedrooms}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Bedrooms</Typography>
                  </div>
                  <Divider orientation="vertical" flexItem />
                  <div className="text-center">
                    <BathIcon sx={{ color: '#94a3b8', mb: 0.5, fontSize: 20 }} />
                    <Typography variant="h6" fontWeight={600} color="#1e293b" sx={{ fontSize: '1.1rem' }}>{property.bathrooms}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Bathrooms</Typography>
                  </div>
                  <Divider orientation="vertical" flexItem />
                  <div className="text-center">
                    <AreaIcon sx={{ color: '#94a3b8', mb: 0.5, fontSize: 20 }} />
                    <Typography variant="h6" fontWeight={600} color="#1e293b" sx={{ fontSize: '1.1rem' }}>{property.area_sqft}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Sq. Ft.</Typography>
                  </div>
                  {property.possession_starts && (
                    <>
                      <Divider orientation="vertical" flexItem />
                      <div className="text-center">
                        <CalendarMonthIcon sx={{ color: '#94a3b8', mb: 0.5, fontSize: 20 }} />
                        <Typography variant="h6" fontWeight={600} color="#1e293b" sx={{ fontSize: '1.1rem' }}>{property.possession_starts}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Possession</Typography>
                      </div>
                    </>
                  )}
                </Paper>
              </Box>

              {/* Tabs Section */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ 
                    '& .MuiTab-root': { 
                      textTransform: 'none', 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      fontFamily: "'Outfit', sans-serif",
                      minWidth: 'auto',
                      mr: 4,
                      color: '#64748b'
                    },
                    '& .Mui-selected': { color: '#1d4ed8 !important' },
                    '& .MuiTabs-indicator': { bgcolor: '#1d4ed8', height: '3px', borderRadius: '3px' }
                  }}
                >
                  <Tab label="Overview" />
                  <Tab label="Floor plan and Pricing" />
                  <Tab label="Project Tour" />
                  <Tab label="Location" />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                {/* Description */}
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h6" fontWeight={500} mb={2} sx={{ fontFamily: "'Outfit', sans-serif" }}>Description</Typography>
                  <Typography variant="body1" color="#475569" sx={{ lineHeight: 1.8 }}>
                    {property.description}
                  </Typography>
                </Box>

                {/* Features */}
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h6" fontWeight={500} mb={2} sx={{ fontFamily: "'Outfit', sans-serif" }}>Features & Amenities</Typography>
                  <Grid container spacing={2}>
                    {property.features?.map((feature, idx) => (
                      <Grid item xs={6} md={4} key={idx}>
                        <div className="flex items-center gap-2">
                          <FeatureIcon sx={{ color: '#10b981', fontSize: 20 }} />
                          <Typography variant="body2" color="#475569">{feature}</Typography>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                 {/* Floor Plans Logic */}
                 <FloorPlansSection 
                   floorPlans={property.floor_plans} 
                   formatPrice={formatPrice} 
                   currencyCode={currency.code}
                 />
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                 {/* Project Tour Logic */}
                 <ProjectTourSection 
                    gallery={property.gallery_images} 
                    videos={property.project_videos} 
                 />
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                 {/* Location Logic */}
                 <LocationSection landmarks={property.landmarks} />
              </TabPanel>
            </Grid>

            {/* Right Column: Pricing & Agent */}
            <Grid item xs={12} lg={4}>
              <div className="sticky top-4">
                <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white', mb: 4 }}>
                  <div className="flex items-center justify-between mb-4">
                     <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>Asking Price</Typography>
                     <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                        {CURRENCIES.map(curr => (
                           <button
                             key={curr.code}
                             onClick={() => setCurrency(curr)}
                             className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${currency.code === curr.code ? 'bg-[#1d4ed8] text-white' : 'text-slate-400 hover:text-slate-600'}`}
                           >
                             {curr.code}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-6">
                    <Typography variant="h3" fontWeight={500} color="#1d4ed8" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                      {formatPrice(property.price, currency.code)}
                    </Typography>
                  </div>
                  
                  <Button 
                    fullWidth 
                    variant="contained" 
                    size="large"
                    sx={{ 
                      borderRadius: '16px', 
                      py: 2, 
                      bgcolor: '#1d4ed8', 
                      fontWeight: 600, 
                      textTransform: 'none',
                      fontSize: '1rem',
                      mb: 2,
                      boxShadow: '0 10px 15px -3px rgba(29, 78, 216, 0.3)'
                    }}
                  >
                    Contact Agent
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    size="large"
                    sx={{ 
                      borderRadius: '16px', 
                      py: 1.5, 
                      borderColor: '#e2e8f0', 
                      color: '#475569', 
                      fontWeight: 600, 
                      textTransform: 'none'
                    }}
                  >
                    Book a Viewing
                  </Button>
                </Paper>

                <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={3} color="#64748b" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Listing Agent</Typography>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-[#1d4ed8]">
                      <CompanyIcon />
                    </div>
                    <div>
                      <Typography variant="subtitle1" fontWeight={500} color="#0f172a">{property.agent_name}</Typography>
                      <Typography variant="caption" color="text.secondary">{property.agent_company}</Typography>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1d4ed8]">
                        <Phone sx={{ fontSize: 16 }} />
                      </div>
                      <Typography variant="body2" color="#475569">{property.agent_phone}</Typography>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1d4ed8]">
                        <Email sx={{ fontSize: 16 }} />
                      </div>
                      <Typography variant="body2" color="#475569">{property.agent_email}</Typography>
                    </div>
                  </div>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer newsletter="block" />

      {/* Lightbox Modal */}
      {property && property.gallery_images && property.gallery_images.length > 0 && (
        <Dialog
          fullScreen
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          TransitionComponent={Transition}
          PaperProps={{
            style: {
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              boxShadow: 'none',
            },
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setLightboxOpen(false)}
            aria-label="close"
            sx={{ position: 'absolute', right: 20, top: 20, color: 'white', zIndex: 10 }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' }}>
            <IconButton onClick={prevImage} sx={{ position: 'absolute', left: 20, color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
              <ChevronLeft fontSize="large" />
            </IconButton>

            <img
              src={getFullImageUrl(property.gallery_images[currentImageIndex].image_path)}
              alt={`Slide ${currentImageIndex + 1}`}
              style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }}
            />

            <IconButton onClick={nextImage} sx={{ position: 'absolute', right: 20, color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
              <ChevronRight fontSize="large" />
            </IconButton>

            <Typography variant="body1" sx={{ position: 'absolute', bottom: 20, color: 'white' }}>
              {currentImageIndex + 1} / {property.gallery_images.length}
            </Typography>
          </Box>
        </Dialog>
      )}
    </main>
  );
}

function FloorPlansSection({ floorPlans, formatPrice, currencyCode }) {
  const [selectedType, setSelectedType] = useState("");
  
  const types = [...new Set(floorPlans?.map(p => p.type) || [])];
  
  useEffect(() => {
    if (types.length > 0 && !selectedType) {
      setSelectedType(types[0]);
    }
  }, [types]);

  const filteredPlans = floorPlans?.filter(p => p.type === selectedType) || [];

  return (
    <Box>
      <div className="flex flex-wrap gap-2 mb-8">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${selectedType === type ? 'bg-[#1d4ed8] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            {type}
          </button>
        ))}
      </div>

      <Typography variant="body2" color="#64748b" mb={3}>{filteredPlans.length} Floor Plans Available</Typography>

      <Grid container spacing={3}>
        {filteredPlans.map((plan, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography variant="h6" fontWeight={600} color="#0f172a">{plan.area_sqft} sqft <span className="text-slate-400 text-sm font-normal">({plan.area_sqm} sqm)</span></Typography>
                    <Typography variant="caption" color="#64748b">Super Built-up Area | {plan.type.split(' ')[0]}</Typography>
                  </div>
               </div>

               <Box sx={{ bgcolor: '#f8fafc', borderRadius: '16px', overflow: 'hidden', mb: 4, height: '200px' }}>
                  <img 
                    src={getFullImageUrl(plan.image_path) || 'https://placehold.co/600x400/f8fafc/1d4ed8?text=3D+Floor+Plan'} 
                    alt={plan.type}
                    className="w-full h-full object-contain p-4"
                  />
               </Box>

               <Typography variant="h5" fontWeight={600} color="#1d4ed8" mb={2}>
                  {formatPrice(parseFloat(plan.price), currencyCode)}
               </Typography>

               <div className="bg-slate-50 p-3 rounded-xl">
                  <Typography variant="caption" color="#64748b" sx={{ display: 'block' }}>{plan.tag || 'New Launch'}</Typography>
                  <Typography variant="body2" fontWeight={600} color="#1e293b">{plan.possession_date}</Typography>
               </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function ProjectTourSection({ gallery, videos }) {
  return (
    <Box>
      {/* Images Section */}
      <Typography variant="h6" fontWeight={500} mb={3} sx={{ fontFamily: "'Outfit', sans-serif" }}>Photo Gallery</Typography>
      <Grid container spacing={2} mb={6}>
        {gallery?.slice(0, 10).map((img, idx) => (
          <Grid item xs={6} md={4} key={idx}>
            <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', height: '160px' }}>
              <img src={getFullImageUrl(img.image_path)} className="w-full h-full object-cover" alt="Gallery" />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Videos Section */}
      <Typography variant="h6" fontWeight={500} mb={3} sx={{ fontFamily: "'Outfit', sans-serif" }}>Video Tours</Typography>
      <Grid container spacing={3}>
        {videos?.slice(0, 3).map((video, idx) => (
          <Grid item xs={12} md={6} key={idx}>
             <Box sx={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', bgcolor: 'black', aspectRatio: '16/9' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={video.video_url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
             </Box>
             <Typography variant="body2" fontWeight={500} mt={1} color="#475569">{video.title}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function LocationSection({ landmarks }) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={500} mb={4} sx={{ fontFamily: "'Outfit', sans-serif" }}>Neighborhood Proximity</Typography>
      <div className="space-y-8">
        {landmarks?.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <Typography variant="h6" fontWeight={600} color="#0f172a" sx={{ fontSize: '1.15rem' }}>
              {item.name}
            </Typography>
            <Typography variant="body2" color="#94a3b8" sx={{ fontSize: '1rem', fontWeight: 500 }}>
              {item.distance}
            </Typography>
          </div>
        ))}
      </div>
    </Box>
  );
}
