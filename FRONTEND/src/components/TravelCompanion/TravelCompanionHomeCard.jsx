import React from 'react';
import { Typography, Avatar, Box } from '@mui/material';
import { Flight, CalendarMonth } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const TravelCompanionHomeCard = ({ post, type = 'volunteer' }) => {
  const navigate = useNavigate();
  const isVolunteer = type === 'volunteer';
  const legs = post.route_legs || [];
  const departure = legs.find(l => l.leg_type === 'departure');
  const destination = legs.find(l => l.leg_type === 'destination');

  const gradients = [
    'linear-gradient(135deg, #450a0a 0%, #1e1b4b 100%)', // Deep Red to Indigo
    'linear-gradient(135deg, #1e3a8a 0%, #7f1d1d 100%)', // Blue to Maroon
    'linear-gradient(135deg, #581c87 0%, #450a0a 100%)', // Purple to Red
    'linear-gradient(135deg, #1e1b4b 0%, #991b1b 100%)', // Indigo to Dark Red
    'linear-gradient(135deg, #7c2d12 0%, #1e3a8a 100%)', // Rust to Blue
    'linear-gradient(135deg, #1e40af 0%, #701a75 100%)', // Royal Blue to Fuchsia
    'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)', // Violet to Deep Indigo
    'linear-gradient(135deg, #881337 0%, #1e3a8a 100%)', // Rose to Blue
  ];

  // Pick a gradient based on the post ID or just random, with fallback
  const id = typeof post.id === 'number' ? post.id : (post.id ? post.id.length : 0);
  const gradient = gradients[id % gradients.length] || gradients[0];

  return (
    <div 
      onClick={() => navigate('/travel-companion')}
      className="relative w-full h-[320px] rounded-[32px] overflow-hidden cursor-pointer group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl shadow-xl"
      style={{ background: gradient }}
    >
      {/* Decorative Overlays */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        {/* Top: User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar 
              src={post.user?.profile_photo} 
              sx={{ width: 40, height: 40, border: '2px solid rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.2)', fontWeight: 700 }}
            >
              {post.user?.name?.[0]}
            </Avatar>
            <div>
              <Typography variant="subtitle2" fontWeight={800} className="leading-tight" sx={{ fontSize: '0.8rem' }}>
                {post.user?.name || 'Traveler'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                {isVolunteer ? 'Offering Help' : 'Seeking Help'}
              </Typography>
            </div>
          </div>
          <div className="text-right bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
            <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.7rem' }}>
              {post.gift_card_offer && post.gift_card_offer !== '0' ? `$${post.gift_card_offer}` : 
               post.gift_card_preference && post.gift_card_preference !== 'free' ? `$${post.gift_card_preference}` : 'FREE'}
            </Typography>
          </div>
        </div>

        {/* Center: Route */}
        <div className="flex flex-col items-center gap-1 py-2">
          <div className="flex items-center justify-between w-full px-2">
            <div className="text-center flex-1">
              <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: '-0.02em', fontSize: '1.5rem' }}>{departure?.iata_code}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, fontSize: '0.65rem', display: 'block', mt: -0.5 }} className="truncate max-w-[80px] mx-auto">{departure?.city}</Typography>
            </div>

            <div className="flex-1 flex flex-col items-center px-2 relative">
               <div className="w-full flex items-center gap-1 mb-1">
                 <div className="h-[1px] rounded-full bg-white/30 flex-1"></div>
                 <Flight sx={{ color: 'white', fontSize: 16, transform: 'rotate(90deg)' }} />
                 <div className="h-[1px] rounded-full bg-white/30 flex-1"></div>
               </div>
            </div>

            <div className="text-center flex-1">
              <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: '-0.02em', fontSize: '1.5rem' }}>{destination?.iata_code}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, fontSize: '0.65rem', display: 'block', mt: -0.5 }} className="truncate max-w-[80px] mx-auto">{destination?.city}</Typography>
            </div>
          </div>
        </div>

        {/* Bottom: Date & Tags */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarMonth sx={{ fontSize: 16, opacity: 0.8 }} />
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.75rem' }}>
                {post.travel_date_confirmed 
                  ? dayjs(post.travel_date).format('MMM D, YYYY') 
                  : `${dayjs(post.travel_month_from).format('MMM')} - ${dayjs(post.travel_month_to).format('MMM YYYY')}`}
              </Typography>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
              <Flight sx={{ fontSize: 12, transform: 'rotate(45deg)' }} />
            </div>
          </div>

          {/* Tags Restored */}
          <div className="flex flex-wrap gap-1">
            {(post.languages || []).slice(0, 3).map((lang) => (
              <div key={lang} className="px-2 py-0.5 bg-white/10 rounded-md border border-white/10 backdrop-blur-sm">
                <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700 }}>
                  {lang}
                </Typography>
              </div>
            ))}
            {(isVolunteer ? post.travelling_as : post.traveler_relation) && (
              <div className="px-2 py-0.5 bg-white/20 rounded-md border border-white/20 backdrop-blur-sm">
                <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 800 }}>
                  {isVolunteer ? post.travelling_as : post.traveler_relation}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelCompanionHomeCard;
