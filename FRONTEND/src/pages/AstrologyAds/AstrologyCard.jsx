import React from 'react';
import { 
  Typography, 
  Avatar, 
  Chip, 
  Button,
  Rating
} from '@mui/material';
import { 
  LocationOn, 
  Work, 
  Translate, 
  Phone, 
  VideoCall, 
  Chat, 
  Article,
  Person,
  Verified
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AstrologyCard = ({ ad }) => {
  const navigate = useNavigate();

  const services = ad.services_json || [];
  const modes = ad.consultation_modes || [];
  const languages = ad.languages_json || [];

  const getModeIcon = (mode) => {
    switch(mode.toLowerCase()) {
      case 'phone': return <Phone sx={{ fontSize: 16 }} />;
      case 'video': return <VideoCall sx={{ fontSize: 16 }} />;
      case 'chat': return <Chat sx={{ fontSize: 16 }} />;
      case 'report': return <Article sx={{ fontSize: 16 }} />;
      case 'in-person': return <Person sx={{ fontSize: 16 }} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-200 hover:shadow-[0_30px_60px_rgba(124,58,237,0.1)] transition-all duration-500 overflow-hidden flex flex-col h-full group relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Main Content Area */}
      <div className="p-8 pb-4 flex-grow">
        <div className="flex flex-col items-start gap-6">
          {/* Profile Header */}
          <div className="flex items-center gap-5 w-full">
            <Avatar 
              src={ad.profile_pic_url} 
              sx={{ 
                width: 84, 
                height: 84, 
                bgcolor: '#f5f3ff', 
                color: '#7c3aed',
                fontWeight: 500,
                fontSize: '1.75rem',
                border: '3px solid #f1f5f9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}
            >
              {ad.display_name?.[0]}
            </Avatar>
            <div className="flex-grow min-w-0">
              <Typography variant="h5" fontWeight={500} sx={{ color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em', mb: 1, fontFamily: "'Outfit', sans-serif" }}>
                {ad.display_name}
              </Typography>
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-2.5 py-0.5 bg-violet-600 text-white rounded-md text-[10px] font-medium uppercase tracking-wider">
                  {ad.astrologer_type} Expert
                </div>
                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  <Verified sx={{ fontSize: 10 }} />
                  <span className="text-[9px] font-medium uppercase tracking-tighter">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 w-full">
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
                <Typography variant="caption" display="block" sx={{ color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', fontSize: '0.5rem', mb: 0.5, letterSpacing: '0.05em' }}>Location</Typography>
                <Typography variant="caption" noWrap fontWeight={400} sx={{ color: '#334155', fontSize: '0.85rem', fontFamily: "'Outfit', sans-serif" }}>{ad.city}</Typography>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
                <Typography variant="caption" display="block" sx={{ color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', fontSize: '0.5rem', mb: 0.5, letterSpacing: '0.05em' }}>Experience</Typography>
                <Typography variant="caption" noWrap fontWeight={400} sx={{ color: '#334155', fontSize: '0.85rem', fontFamily: "'Outfit', sans-serif" }}>{ad.experience_years} Yrs</Typography>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 flex flex-col items-center justify-center text-center">
                <Typography variant="caption" display="block" sx={{ color: '#10b981', fontWeight: 500, textTransform: 'uppercase', fontSize: '0.5rem', mb: 0.5, letterSpacing: '0.05em' }}>Session Fee</Typography>
                <Typography variant="caption" noWrap fontWeight={500} sx={{ color: '#065f46', fontSize: '0.9rem', fontFamily: "'Outfit', sans-serif" }}>${ad.price}+</Typography>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1.5 w-full">
            {services.slice(0, 3).map((service, idx) => (
              <div key={idx} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[0.65rem] font-medium text-slate-500">
                {service}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Languages & Modes Bar */}
      <div className="px-8 py-4 bg-white border-y border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Translate sx={{ fontSize: 14, color: '#94a3b8' }} />
          <Typography variant="caption" fontWeight={400} sx={{ color: '#64748b', fontSize: '0.7rem' }}>
            {languages.slice(0, 2).join(" • ")}
          </Typography>
        </div>
        <div className="flex gap-4">
          {modes.slice(0, 3).map((mode, idx) => (
            <div key={idx} className="text-slate-300 hover:text-violet-600 transition-all scale-110" title={mode}>
              {getModeIcon(mode)}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-8 pt-4 flex gap-4">
        <Button 
          fullWidth 
          variant="outlined"
          onClick={() => navigate(`/astrologer/profile/${ad.slug || ad.id}`)}
          sx={{ 
            borderRadius: '20px', 
            textTransform: 'none', 
            fontWeight: 500, 
            py: 1.5,
            fontSize: '0.875rem',
            borderColor: '#e2e8f0',
            color: '#64748b',
            bgcolor: '#f8fafc',
            '&:hover': { borderColor: '#7c3aed', color: '#7c3aed', bgcolor: '#f5f3ff' }
          }}
        >
          View Profile
        </Button>
        <Button 
          fullWidth 
          variant="contained"
          sx={{ 
            borderRadius: '20px', 
            textTransform: 'none', 
            fontWeight: 500, 
            py: 1.5,
            fontSize: '0.875rem',
            bgcolor: '#7c3aed',
            boxShadow: '0 10px 20px -5px rgba(124, 58, 237, 0.3)',
            '&:hover': { bgcolor: '#6d28d9', transform: 'translateY(-1px)' },
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
