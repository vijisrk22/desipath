import React from 'react';
import { 
  Typography, 
  Avatar, 
  Button
} from '@mui/material';
import { 
  Translate, 
  Phone, 
  VideoCall, 
  Chat, 
  Verified
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getFullImageUrl } from '../../utils/imageHelper';

const AstrologyCard = ({ ad }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);

  const services = ad.services_json || [];
  const modes = ad.consultation_modes || [];

  const themeColor = '#2563eb'; // Radiant Blue
  const themeHoverColor = '#1d4ed8'; // Darker blue for hover
  const themeShadow = 'rgba(37, 99, 235, 0.2)';

  const handleConsultNow = () => {
    const chatPartnerInfo = {
      chatPartnerId: ad.user_id,
      chatPartnerName: ad.display_name,
    };
    navigate(
      `/inbox?adType=astrologyad&adId=${ad.id}&chatPartnerInfo=${encodeURIComponent(
        JSON.stringify(chatPartnerInfo)
      )}`
    );
  };

  return (
    <div 
      className="bg-white rounded-[32px] border border-slate-200 transition-all duration-500 overflow-hidden flex flex-col h-full group relative" 
      style={{ 
        fontFamily: "'Inter', sans-serif",
        boxShadow: isHovered ? `0 30px 60px ${themeShadow}` : '0 10px 40px rgba(0,0,0,0.03)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Main Content Area */}
      <div className="p-8 pb-3 flex-grow">
        <div className="flex flex-col items-start gap-6">
          {/* Profile Header */}
          <div className="flex items-center gap-5 w-full">
            <Avatar 
              src={ad.profile_pic_url ? getFullImageUrl(ad.profile_pic_url) : ''} 
              sx={{ 
                width: 84, 
                height: 84, 
                bgcolor: '#fff0f6', 
                color: themeColor,
                fontWeight: 500,
                fontSize: '1.75rem',
                border: '3px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}
            >
              {ad.display_name?.[0]}
            </Avatar>
            
            <div className="flex flex-col gap-1.5 min-w-0">
              <Typography 
                variant="h5" 
                fontWeight={600} 
                sx={{ 
                  color: '#0f172a', 
                  lineHeight: 1.1, 
                  letterSpacing: '-0.02em', 
                  fontFamily: "'Outfit', sans-serif" 
                }}
              >
                {ad.display_name}
              </Typography>

              <div>
                <span className="inline-flex items-center gap-1 text-[#2563eb] bg-[#eff6ff] border border-[#dbeafe] px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter">
                  <Verified sx={{ fontSize: 10, color: '#2563eb' }} /> VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 w-full">
            {/* Location */}
            <div className="bg-[#f0f9ff] p-4 rounded-[20px] border border-[#e0f2fe] flex flex-col items-center justify-center text-center">
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ 
                  color: '#0284c7', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  fontSize: '0.6rem', 
                  mb: 0.5, 
                  letterSpacing: '0.05em' 
                }}
              >
                Location
              </Typography>
              <Typography 
                variant="caption" 
                noWrap 
                fontWeight={500} 
                sx={{ 
                  color: '#0c4a6e', 
                  fontSize: '0.875rem', 
                  fontFamily: "'Outfit', sans-serif" 
                }}
              >
                {ad.city}
              </Typography>
            </div>

            {/* Experience */}
            <div className="bg-[#faf5ff] p-4 rounded-[20px] border border-[#f3e8ff] flex flex-col items-center justify-center text-center">
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ 
                  color: '#7c3aed', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  fontSize: '0.6rem', 
                  mb: 0.5, 
                  letterSpacing: '0.05em' 
                }}
              >
                Experience
              </Typography>
              <Typography 
                variant="caption" 
                noWrap 
                fontWeight={500} 
                sx={{ 
                  color: '#1e1b4b', 
                  fontSize: '0.875rem', 
                  fontFamily: "'Outfit', sans-serif" 
                }}
              >
                {ad.experience_years} Yrs
              </Typography>
            </div>

            {/* Session Fee */}
            <div className="bg-[#f0fdf4] p-4 rounded-[20px] border border-[#dcfce7] flex flex-col items-center justify-center text-center">
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ 
                  color: '#10b981', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  fontSize: '0.6rem', 
                  mb: 0.5, 
                  letterSpacing: '0.05em' 
                }}
              >
                Session Fee
              </Typography>
              <Typography 
                variant="caption" 
                noWrap 
                fontWeight={600} 
                sx={{ 
                  color: '#064e3b', 
                  fontSize: '0.9rem', 
                  fontFamily: "'Outfit', sans-serif" 
                }}
              >
                ${ad.price}+
              </Typography>
            </div>
          </div>

          {/* Services / Tags */}
          <div className="flex flex-wrap gap-2 w-full mt-1">
            {services.slice(0, 3).map((service, idx) => {
              const chipColors = [
                "bg-[#eef2ff] border-[#e0e7ff] text-[#4f46e5]",
                "bg-[#fffbeb] border-[#fef3c7] text-[#b45309]",
                "bg-[#fdf2f8] border-[#fce7f3] text-[#db2777]"
              ];
              const colorClass = chipColors[idx % chipColors.length];
              return (
                <div 
                  key={idx} 
                  className={`px-4 py-1.5 border rounded-full text-[0.75rem] font-semibold tracking-wide ${colorClass}`}
                >
                  {service}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 w-full my-1" />

      {/* Languages & Modes Bar */}
      <div className="px-8 py-3 flex justify-between items-center bg-white">
        <div className="text-slate-400 flex items-center">
          <Translate sx={{ fontSize: 20 }} />
        </div>
        <div className="flex gap-5 text-slate-300">
          <Phone sx={{ fontSize: 20, color: '#94a3b8' }} />
          <VideoCall sx={{ fontSize: 22, color: '#94a3b8' }} />
          <Chat sx={{ fontSize: 20, color: '#94a3b8' }} />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-8 pt-2 flex gap-4">
        <Button 
          fullWidth 
          variant="outlined"
          onClick={() => navigate(`/astrologer/profile/${ad.slug || ad.id}`)}
          sx={{ 
            borderRadius: '24px', 
            textTransform: 'none', 
            fontWeight: 500, 
            py: 1.5,
            fontSize: '0.875rem',
            borderColor: '#e2e8f0',
            color: '#64748b',
            bgcolor: '#f8fafc',
            transition: 'all 0.3s',
            '&:hover': { borderColor: themeColor, color: themeColor, bgcolor: '#fff0f6' }
          }}
        >
          View Profile
        </Button>
        <Button 
          fullWidth 
          variant="contained"
          onClick={handleConsultNow}
          sx={{ 
            borderRadius: '24px', 
            textTransform: 'none', 
            fontWeight: 500, 
            py: 1.5,
            fontSize: '0.875rem',
            bgcolor: themeColor,
            boxShadow: `0 10px 20px -5px ${themeShadow}`,
            '&:hover': { bgcolor: themeHoverColor, transform: 'translateY(-1px)' },
            transition: 'all 0.3s'
          }}
        >
          Consult Now
        </Button>
      </div>
    </div>
  );
};

export default AstrologyCard;
