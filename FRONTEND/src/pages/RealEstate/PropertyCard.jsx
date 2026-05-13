import { Box, Typography, Paper, Divider, Button } from '@mui/material';
import { 
  Bed as BedIcon, 
  Bathtub as BathIcon, 
  SquareFoot as AreaIcon,
  LocationOn,
  Business as CompanyIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getFullImageUrl } from '../../utils/imageHelper';

export default function PropertyCard({ property, currency, exchangeRates }) {
  const formatPrice = (amount, targetCode) => {
    let finalAmount = amount;
    
    // Perform conversion if target currency differs from property currency
    if (exchangeRates && property.currency !== targetCode) {
      const originalRate = exchangeRates[property.currency] || 1;
      const targetRate = exchangeRates[targetCode] || 1;
      finalAmount = (amount / originalRate) * targetRate;
    }

    if (targetCode === 'INR') {
      if (finalAmount >= 10000000) return `₹ ${(finalAmount / 10000000).toFixed(2)} Cr`;
      if (finalAmount >= 100000) return `₹ ${(finalAmount / 100000).toFixed(2)} Lakhs`;
      return `₹ ${finalAmount.toLocaleString('en-IN')}`;
    }
    if (targetCode === 'AED') return `AED ${Math.round(Number(finalAmount)).toLocaleString('en-US')}`;
    if (targetCode === 'USD') return `$ ${Math.round(Number(finalAmount)).toLocaleString('en-US')}`;
    return `${targetCode} ${Math.round(Number(finalAmount)).toLocaleString('en-US')}`;
  };

  const displayPrice = formatPrice(property.price, currency.code);
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: '24px', 
        overflow: 'hidden', 
        border: '1px solid #e2e8f0',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
        bgcolor: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative', height: '200px' }}>
        <img 
          src={getFullImageUrl(property.main_image) || '/img/placeholder_property.jpg'} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1d4ed8]">
          {property.property_type}
        </div>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight={500} mb={0.5} sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', color: '#0f172a' }}>
          {property.title}
        </Typography>
        
        <div className="flex items-center gap-1 text-[#64748b] mb-4">
          <LocationOn sx={{ fontSize: 14 }} />
          <Typography variant="caption" fontWeight={400}>{property.city}, {property.country}</Typography>
        </div>

        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-1">
               <BedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
               <Typography variant="caption" fontWeight={500} color="#475569">{property.bedrooms} Bed</Typography>
             </div>
             <div className="flex items-center gap-1">
               <BathIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
               <Typography variant="caption" fontWeight={500} color="#475569">{property.bathrooms} Bath</Typography>
             </div>
             <div className="flex items-center gap-1">
               <AreaIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
               <Typography variant="caption" fontWeight={500} color="#475569">{property.area_sqft} sqft</Typography>
             </div>
           </div>
        </div>

        <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />

        <div className="mt-auto flex items-center justify-between">
          <div>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: -0.5 }}>Price</Typography>
            <Typography variant="h6" fontWeight={500} color="#1d4ed8" sx={{ fontFamily: "'Outfit', sans-serif" }}>
              {displayPrice}
            </Typography>
          </div>
          <Button 
            component={Link}
            to={`/real-estate/details/${property.slug}`}
            variant="contained" 
            size="small"
            sx={{ 
              borderRadius: '10px', 
              textTransform: 'none', 
              bgcolor: '#1d4ed8',
              px: 3,
              fontWeight: 500,
              boxShadow: 'none'
            }}
          >
            View Details
          </Button>
        </div>
      </Box>

      {/* Agent Info */}
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
         <div className="flex items-center gap-2">
            <CompanyIcon sx={{ fontSize: 14, color: '#64748b' }} />
            <Typography variant="caption" fontWeight={500} color="#64748b" sx={{ fontSize: '0.65rem' }}>
              Listed by: {property.agent_company || property.agent_name}
            </Typography>
         </div>
      </Box>
    </Paper>
  );
}
