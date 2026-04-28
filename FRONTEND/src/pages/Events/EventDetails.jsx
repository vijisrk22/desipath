import DisplayPath from "../../components/DisplayPath";
import { useEffect, useState } from "react";
import { fetchEventById } from "../../store/EventsSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ImageScroller from "../../components/ImageScroller";
import ButtonRight from "../../components/ButtonRight";
import Events from "../../components/Events";
import dayjs from "dayjs";
import { getFullImageUrl } from "../../utils/imageHelper";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import CategoryIcon from '@mui/icons-material/Category';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function EventDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Events", eP: "/services/events" },
    { text: "Find Events", eP: "/services/events/findEvent" },
  ];

  const { eventId } = useParams();
  const dispatch = useDispatch();
  const { loadingDetails, error, eventDetails } = useSelector((state) => state.events);
  const [isInterested, setIsInterested] = useState(false);
  const [openContact, setOpenContact] = useState(false);

  useEffect(() => {
    dispatch(fetchEventById(eventId));
    window.scrollTo(0, 0);
  }, [dispatch, eventId]);

  if (loadingDetails) return <Loader />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-red-500 text-xl font-dmsans">
          Error loading event details: {typeof error === 'string' ? error : 'Event not found'}
        </div>
      </div>
    );
  }

  if (!eventDetails) return null;

  const displayImages = (eventDetails.cover_images && Array.isArray(eventDetails.cover_images) && eventDetails.cover_images.length > 0)
    ? eventDetails.cover_images.map(img => getFullImageUrl(img))
    : ["/img/events/eventDetailsThumbnail.png"];

  return (
    <div className="bg-[#fcfdfe] min-h-screen">
      {/* Hero Section with Blur Backdrop */}
      <div className="relative w-full overflow-hidden pt-0 pb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110"
          style={{ backgroundImage: `url(${displayImages[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fcfdfe]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col pt-1">
          <DisplayPath paths={paths} color="[#667479]" additionalStyles="mb-3 z-10" />
          
          <div className="flex justify-center">
            <div className="w-full max-w-5xl aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/20">
              <ImageScroller images={displayImages} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
                  {eventDetails.event_type}
                </span>
                <span className="flex items-center gap-1 text-gray-500 text-sm font-medium">
                  <LanguageIcon sx={{ fontSize: 18 }} />
                  {(() => {
                    const lang = eventDetails.language;
                    if (!lang) return "";
                    const langArray = Array.isArray(lang) 
                      ? lang 
                      : (typeof lang === 'string' ? lang.split(',').map(s => s.trim()) : []);
                    
                    return langArray
                      .filter(l => l && l.length > 1)
                      .map(l => l.charAt(0).toUpperCase() + l.slice(1))
                      .join(", ");
                  })()}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#007185] font-dmsans leading-tight mb-6">
                {eventDetails.event_name}
              </h1>
            </div>

            {/* Glass Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <CalendarTodayIcon />
                </div>
                <div>
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Date & Time</h3>
                  <p className="text-[#002f34] text-lg font-bold font-dmsans capitalize">
                    {dayjs(eventDetails.from_date).format("dddd, MMM D, YYYY")}
                  </p>
                  <p className="text-gray-600 font-medium font-dmsans">
                    {dayjs(eventDetails.from_date).format("h:mm A")} {eventDetails.timezone || 'PST'}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md">
                <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                  <LocationOnIcon />
                </div>
                <div>
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Location ({eventDetails.country || 'USA'})</h3>
                  <p className="text-[#002f34] text-lg font-bold font-dmsans">
                    {eventDetails.location_city || 'Venue'}, {eventDetails.location_state || ''}
                  </p>
                  <p className="text-gray-600 font-medium font-dmsans truncate max-w-[200px]">
                    {eventDetails.address} {eventDetails.location_zipcode}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Logistics */}
            <div className="flex flex-wrap gap-4 pt-4">
              {eventDetails.duration_hours && (
                <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl flex items-center gap-3 border border-emerald-100">
                  <span className="font-bold text-lg">
                    {(() => {
                      const dur = eventDetails.duration_hours?.toString() || "";
                      return dur.toLowerCase().includes('hour') ? dur : `${dur} Hours`;
                    })()}
                  </span>
                  <span className="text-sm font-medium opacity-80 uppercase tracking-wide">Duration</span>
                </div>
              )}
              {eventDetails.min_age_limit && (
                <div className="bg-purple-50 text-purple-700 px-6 py-3 rounded-2xl flex items-center gap-3 border border-purple-100">
                  <span className="font-bold text-lg">
                    {["13", "18", "21"].includes(eventDetails.min_age_limit)
                      ? `${eventDetails.min_age_limit}+`
                      : (eventDetails.min_age_limit === "0" ? "All Ages" : eventDetails.min_age_limit)}
                  </span>
                  <span className="text-sm font-medium opacity-80 uppercase tracking-wide">Age Limit</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-[#002f34] font-dmsans mb-2">About this event</h2>
              <p className="text-gray-700 leading-relaxed font-dmsans whitespace-pre-wrap">
                {eventDetails.description || 'No detailed description available for this event.'}
              </p>
            </div>

            {/* Terms and Conditions */}
            {eventDetails.rules_regulations && (
              <Accordion 
                elevation={0}
                sx={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "24px !important",
                  border: "1px solid #f3f4f6",
                  '&:before': { display: 'none' },
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#002f34' }} />}
                  sx={{
                    px: 4,
                    py: 1,
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0'
                    }
                  }}
                >
                  <h2 className="text-2xl font-bold text-[#002f34] font-dmsans">Terms & Conditions</h2>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 4, pb: 4, pt: 0 }}>
                  <div 
                    className="text-gray-700 leading-relaxed font-dmsans rich-text-display"
                    dangerouslySetInnerHTML={{ 
                      __html: eventDetails.rules_regulations.replace(/&nbsp;/g, ' ') 
                    }}
                  />
                </AccordionDetails>
              </Accordion>
            )}

            {/* Categories */}
            {eventDetails.event_category && (
              <div className="flex flex-wrap gap-2 pt-2">
                {(Array.isArray(eventDetails.event_category) 
                  ? eventDetails.event_category 
                  : (typeof eventDetails.event_category === 'string' 
                      ? (eventDetails.event_category.startsWith('[') ? JSON.parse(eventDetails.event_category) : [eventDetails.event_category])
                      : [])
                ).map(cat => (
                  <span key={cat} className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-sm font-medium border border-emerald-100 capitalize">
                    {cat.replace('_', ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Tags */}
            {eventDetails.tags && (
              <div className="flex flex-wrap gap-2 pt-4">
                {(Array.isArray(eventDetails.tags) 
                  ? eventDetails.tags 
                  : (typeof eventDetails.tags === 'string' 
                      ? (eventDetails.tags.startsWith('[') ? JSON.parse(eventDetails.tags) : [eventDetails.tags])
                      : [])
                ).map(tag => (
                  <span key={tag} className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-sm font-medium border border-blue-100">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="pt-8 border-t border-gray-100">
              <Events title="More events like this" />
            </div>
          </div>

          {/* Right Column: Sticky CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col items-center gap-8 text-center ring-1 ring-black/[0.02]">
                <div className="w-full">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Ticket Price</p>
                  <div className="text-[#007185] text-5xl font-black font-dmsans">
                    {eventDetails.ticket_price && !isNaN(parseFloat(eventDetails.ticket_price))
                      ? `$${Number(eventDetails.ticket_price).toLocaleString()}`
                      : (eventDetails.ticket_price || "Free")}
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <ButtonRight
                    text={eventDetails.is_sold ? "SOLD" : "Book Tickets Now"}
                    path=""
                    textClass="text-gray-800 text-lg font-bold"
                    paddingClass={`w-full py-5 rounded-2xl ${eventDetails.is_sold ? 'bg-gray-200' : 'bg-[#ffa41c] hover:bg-[#e8931a]'} transition-all transform active:scale-95`}
                    arrowVisible={!eventDetails.is_sold}
                    disabled={eventDetails.is_sold}
                  />
                  <button 
                    onClick={() => setIsInterested(!isInterested)}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all border-2 ${
                      isInterested 
                        ? 'bg-blue-50 border-blue-200 text-blue-600' 
                        : 'bg-white border-gray-100 text-[#002f34] hover:bg-gray-50'
                    }`}
                  >
                    {isInterested ? <CheckCircleOutlineIcon /> : <FavoriteBorderIcon />}
                    {isInterested ? "I'm Interested" : "Mark as Interested"}
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-100 w-full flex justify-center gap-8">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
                      <ShareIcon />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Share</span>
                  </button>
                  <button className="text-gray-400 hover:text-red-500 transition-colors flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-gray-50 rounded-full group-hover:bg-red-50 transition-colors">
                      <FavoriteBorderIcon />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Saved</span>
                  </button>
                </div>
              </div>

              {/* Organizer Card - Light Theme */}
              <div className="bg-white rounded-3xl p-6 border border-[#007185]/10 overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.03)] group transition-all hover:shadow-md">
                <div className="absolute -right-4 -bottom-4 bg-[#007185]/5 w-24 h-24 rounded-full blur-2xl group-hover:bg-[#007185]/10 transition-colors" />
                <h4 className="font-bold mb-3 uppercase tracking-widest text-[10px] text-gray-400">Organizer Information</h4>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[#002f34]">{eventDetails.organizer_name || eventDetails.user_name || 'Desipath Member'}</span>
                  </div>
                  {eventDetails.organizer_contact && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-sm font-medium">📞 {eventDetails.organizer_contact}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => setOpenContact(true)}
                    className="w-full bg-[#007185]/5 hover:bg-[#007185]/10 py-3 rounded-xl text-sm font-bold transition-all text-[#007185] border border-[#007185]/10"
                  >
                    Contact Organizer
                  </button>
                </div>
              </div>

              {/* Contact Modal */}
              {openContact && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <div 
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setOpenContact(false)}
                  />
                  <div className="relative bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center relative">
                      <div className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer p-2" onClick={() => setOpenContact(false)}>
                        <ExpandMoreIcon className="rotate-180" />
                      </div>
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-blue-100">
                        <span className="text-3xl">👤</span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#002f34] font-dmsans">Organizer Contact</h3>
                      <p className="text-gray-500 text-sm mt-1">Get in touch for event inquiries</p>
                    </div>
                    
                    <div className="p-8 space-y-6">
                      <div className="flex flex-col gap-1 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</span>
                        <span className="text-lg font-bold text-[#002f34]">{eventDetails.organizer_name || eventDetails.user_name || 'Desipath Member'}</span>
                      </div>
                      
                      {eventDetails.organizer_contact && (
                        <div className="flex flex-col gap-1 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Phone Number</span>
                          <span className="text-2xl font-black text-[#007185] tracking-tight">{eventDetails.organizer_contact}</span>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <button 
                          onClick={() => setOpenContact(false)}
                          className="w-full py-4 bg-[#007185] hover:bg-[#005a6a] text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                        >
                          Close Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EventDetails;
