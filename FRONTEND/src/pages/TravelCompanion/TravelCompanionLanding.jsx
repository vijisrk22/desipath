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
      <section className="relative pt-20 pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply z-10" />
          <img 
            src="/img/travelCompanion/Desipath_Travelcompanion.png" 
            alt="Friendly volunteers helping travelers at airport" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="relative z-20 max-w-6xl mx-auto text-center mt-8">
          <h1 className="text-4xl md:text-[56px] font-bold text-white mb-6 font-dmsans leading-tight drop-shadow-lg">
            Travel Companion Network
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto font-medium mb-4 drop-shadow-md">
            Helping travelers connect with trusted volunteers for a safer, smoother, and more comfortable journey.
          </p>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-10 drop-shadow">
            Whether you're a senior traveler, student, parent, or first-time flyer, connect with caring volunteers traveling on similar routes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              to="/travel-companion/post-request"
              onClick={(e) => handleLinkClick(e, "/travel-companion/post-request")}
              className="w-full sm:w-auto bg-[#1565D8] hover:bg-[#1152b3] text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
            >
              Request Travel Assistance
            </Link>
            <Link 
              to="/travel-companion/post-volunteer"
              onClick={(e) => handleLinkClick(e, "/travel-companion/post-volunteer")}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 border-2 border-[#1565D8] text-[#1565D8] font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
            >
              Become a Volunteer
            </Link>
          </div>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-white font-medium text-sm md:text-base drop-shadow-md">
            <span className="flex items-center gap-2"><CheckCircle fontSize="small" className="text-green-400" /> Community Verified</span>
            <span className="flex items-center gap-2"><CheckCircle fontSize="small" className="text-green-400" /> Free to Use</span>
            <span className="flex items-center gap-2"><CheckCircle fontSize="small" className="text-green-400" /> Safe Communication</span>
            <span className="flex items-center gap-2"><CheckCircle fontSize="small" className="text-green-400" /> Trusted by Families</span>
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
            <p className="text-[#6B7280] mb-6 flex-grow">Learn how to travel and volunteer safely.</p>
            <div className="mt-auto flex items-center text-[#1565D8] font-bold">
              Read <TrendingFlat className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* SECTION 4: MAIN USER CHOICE */}
      <section className="max-w-6xl mx-auto px-4 mb-24">
        <h2 className="text-[36px] font-bold text-center text-[#1F2937] mb-12">How Can We Help You?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row items-center gap-8 group">
            <div className="bg-blue-50 p-8 rounded-full text-[#1565D8] shrink-0 group-hover:bg-[#1565D8] group-hover:text-white transition-colors duration-500">
              <FlightTakeoff sx={{ fontSize: 64 }} />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h3 className="text-2xl font-bold text-[#1F2937] mb-4">Need Travel Assistance?</h3>
              <div className="text-[#6B7280] mb-6">
                <span className="font-semibold text-gray-800">Perfect for:</span>
                <ul className="mt-2 space-y-1 text-left inline-block md:block">
                  <li className="flex items-center gap-2"><CheckCircle fontSize="small" className="text-green-500"/> Senior citizens</li>
                  <li className="flex items-center gap-2"><CheckCircle fontSize="small" className="text-green-500"/> First-time travelers</li>
                  <li className="flex items-center gap-2"><CheckCircle fontSize="small" className="text-green-500"/> Students</li>
                  <li className="flex items-center gap-2"><CheckCircle fontSize="small" className="text-green-500"/> Parents with children</li>
                </ul>
              </div>
              <Link 
                to="/travel-companion/post-request"
                onClick={(e) => handleLinkClick(e, "/travel-companion/post-request")}
                className="inline-block bg-[#1565D8] hover:bg-[#1152b3] text-white font-bold py-3 px-8 rounded-full transition-colors w-full md:w-auto text-center"
              >
                Request Assistance
              </Link>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row items-center gap-8 group">
            <div className="bg-blue-50 p-8 rounded-full text-[#1565D8] shrink-0 group-hover:bg-[#1565D8] group-hover:text-white transition-colors duration-500">
              <VolunteerActivism sx={{ fontSize: 64 }} />
            </div>
            <div className="flex-grow text-center md:text-left flex flex-col h-full">
              <h3 className="text-2xl font-bold text-[#1F2937] mb-4">Become a Travel Volunteer</h3>
              <p className="text-[#6B7280] mb-8 flex-grow">
                Help fellow travelers navigate airports, flights, and unfamiliar locations. Your guidance can turn a stressful journey into a smooth and pleasant experience for someone in need.
              </p>
              <Link 
                to="/travel-companion/post-volunteer"
                onClick={(e) => handleLinkClick(e, "/travel-companion/post-volunteer")}
                className="inline-block bg-white border-2 border-[#1565D8] hover:bg-gray-50 text-[#1565D8] font-bold py-3 px-8 rounded-full transition-colors w-full md:w-auto text-center mt-auto"
              >
                Volunteer Now
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-[36px] font-bold text-center text-[#1F2937] mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 z-0"></div>
            
            <div className="relative z-10 text-center">
              <div className="bg-white w-24 h-24 mx-auto rounded-full border-4 border-[#1565D8] flex items-center justify-center mb-6 shadow-md text-[#1565D8]">
                <span className="text-3xl">✈️</span>
              </div>
              <h3 className="text-[22px] font-bold text-[#1F2937] mb-3">1. Post a Request</h3>
              <p className="text-[#6B7280]">Share your travel details and assistance needs securely on our platform.</p>
            </div>

            <div className="relative z-10 text-center">
              <div className="bg-white w-24 h-24 mx-auto rounded-full border-4 border-[#1565D8] flex items-center justify-center mb-6 shadow-md text-[#1565D8]">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-[22px] font-bold text-[#1F2937] mb-3">2. Get Matched</h3>
              <p className="text-[#6B7280]">Connect with verified volunteers traveling on the same or nearby route.</p>
            </div>

            <div className="relative z-10 text-center">
              <div className="bg-white w-24 h-24 mx-auto rounded-full border-4 border-[#1565D8] flex items-center justify-center mb-6 shadow-md text-[#1565D8]">
                <span className="text-3xl">🧳</span>
              </div>
              <h3 className="text-[22px] font-bold text-[#1F2937] mb-3">3. Travel with Confidence</h3>
              <p className="text-[#6B7280]">Coordinate safely and enjoy a smoother, stress-free journey together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: POPULAR ROUTES */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-[36px] font-bold text-center text-[#1F2937] mb-12">Popular Travel Routes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            ['Dallas', 'Chennai'],
            ['Seattle', 'Bangalore'],
            ['Toronto', 'Hyderabad'],
            ['New Jersey', 'Mumbai'],
            ['Vancouver', 'Delhi'],
            ['Chicago', 'Kochi']
          ].map((route, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="font-bold text-[#1F2937] text-lg">{route[0]}</div>
              <ConnectingAirports className="text-gray-400 mx-2" />
              <div className="font-bold text-[#1F2937] text-lg">{route[1]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: SUCCESS STORIES */}
      <section className="bg-blue-50 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-[36px] font-bold text-center text-[#1F2937] mb-16">Community Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "My parents traveled from Chennai to Dallas with confidence thanks to a volunteer who assisted them through immigration and baggage claim.",
                author: "Priya K."
              },
              {
                quote: "As a first-time international student flying to Toronto, finding a travel companion on this platform relieved so much anxiety.",
                author: "Rahul S."
              },
              {
                quote: "I frequently fly between Chicago and Kochi and volunteering to help elderly travelers navigate layovers has been incredibly rewarding.",
                author: "Anita M."
              }
            ].map((testimonial, idx) => (
               <div key={idx} className="bg-white p-8 rounded-[32px] shadow-sm relative">
                  <div className="text-[#1565D8] mb-4">
                    <Star /><Star /><Star /><Star /><Star />
                  </div>
                  <p className="text-[#1F2937] font-medium mb-8 text-lg italic">"{testimonial.quote}"</p>
                  <div className="font-bold text-[#6B7280]">- {testimonial.author}</div>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FEATURED VOLUNTEERS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-[36px] font-bold text-center text-[#1F2937] mb-12">Meet Our Featured Volunteers</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
             { name: "Vikram R.", city: "New York, NY", lang: "English, Hindi, Telugu", assists: 12 },
             { name: "Meera P.", city: "San Francisco, CA", lang: "English, Tamil, Malayalam", assists: 8 },
             { name: "Rohan D.", city: "Toronto, ON", lang: "English, Gujarati, Hindi", assists: 15 }
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
