import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import {
  Search,
  History,
  ShieldMoon,
  FlightTakeoff,
  VolunteerActivism,
  CheckCircle,
  TrendingFlat,
  Star,
  VerifiedUser,
  Security,
  GppGood,
  Language,
  ConnectingAirports
} from '@mui/icons-material';

const TravelCompanionLanding = () => {
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();

  const handleLinkClick = (e, link) => {
    if (!user) {
      e.preventDefault();
      navigate('/login', { state: { from: link } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      {/* SECTION 2: HERO SECTION */}
      <section className="relative pt-4 sm:pt-8 md:pt-16 pb-14 sm:pb-16 md:pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-950">
          {/* Dull tinted overlay to ensure text is crystal clear on mobile and desktop */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85 z-10" />
          <img 
            src="/img/travelCompanion/Desipath_Travelcompanion.png" 
            alt="Friendly volunteers helping travelers at airport" 
            className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[0.92] saturate-[0.75]"
          />
        </div>
        
        <div className="relative z-20 max-w-6xl mx-auto text-center mt-0 md:mt-2">
          <h1 className="text-3xl sm:text-4xl md:text-[56px] font-bold text-white mb-3 md:mb-6 font-dmsans leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Travel Companion Network
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-white max-w-3xl mx-auto font-medium mb-2 md:mb-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            Helping travelers connect with trusted volunteers for a safer, smoother, and more comfortable journey.
          </p>
          <p className="text-xs sm:text-sm md:text-lg text-white/95 max-w-2xl mx-auto mb-6 md:mb-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]">
            Whether you're a senior traveler, student, parent, or first-time flyer, connect with caring volunteers traveling on similar routes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 md:mb-12">
            <Link 
              to="/travel-companion/post-request"
              onClick={(e) => handleLinkClick(e, "/travel-companion/post-request")}
              className="w-full sm:w-auto bg-[#1565D8] hover:bg-[#1152b3] text-white font-bold py-3.5 sm:py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-base sm:text-lg"
            >
              Request Travel Assistance
            </Link>
            <Link 
              to="/travel-companion/post-volunteer"
              onClick={(e) => handleLinkClick(e, "/travel-companion/post-volunteer")}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 border-2 border-[#1565D8] text-[#1565D8] font-bold py-3.5 sm:py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-base sm:text-lg"
            >
              Become a Volunteer
            </Link>
          </div>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-8 text-white font-medium text-xs sm:text-sm md:text-base drop-shadow-md">
            <span className="flex items-center gap-1.5 md:gap-2"><CheckCircle fontSize="small" className="text-green-400" /> Community Verified</span>
            <span className="flex items-center gap-1.5 md:gap-2"><CheckCircle fontSize="small" className="text-green-400" /> Free to Use</span>
            <span className="flex items-center gap-1.5 md:gap-2"><CheckCircle fontSize="small" className="text-green-400" /> Safe Communication</span>
            <span className="flex items-center gap-1.5 md:gap-2"><CheckCircle fontSize="small" className="text-green-400" /> Trusted by Families</span>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="relative z-30 -mt-16 px-4 mb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Travelers Assisted', count: '100+' },
            { label: 'Active Volunteers', count: '150+' },
            { label: 'Routes Covered', count: '250+' },
            { label: 'Positive Feedback', count: '98%' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 text-center shadow-lg border border-gray-100 transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-[#1565D8] mb-2">{stat.count}</div>
              <div className="text-sm font-medium text-[#6B7280]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: QUICK ACTIONS */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/travel-companion/browse-volunteers" className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full hover:-translate-y-1">
            <div className="bg-blue-50 p-4 rounded-2xl w-fit mb-6 text-[#1565D8] group-hover:bg-[#1565D8] group-hover:text-white transition-colors">
              <Search fontSize="large" />
            </div>
            <h3 className="text-[22px] font-bold text-[#1F2937] mb-2">Browse Volunteers</h3>
            <p className="text-[#6B7280] mb-6 flex-grow">Find volunteers available on your travel route.</p>
            <div className="mt-auto flex items-center text-[#1565D8] font-bold">
              Explore <TrendingFlat className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

          <Link to="/travel-companion/browse-requests" className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full hover:-translate-y-1">
            <div className="bg-blue-50 p-4 rounded-2xl w-fit mb-6 text-[#1565D8] group-hover:bg-[#1565D8] group-hover:text-white transition-colors">
              <VolunteerActivism fontSize="large" />
            </div>
            <h3 className="text-[22px] font-bold text-[#1F2937] mb-2">Browse Requests</h3>
            <p className="text-[#6B7280] mb-6 flex-grow">Help travelers who need assistance.</p>
            <div className="mt-auto flex items-center text-[#1565D8] font-bold">
              Explore <TrendingFlat className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

          <Link to="/travel-companion/my-posts" onClick={(e) => handleLinkClick(e, "/travel-companion/my-posts")} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full hover:-translate-y-1">
            <div className="bg-blue-50 p-4 rounded-2xl w-fit mb-6 text-[#1565D8] group-hover:bg-[#1565D8] group-hover:text-white transition-colors">
              <History fontSize="large" />
            </div>
            <h3 className="text-[22px] font-bold text-[#1F2937] mb-2">My Posts</h3>
            <p className="text-[#6B7280] mb-6 flex-grow">Manage your requests and volunteer posts.</p>
            <div className="mt-auto flex items-center text-[#1565D8] font-bold">
              View <TrendingFlat className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

          <Link to="/travel-companion/guidelines" className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full hover:-translate-y-1">
            <div className="bg-blue-50 p-4 rounded-2xl w-fit mb-6 text-[#1565D8] group-hover:bg-[#1565D8] group-hover:text-white transition-colors">
              <ShieldMoon fontSize="large" />
            </div>
            <h3 className="text-[22px] font-bold text-[#1F2937] mb-2">Safety Guidelines</h3>
            <p className="text-[#6B7280] mb-6 flex-grow">Best practices for a safe, verified experience.</p>
            <div className="mt-auto flex items-center text-[#1565D8] font-bold">
              Read <TrendingFlat className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* SECTION 4: STEP-BY-STEP PROCESS */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[36px] font-bold text-[#1F2937] mb-4">How It Works</h2>
            <p className="text-lg text-[#6B7280]">Connecting travelers and volunteers is simple, secure, and straightforward.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Travelers */}
            <div className="bg-gray-50/70 p-8 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-100 text-[#1565D8] p-3 rounded-2xl">
                  <FlightTakeoff fontSize="large" />
                </div>
                <h3 className="text-2xl font-bold text-[#1F2937]">For Travelers</h3>
              </div>
              
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Submit Travel Request', desc: 'Share your flight details, language preference, and assistance needs.' },
                  { step: '2', title: 'Match with Volunteers', desc: 'Browse available volunteers or wait for someone traveling on your flight.' },
                  { step: '3', title: 'Connect & Coordinate', desc: 'Chat safely within the platform to align meeting points at the airport.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#1565D8] text-white flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F2937] text-lg mb-1">{item.title}</h4>
                      <p className="text-[#6B7280]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Volunteers */}
            <div className="bg-gray-50/70 p-8 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-green-100 text-green-700 p-3 rounded-2xl">
                  <VolunteerActivism fontSize="large" />
                </div>
                <h3 className="text-2xl font-bold text-[#1F2937]">For Volunteers</h3>
              </div>
              
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Post Your Flight Details', desc: 'Let the community know your travel dates, airlines, and airports.' },
                  { step: '2', title: 'Find Travelers Needing Help', desc: 'Review open requests from seniors, students, or families on your route.' },
                  { step: '3', title: 'Help & Earn Community Trust', desc: 'Accompany travelers through check-in, layovers, or baggage claim.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F2937] text-lg mb-1">{item.title}</h4>
                      <p className="text-[#6B7280]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: POPULAR ROUTES */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[36px] font-bold text-[#1F2937] mb-4">Popular Travel Companion Routes</h2>
          <p className="text-lg text-[#6B7280]">Connect with companions on our most frequently traveled international routes.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { from: 'Delhi (DEL)', to: 'New York (JFK)', freq: '40+ volunteers active' },
            { from: 'Mumbai (BOM)', to: 'San Francisco (SFO)', freq: '35+ volunteers active' },
            { from: 'Hyderabad (HYD)', to: 'Chicago (ORD)', freq: '25+ volunteers active' },
            { from: 'Bengaluru (BLR)', to: 'Dallas (DFW)', freq: '20+ volunteers active' },
            { from: 'Chennai (MAA)', to: 'Atlanta (ATL)', freq: '18+ volunteers active' },
            { from: 'Ahmedabad (AMD)', to: 'Newark (EWR)', freq: '30+ volunteers active' }
          ].map((route, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-[#1F2937]">{route.from}</span>
                <ConnectingAirports className="text-[#1565D8]" />
                <span className="font-bold text-[#1F2937]">{route.to}</span>
              </div>
              <div className="text-sm text-green-600 font-medium">{route.freq}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: WHO BENEFITS */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[36px] font-bold text-[#1F2937] mb-4">Who Benefits From This Platform?</h2>
            <p className="text-lg text-[#6B7280]">Connecting passengers who could use a helping hand with warm-hearted travelers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Elderly Parents Traveling Alone',
                desc: 'Navigating huge foreign airports, immigration lines, and connecting gates can feel overwhelming. Companions offer reassurance.'
              },
              {
                title: 'First-Time Students & Flyers',
                desc: 'Flying abroad for studies for the first time? Connect with seniors or frequent flyers who know the drill and can guide you.'
              },
              {
                title: 'Parents with Infants or Toddlers',
                desc: 'Handling luggage, strollers, and long transit walks alone with young children is challenging. A friendly companion makes it easy.'
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#1F2937] mb-3">{card.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FEATURED VOLUNTEERS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[36px] font-bold text-[#1F2937] mb-4">Meet Some of Our Caring Volunteers</h2>
          <p className="text-lg text-[#6B7280]">Verified community members ready to assist on upcoming flights.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: 'Rajesh K.', city: 'San Jose, CA', lang: 'Hindi, Telugu, English', assists: '12' },
            { name: 'Sunita M.', city: 'Edison, NJ', lang: 'Hindi, Gujarati, English', assists: '8' },
            { name: 'Amitabh S.', city: 'Chicago, IL', lang: 'Hindi, Punjabi, English', assists: '15' }
          ].map((vol, idx) => (
             <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden">
                   <img src={`https://i.pravatar.cc/150?u=${idx}`} alt={vol.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-[#1F2937] mb-1">{vol.name}</h3>
                <p className="text-[#6B7280] text-sm mb-4">{vol.city}</p>
                <div className="flex items-center gap-2 text-sm text-[#1F2937] font-medium mb-2">
                   <Language fontSize="small" className="text-blue-500"/> {vol.lang}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1F2937] font-medium mb-6">
                   <CheckCircle fontSize="small" className="text-green-500"/> {vol.assists} Successful Assists
                </div>
                <Link to="/travel-companion/browse-volunteers" className="mt-auto text-[#1565D8] font-bold border border-[#1565D8] rounded-full px-6 py-2 hover:bg-blue-50 transition-colors w-full">
                  View Profile
                </Link>
             </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: SAFETY & TRUST */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[36px] font-bold text-[#1F2937] mb-4">Your Safety is Our Priority</h2>
            <p className="text-lg text-[#6B7280]">We've built robust safety features to ensure every connection is secure and reliable.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <VerifiedUser sx={{ fontSize: 48 }} className="text-[#1565D8] mb-4" />
              <h3 className="font-bold text-[#1F2937] text-lg mb-2">Verified Profiles</h3>
              <p className="text-sm text-[#6B7280]">All users pass through community identity verification.</p>
            </div>
            <div>
              <GppGood sx={{ fontSize: 48 }} className="text-[#1565D8] mb-4" />
              <h3 className="font-bold text-[#1F2937] text-lg mb-2">Community Moderation</h3>
              <p className="text-sm text-[#6B7280]">Active moderation to keep the platform safe and friendly.</p>
            </div>
            <div>
              <ShieldMoon sx={{ fontSize: 48 }} className="text-[#1565D8] mb-4" />
              <h3 className="font-bold text-[#1F2937] text-lg mb-2">Secure Messaging</h3>
              <p className="text-sm text-[#6B7280]">Communicate safely through our encrypted in-app chat.</p>
            </div>
            <div>
              <Security sx={{ fontSize: 48 }} className="text-[#1565D8] mb-4" />
              <h3 className="font-bold text-[#1F2937] text-lg mb-2">Privacy Protection</h3>
              <p className="text-sm text-[#6B7280]">Your personal contact details remain private until you choose to share.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: CALL TO ACTION */}
      <section className="max-w-6xl mx-auto px-4 py-20 mb-8">
        <div className="bg-[#1565D8] rounded-[40px] p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/img/pattern.png')] mix-blend-overlay"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-dmsans">Ready to Help Someone Travel with Confidence?</h2>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join our growing community of volunteers and travelers making journeys smoother worldwide.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/travel-companion/post-volunteer"
                onClick={(e) => handleLinkClick(e, "/travel-companion/post-volunteer")}
                className="bg-white text-[#1565D8] font-bold py-4 px-10 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
              >
                Become a Volunteer
              </Link>
              <Link 
                to="/travel-companion/post-request"
                onClick={(e) => handleLinkClick(e, "/travel-companion/post-request")}
                className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-colors shadow-lg"
              >
                Request Assistance
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TravelCompanionLanding;
