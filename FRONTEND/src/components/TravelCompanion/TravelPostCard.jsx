import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Chip, 
  Divider,
  Button,
  Modal,
  Paper,
  IconButton
} from '@mui/material';
import { useSelector } from 'react-redux';
import { 
  FlightTakeoff, 
  FlightLand, 
  Translate, 
  CalendarMonth,
  CardGiftcard,
  Message,
  ArrowForward,
  SyncAlt,
  Close,
  Flight,
  Person,
  Description,
  Edit
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const TravelPostCard = ({ post, type = 'volunteer', isOwner = false, horizontal = false }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [showDetails, setShowDetails] = React.useState(false);

  const handleMessage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      navigate("/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    if (isOwner) return;

    const chatPartnerInfo = {
      chatPartnerId: post.user?.id,
      chatPartnerName: post.user?.name,
      chatPartnerLocation: post.route_legs?.[0]?.city || "",
    };

    const defaultMsg = "Hello, I am looking for a travel companion, can we discuss ?";

    try {
      navigate(
        `/inbox?adType=travel_companion&adId=${
          post.id
        }&chatPartnerInfo=${encodeURIComponent(
          JSON.stringify(chatPartnerInfo)
        )}&initialMessage=${encodeURIComponent(defaultMsg)}`
      );
    } catch (err) {
      console.log("Chat navigation error:", err);
    }
  };
  const isVolunteer = type === 'volunteer';
  const legs = post.route_legs || [];
  const departure = legs.find(l => l.leg_type === 'departure');
  const destination = legs.find(l => l.leg_type === 'destination');
  const transits = legs.filter(l => l.leg_type === 'transit');

  const DetailsModal = () => (
    <Modal
      open={showDetails}
      onClose={() => setShowDetails(false)}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
    >
      <Paper sx={{ 
        width: '100%', 
        maxWidth: 600, 
        borderRadius: '32px', 
        overflow: 'hidden',
        outline: 'none',
        position: 'relative'
      }}>
        {/* Header */}
        <div className="bg-[#2563eb] p-8 text-white relative">
          <IconButton 
            onClick={() => setShowDetails(false)}
            sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
          >
            <Close />
          </IconButton>
          <div className="flex items-center gap-4 mb-4">
             <Avatar src={post.user?.profile_photo} sx={{ width: 64, height: 64, border: '3px solid rgba(255,255,255,0.3)', bgcolor: 'white', color: '#2563eb', fontWeight: 900 }}>
               {post.user?.name?.[0]}
             </Avatar>
             <div>
               <Typography variant="h5" fontWeight={900}>{post.user?.name}</Typography>
               <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 700 }}>
                 {isVolunteer ? 'Travel Volunteer Offer' : 'Travel Companion Request'}
               </Typography>
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8 font-poppins">
          {/* Route Section */}
          <section>
            <Typography variant="overline" color="text.secondary" fontWeight={900}>Flight Route</Typography>
            <div className="mt-4 space-y-4">
              {legs.map((leg, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#2563eb]">
                      <Flight sx={{ fontSize: 16, transform: leg.leg_type === 'destination' ? 'rotate(180deg)' : 'none' }} />
                    </div>
                    {idx < legs.length - 1 && <div className="w-0.5 h-10 bg-blue-100 my-1"></div>}
                  </div>
                  <div>
                    <Typography variant="subtitle1" fontWeight={800}>{leg.iata_code} — {leg.city}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} className="uppercase tracking-widest">
                      {leg.leg_type} {leg.airport_name && `• ${leg.airport_name}`}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Traveler Info */}
          <div className="grid grid-cols-2 gap-8">
            <section>
              <Typography variant="overline" color="text.secondary" fontWeight={900}>Traveler Info</Typography>
              <div className="flex items-center gap-3 mt-2">
                <Person className="text-blue-400" />
                <div>
                  <Typography variant="body2" fontWeight={800} className="capitalize">
                    {isVolunteer ? post.travelling_as : post.traveler_relation}
                  </Typography>
                  {!isVolunteer && post.traveler_age && (
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      Age: {post.traveler_age}
                    </Typography>
                  )}
                </div>
              </div>
            </section>
            <section>
              <Typography variant="overline" color="text.secondary" fontWeight={900}>Languages</Typography>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(post.languages || []).map(lang => (
                  <Chip key={lang} label={lang} size="small" sx={{ fontWeight: 700, bgcolor: 'blue.50', color: 'blue.700' }} />
                ))}
              </div>
            </section>
          </div>

          <Divider />

          {/* Assistance */}
          <section>
            <Typography variant="overline" color="text.secondary" fontWeight={900}>
              {isVolunteer ? 'Can Help With' : 'Assistance Needed'}
            </Typography>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {(isVolunteer ? post.comfortable_helping : post.special_needs || []).map(item => (
                <div key={item} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <Typography variant="caption" fontWeight={700} color="text.primary">{item}</Typography>
                </div>
              ))}
            </div>
          </section>

          {post.comments && (
            <>
              <Divider />
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Description fontSize="small" className="text-gray-400" />
                  <Typography variant="overline" color="text.secondary" fontWeight={900}>Notes</Typography>
                </div>
                <Typography variant="body2" className="italic text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  "{post.comments}"
                </Typography>
              </section>
            </>
          )}

          {/* Contact Action */}
          <div className="pt-4">
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<Message />}
              onClick={handleMessage}
              disabled={isOwner}
              sx={{ bgcolor: '#2563eb', py: 2, borderRadius: '16px', fontWeight: 800, textTransform: 'none' }}
            >
              {isOwner ? 'Your Post' : `Message ${post.user?.name?.split(' ')[0]}`}
            </Button>
          </div>
        </div>
      </Paper>
    </Modal>
  );

  if (horizontal) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-stretch min-h-[180px]">
        {/* User & Info Section (Left/Side) */}
        <div className={`p-6 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center min-w-[220px] ${isVolunteer ? 'bg-[#0f172a]/60' : 'bg-[#1e1b4b]/60'} relative`}>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <Avatar 
              src={post.user?.profile_photo} 
              sx={{ 
                bgcolor: isVolunteer ? '#3b82f6' : '#6366f1', 
                width: 44, 
                height: 44, 
                fontWeight: 900,
                border: '2px solid rgba(255,255,255,0.1)'
              }}
            >
              {post.user?.name?.[0]}
            </Avatar>
            <div>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'white', lineHeight: 1.2 }}>
                {post.user?.name || 'Anonymous'}
              </Typography>
              <Typography variant="caption" sx={{ color: isVolunteer ? '#93c5fd' : '#c7d2fe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {isVolunteer ? 'Volunteer' : 'Seeker'}
              </Typography>
            </div>
          </div>
          <div className="mt-auto relative z-10">
            <Typography variant="h6" fontWeight={900} sx={{ color: '#fbbf24' }}>
              {post.gift_card_offer && post.gift_card_offer !== '0' ? `$${post.gift_card_offer}` : 
               post.gift_card_preference && post.gift_card_preference !== 'free' ? `$${post.gift_card_preference}` : 'FREE'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'white', opacity: 0.7, fontWeight: 700, fontSize: '0.65rem' }}>
              Amazon Gift Card
            </Typography>
          </div>
          {/* Subtle accent line */}
          <div className={`absolute right-0 top-0 w-1 h-full ${isVolunteer ? 'bg-blue-500/30' : 'bg-indigo-500/30'}`}></div>
        </div>

        {/* Route Section (Middle) */}
        <div className="flex-grow p-6 flex flex-col justify-center">
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <Typography variant="h5" fontWeight={900}>{departure?.iata_code}</Typography>
              <Typography variant="caption" fontWeight={700} color="text.secondary">{departure?.city}</Typography>
            </div>
            
            <div className="flex-1 flex flex-col items-center min-w-[100px]">
               <div className="w-full flex items-center gap-2 mb-1">
                 <div className="h-0.5 rounded-full bg-blue-100 flex-1"></div>
                 <Flight sx={{ color: '#f97316', fontSize: 18, transform: 'rotate(90deg)' }} />
                 <div className="h-0.5 rounded-full bg-blue-100 flex-1"></div>
               </div>
               {transits.length > 0 && (
                 <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 800, fontSize: '0.65rem' }}>
                   {transits.length} STOP{transits.length > 1 ? 'S' : ''}
                 </Typography>
               )}
            </div>

            <div className="text-center">
              <Typography variant="h5" fontWeight={900}>{destination?.iata_code}</Typography>
              <Typography variant="caption" fontWeight={700} color="text.secondary">{destination?.city}</Typography>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-500">
              <CalendarMonth sx={{ fontSize: 16, opacity: 0.6 }} />
              <Typography variant="caption" fontWeight={700}>
                {post.travel_date_confirmed 
                  ? dayjs(post.travel_date).format('MMM D, YYYY') 
                  : `${dayjs(post.travel_month_from).format('MMM')} - ${dayjs(post.travel_month_to).format('MMM YYYY')}`}
              </Typography>
            </div>
            <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto' }} />
            <div className="flex flex-wrap gap-1">
              {(post.languages || []).slice(0, 2).map((lang) => (
                <Chip key={lang} label={lang} size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'white', border: '1px solid #f3f4f6' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Actions Section (Right) */}
        <div className="p-6 border-t md:border-t-0 md:border-l border-gray-100 flex md:flex-col justify-center gap-3 min-w-[160px] bg-gray-50/10">
          <Button 
            variant="contained"
            fullWidth
            onClick={() => setShowDetails(true)}
            endIcon={<ArrowForward sx={{ color: '#1e3a8a' }} />} 
            sx={{ 
              bgcolor: '#eff6ff', 
              '&:hover': { bgcolor: '#dbeafe' }, 
              color: '#1e3a8a !important', 
              fontWeight: 800, 
              textTransform: 'none', 
              borderRadius: '14px', 
              py: 1, 
              '& .MuiButton-endIcon': { color: '#1e3a8a' } 
            }}
          >
            Details
          </Button>
          {isOwner && (
            <Button 
              fullWidth
              startIcon={<Edit />}
              onClick={() => navigate(`/travel-companion/post-${type === 'seeker' ? 'request' : 'volunteer'}`, { state: { editData: post } })}
              sx={{ color: '#2563eb', fontWeight: 800, textTransform: 'none', borderRadius: '14px', py: 1 }}
            >
              Edit
            </Button>
          )}
          <Button 
            fullWidth
            onClick={!isOwner ? handleMessage : undefined}
            sx={{ color: isOwner ? '#ef4444' : '#6b7280', fontWeight: 800, textTransform: 'none', borderRadius: '14px', py: 1 }}
          >
            {isOwner ? 'Remove' : 'Message'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Card Header: User Info & Match Status */}
      <div className={`p-6 pb-5 ${isVolunteer ? 'bg-[#0f172a]/60' : 'bg-[#1e1b4b]/60'} relative`}>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Avatar 
              src={post.user?.profile_photo} 
              sx={{ 
                bgcolor: isVolunteer ? '#3b82f6' : '#6366f1', 
                width: 48, 
                height: 48, 
                fontWeight: 900,
                border: '2px solid rgba(255,255,255,0.1)'
              }}
            >
              {post.user?.name?.[0]}
            </Avatar>
            <div>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'white', lineHeight: 1.2 }}>
                {post.user?.name || 'Anonymous'}
              </Typography>
              <Typography variant="caption" sx={{ color: isVolunteer ? '#93c5fd' : '#c7d2fe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {isVolunteer ? 'Offering Help' : 'Seeking Help'}
              </Typography>
            </div>
          </div>
          <div className="text-right">
             <Typography variant="h6" fontWeight={900} sx={{ color: '#fbbf24' }}>
               {post.gift_card_offer && post.gift_card_offer !== '0' ? `$${post.gift_card_offer}` : 
                post.gift_card_preference && post.gift_card_preference !== 'free' ? `$${post.gift_card_preference}` : 'FREE'}
             </Typography>
             <Typography variant="caption" sx={{ color: 'white', opacity: 0.7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.6rem' }}>
               Amazon Gift Card
             </Typography>
          </div>
        </div>
        {/* Subtle accent line */}
        <div className={`absolute bottom-0 left-0 h-1 w-full ${isVolunteer ? 'bg-blue-500/30' : 'bg-indigo-500/30'}`}></div>
      </div>

      {/* Main Content: Route */}
      <div className="px-6 py-4 bg-gray-50/50 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <Typography variant="h5" fontWeight={900}>{departure?.iata_code}</Typography>
            <Typography variant="caption" fontWeight={700} color="text.secondary">{departure?.city}</Typography>
          </div>
          <div className="flex-1 flex flex-col items-center px-4">
             <div className="w-full flex items-center gap-2 mb-1">
               <div className="h-0.5 rounded-full bg-gray-200 flex-1"></div>
                <Flight sx={{ color: '#f97316', fontSize: 18, transform: 'rotate(90deg)' }} />
               <div className="h-0.5 rounded-full bg-gray-200 flex-1"></div>
             </div>
             {transits.length > 0 && (
               <Typography variant="caption" sx={{ bgcolor: 'blue.50', color: 'blue.600', px: 1, py: 0.2, rounded: '4px', fontWidth: 800 }}>
                 {transits.length} STOP{transits.length > 1 ? 'S' : ''}
               </Typography>
             )}
          </div>
          <div className="flex-1 text-right">
            <Typography variant="h5" fontWeight={900}>{destination?.iata_code}</Typography>
            <Typography variant="caption" fontWeight={700} color="text.secondary">{destination?.city}</Typography>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <CalendarMonth fontSize="small" sx={{ opacity: 0.6 }} />
          <Typography variant="body2" fontWeight={700}>
            {post.travel_date_confirmed 
              ? dayjs(post.travel_date).format('MMM D, YYYY') 
              : `${dayjs(post.travel_month_from).format('MMM')} - ${dayjs(post.travel_month_to).format('MMM YYYY')}`}
          </Typography>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {(post.languages || []).slice(0, 3).map((lang) => (
            <Chip key={lang} label={lang} size="small" sx={{ bgcolor: 'white', border: '1px solid #f3f4f6', fontWeight: 500, fontSize: '0.65rem' }} />
          ))}
          {isVolunteer ? (
             post.travelling_as && <Chip label={post.travelling_as} size="small" sx={{ bgcolor: 'blue.50', color: 'blue.700', fontWeight: 700, border: '1px solid #dbeafe', fontSize: '0.65rem' }} />
          ) : (
            post.traveler_relation && <Chip label={post.traveler_relation} size="small" sx={{ bgcolor: 'blue.50', color: 'blue.700', fontWeight: 700, border: '1px solid #dbeafe', fontSize: '0.65rem' }} />
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Button 
              startIcon={isOwner ? null : <Message />} 
              onClick={!isOwner ? handleMessage : undefined}
              sx={{ color: isOwner ? '#ef4444' : '#1f2937', fontWeight: 800, textTransform: 'none', borderRadius: '12px' }}
            >
              {isOwner ? 'Remove' : 'Message'}
            </Button>
            {isOwner && (
              <Button 
                startIcon={<Edit />}
                onClick={() => navigate(`/travel-companion/post-${type === 'seeker' ? 'request' : 'volunteer'}`, { state: { editData: post } })}
                sx={{ color: '#2563eb', fontWeight: 800, textTransform: 'none', borderRadius: '12px' }}
              >
                Edit
              </Button>
            )}
         </div>
        <Button 
          endIcon={<ArrowForward sx={{ color: '#1e3a8a' }} />} 
          variant="contained"
          onClick={() => setShowDetails(true)}
          sx={{ 
            bgcolor: '#eff6ff', 
            '&:hover': { bgcolor: '#dbeafe' }, 
            color: '#1e3a8a !important', 
            fontWeight: 800, 
            textTransform: 'none', 
            borderRadius: '12px', 
            px: 3, 
            '& .MuiButton-endIcon': { color: '#1e3a8a' },
            boxShadow: 'none',
            border: '1px solid #dbeafe'
          }}
        >
          Details
        </Button>
      </div>
      <DetailsModal />
    </div>
  );
};

export default TravelPostCard;
