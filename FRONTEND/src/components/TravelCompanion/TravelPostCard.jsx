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
  Edit,
  VerifiedUser,
  Star,
  LocationOn,
  CheckCircleOutline
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const TravelPostCard = ({ post, type = 'volunteer', isOwner = false }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [showDetails, setShowDetails] = React.useState(false);

  // Mock data for the new premium design features
  const mockRating = (4.5 + Math.random() * 0.5).toFixed(1);
  const mockAssistedCount = Math.floor(Math.random() * 20) + 2;

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
  
  // Format assistance tags
  let helpTags = [];
  const data = isVolunteer ? post.comfortable_helping : post.special_needs;
  if (Array.isArray(data)) helpTags = data;
  else if (typeof data === 'string') {
    try { const parsed = JSON.parse(data); helpTags = Array.isArray(parsed) ? parsed : [data]; }
    catch(e) { helpTags = [data]; }
  }
  else if (typeof data === 'boolean') helpTags = data ? ['General Assistance'] : [];
  else if (data) helpTags = [String(data)];

  const getCityName = (leg) => {
    if (!leg) return 'Unknown';
    if (leg.city) return leg.city;
    const map = {
      'BOM': 'Mumbai',
      'JFK': 'New York USA',
      'HYD': 'Hyderabad',
      'IAD': 'Washington DC',
      'COK': 'Kochi',
      'CCU': 'Kolkata',
      'ORD': 'Chicago',
      'YVR': 'Vancouver',
      'DEL': 'New Delhi',
      'SFO': 'San Francisco',
      'EWR': 'Newark',
      'YYZ': 'Toronto',
      'BLR': 'Bengaluru',
      'MAA': 'Chennai'
    };
    return map[leg.iata_code] || 'Unknown City';
  };

  const DetailsModal = () => (
    <Modal
      open={showDetails}
      onClose={() => setShowDetails(false)}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
    >
      <Paper sx={{ 
        width: '100%', 
        maxWidth: 600, 
        borderRadius: '24px', 
        overflow: 'hidden',
        outline: 'none',
        position: 'relative'
      }}>
        {/* Header */}
        <div className="bg-[#1565D8] p-8 text-white relative">
          <IconButton 
            onClick={() => setShowDetails(false)}
            sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
          >
            <Close />
          </IconButton>
          <div className="flex items-center gap-4 mb-4">
             <Avatar src={post.user?.profile_photo} sx={{ width: 64, height: 64, border: '3px solid rgba(255,255,255,0.3)', bgcolor: 'white', color: '#1565D8', fontWeight: 900 }}>
               {post.user?.name?.[0]}
             </Avatar>
             <div>
               <Typography variant="h5" fontWeight={900}>{post.user?.name}</Typography>
               <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 600 }}>
                 {isVolunteer ? 'Travel Volunteer Offer' : 'Travel Companion Request'}
               </Typography>
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8 font-poppins">
          <section>
            <Typography variant="overline" color="text.secondary" fontWeight={900}>Flight Route</Typography>
            <div className="mt-4 space-y-4">
              {legs.map((leg, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1565D8]">
                      <Flight sx={{ fontSize: 16, transform: leg.leg_type === 'destination' ? 'rotate(180deg)' : 'none' }} />
                    </div>
                    {idx < legs.length - 1 && <div className="w-0.5 h-10 bg-blue-100 my-1"></div>}
                  </div>
                  <div>
                    <Typography variant="subtitle1" fontWeight={800}>{leg.iata_code} — {getCityName(leg)}</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} className="uppercase tracking-widest">
                      {leg.leg_type} {leg.airport_name && `• ${leg.airport_name}`}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

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

          <section>
            <Typography variant="overline" color="text.secondary" fontWeight={900}>
              {isVolunteer ? 'Can Help With' : 'Assistance Needed'}
            </Typography>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {helpTags.map(item => (
                <div key={item} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <CheckCircleOutline sx={{ fontSize: 16, color: '#10B981' }} />
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
                <Typography variant="body2" className="italic text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  "{post.comments}"
                </Typography>
              </section>
            </>
          )}

          <div className="pt-4">
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<Message />}
              onClick={handleMessage}
              disabled={isOwner}
              sx={{ bgcolor: '#1565D8', '&:hover': { bgcolor: '#1152b3' }, py: 2, borderRadius: 'full', fontWeight: 800, textTransform: 'none' }}
            >
              {isOwner ? 'Your Post' : `Message ${post.user?.name?.split(' ')[0]}`}
            </Button>
          </div>
        </div>
      </Paper>
    </Modal>
  );

  const compensation = post.gift_card_offer && post.gift_card_offer !== '0' 
    ? `$${post.gift_card_offer} Reward` 
    : post.gift_card_preference && post.gift_card_preference !== 'free' 
      ? `$${post.gift_card_preference} Compensation` 
      : 'FREE';

  return (
    <div className="bg-white rounded-[24px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col font-poppins h-full">
      
      {/* Top Row: User Profile & Trust */}
      <div className="p-6 pb-4 border-b border-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar 
              src={post.user?.profile_photo} 
              sx={{ width: 56, height: 56, bgcolor: '#f3f4f6', color: '#1565D8', fontWeight: 'bold' }}
            >
              {post.user?.name?.[0]}
            </Avatar>
            <div>
              <h3 className="font-bold text-lg text-[#1F2937] leading-tight">
                {post.user?.name || 'Anonymous'}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <VerifiedUser sx={{ fontSize: 14, color: '#10B981' }} />
                <span className="text-xs font-semibold text-[#10B981]">Verified {isVolunteer ? 'Volunteer' : 'Seeker'}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-gray-500">
                <LocationOn sx={{ fontSize: 14 }} />
                <span className="text-xs">{departure?.city || 'Unknown Location'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Row (Mock Data) */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1 text-[#F59E0B]">
            <Star sx={{ fontSize: 16 }} />
            <span className="text-sm font-bold text-[#1F2937]">{mockRating}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="text-sm text-[#6B7280] font-medium">
            {mockAssistedCount} Travelers Assisted
          </div>
        </div>
      </div>

      {/* Route & Date */}
      <div className="p-6 bg-blue-50/30 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="font-bold text-[#1F2937] text-lg">{getCityName(departure)}</div>
            <div className="text-sm text-[#6B7280]">{departure?.iata_code}</div>
          </div>
          <div className="flex-1 px-2 flex items-center justify-center">
            <div className="flex-1 border-t-2 border-dotted border-[#93C5FD]"></div>
            <Flight sx={{ color: '#1565D8', transform: 'rotate(90deg)', mx: 1, fontSize: 20 }} />
            <div className="flex-1 border-t-2 border-dotted border-[#93C5FD]"></div>
          </div>
          <div className="flex-1 text-right">
            <div className="font-bold text-[#1F2937] text-lg">{getCityName(destination)}</div>
            <div className="text-sm text-[#6B7280]">{destination?.iata_code}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[#1565D8] font-semibold bg-white px-3 py-2 rounded-xl w-fit shadow-sm border border-blue-100">
          <CalendarMonth fontSize="small" />
          <span className="text-sm">
            {post.travel_date_confirmed 
              ? dayjs(post.travel_date).format('MMMM D, YYYY') 
              : `${dayjs(post.travel_month_from).format('MMM')} - ${dayjs(post.travel_month_to).format('MMM YYYY')}`}
          </span>
        </div>
      </div>

      {/* Details & Tags */}
      <div className="p-6 border-t border-gray-50 space-y-4">
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Languages</div>
          <div className="flex flex-wrap gap-2">
            {(post.languages || []).slice(0, 3).map((lang) => (
              <Chip key={lang} label={lang} size="small" sx={{ bgcolor: '#F3F4F6', color: '#4B5563', fontWeight: 600, fontSize: '0.7rem' }} />
            ))}
            {(post.languages || []).length > 3 && (
               <Chip label={`+${post.languages.length - 3}`} size="small" sx={{ bgcolor: '#F3F4F6', color: '#4B5563', fontWeight: 600, fontSize: '0.7rem' }} />
            )}
          </div>
        </div>


        
        <div className="flex items-center justify-between pt-2">
           <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Compensation</div>
           <div className={`font-bold text-sm px-3 py-1 rounded-full ${compensation === 'FREE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
             {compensation}
           </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-green-50/50 border-t border-green-100 grid grid-cols-2 gap-3 mt-auto">
        <Button 
          variant="outlined"
          onClick={() => setShowDetails(true)}
          sx={{ 
            borderColor: '#E5E7EB',
            color: '#4B5563',
            fontWeight: 700, 
            textTransform: 'none', 
            borderRadius: '999px',
            '&:hover': { bgcolor: '#F3F4F6', borderColor: '#D1D5DB' }
          }}
        >
          View Details
        </Button>
        <Button 
          variant="contained"
          onClick={!isOwner ? handleMessage : undefined}
          disabled={isOwner}
          sx={{ 
            bgcolor: '#1565D8', 
            color: 'white', 
            fontWeight: 700, 
            textTransform: 'none', 
            borderRadius: '999px',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1152b3', boxShadow: '0 4px 6px -1px rgba(21, 101, 216, 0.2)' }
          }}
        >
          {isOwner ? 'Your Post' : 'Message'}
        </Button>
      </div>

      <DetailsModal />
    </div>
  );
};

export default TravelPostCard;
