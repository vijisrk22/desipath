import React, { useState, useEffect } from 'react';
import { FiSearch, FiUserPlus, FiInbox, FiActivity, FiMic, FiImage, FiGlobe, FiVideo, FiUsers, FiArrowRight, FiUser, FiCheck, FiX, FiUnlock, FiLock, FiMessageSquare } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import api from '../../utils/api';

export default function SecureMatchDashboard() {
  const [hasProfile, setHasProfile] = useState(false);
  const [interestCount, setInterestCount] = useState(0);
  const [interests, setInterests] = useState([]);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [hiddenAvatars, setHiddenAvatars] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const res = await api.get('/api/sm/my-profile');
        if (res.data && res.data.id) {
          setHasProfile(true);
          fetchInterests();
        } else {
          setLoadingInterests(false);
        }
      } catch (err) {
        setLoadingInterests(false);
      }
    } else {
      setLoadingInterests(false);
    }
  };

  const fetchInterests = async () => {
    try {
      const [recRes, sentRes] = await Promise.all([
        api.get('/api/sm/interests/received'),
        api.get('/api/sm/interests/sent')
      ]);
      const combined = [
        ...recRes.data.map(i => ({ ...i, type: 'received' })),
        ...sentRes.data.map(i => ({ ...i, type: 'sent' }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setInterests(combined);
      setInterestCount(recRes.data.length); // Just to keep the bubble if needed
    } catch (err) {
      console.error('Failed to load interests', err);
    } finally {
      setLoadingInterests(false);
    }
  };

  const handleAction = async (interestId, action) => {
    try {
      if (action === 'accept_step1') {
        await api.put(`/api/sm/interests/${interestId}/accept-step1`);
        toast.success('Step 1 Accepted! Personal details unlocked.');
      } else if (action === 'accept_step2') {
        await api.put(`/api/sm/interests/${interestId}/accept-step2`);
        toast.success('Step 2 Accepted! Photos unlocked.');
      } else if (action === 'decline') {
        await api.put(`/api/sm/interests/${interestId}/decline`);
        toast.info('Interest declined.');
      }
      fetchInterests();
    } catch (err) {
      toast.error('Failed to process action');
    }
  };

  const handleAlbumAction = async (interestId, action) => {
    try {
      if (action === 'request') {
        await api.post(`/api/sm/interests/${interestId}/request-album`);
        toast.success('Album access requested!');
      } else if (action === 'toggle') {
        const res = await api.post(`/api/sm/interests/${interestId}/toggle-album`);
        toast.success(res.data.message);
      }
      fetchInterests();
    } catch (err) {
      toast.error('Failed to process album action');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Dashboard</h1>
        
        {/* ACTION BUTTONS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link to="/dating/search" className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center gap-2 group">
            <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition">
              <FiSearch className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Search Profiles</h2>
            <p className="text-purple-100 text-xs">Find compatible matches globally</p>
          </Link>
          
          <Link to="/dating/post" className="bg-white border-2 border-indigo-100 text-indigo-900 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center gap-2 group">
            <div className="bg-indigo-50 p-3 rounded-full group-hover:bg-indigo-100 transition">
              <FiUserPlus className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold">{hasProfile ? 'View / Edit Profile' : 'Add Profile'}</h2>
            <p className="text-gray-500 text-xs">Manage your anonymous identity</p>
          </Link>
          
          <Link to="/dating/inbox" className="bg-white border-2 border-purple-100 text-purple-900 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-300 hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center gap-2 group relative overflow-hidden">
            <div className="bg-purple-50 p-3 rounded-full group-hover:bg-purple-100 transition">
              <FiInbox className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold">View Interests</h2>
            <p className="text-gray-500 text-xs">Manage your connections</p>
            {interestCount > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-sm animate-pulse">
                {interestCount}
              </div>
            )}
          </Link>
        </div>

        {/* RECENT INTERESTS */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <FiInbox className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-extrabold text-gray-900">Your Connections</h2>
          </div>

          {loadingInterests ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : interests.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
              <FiInbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Connections Yet</h3>
              <p className="text-gray-500 mb-6">When you send or receive interests, they will appear here.</p>
              <Link 
                to="/dating/search"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                Browse Profiles
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {interests.map(interest => {
                const isSentTab = interest.type === 'sent';
                const profile = isSentTab ? interest.receiver?.secure_match_profile : interest.sender?.secure_match_profile;
                if (!profile) return null;

                return (
                  <div key={interest.id} className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-gray-100 p-5 flex flex-col md:flex-row gap-5 items-start transition-all group">
                    
                    {/* Avatar Container */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className={`w-28 h-28 bg-indigo-50 rounded-full flex items-center justify-center overflow-hidden border-4 ${interest.status === 'accepted_step2' ? 'border-green-100 ring-4 ring-green-50' : 'border-indigo-50'}`}>
                        {interest.status === 'accepted_step2' && profile.photos && profile.photos.length > 0 ? (
                          <img 
                            src={profile.photos[0].photo_url.startsWith('http') ? profile.photos[0].photo_url : `${api.defaults.baseURL}${profile.photos[0].photo_url}`}
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="w-12 h-12 text-indigo-200" />
                        )}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 w-full">
                      {/* Header Row */}
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                              {interest.status === 'accepted_step1' || interest.status === 'accepted_step2' 
                                ? profile.display_name || 'Anonymous Profile' 
                                : 'Anonymous Profile'}
                            </h3>
                            <div className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                              interest.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              interest.status === 'accepted_step1' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              interest.status === 'accepted_step2' ? 'bg-green-100 text-green-800 border border-green-200' :
                              'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {interest.status.replace('_', ' ')}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 font-medium">
                            {profile.age ? `${profile.age} yrs` : 'Age hidden'} • {profile.gender}
                          </p>
                        </div>
                        {isSentTab && (
                          <div className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 uppercase tracking-wide">
                            Sent Interest
                          </div>
                        )}
                      </div>

                      {/* Details Row (Instead of gray box, using flex tags) */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-gray-50 text-gray-700 text-sm px-3 py-1.5 rounded-lg font-medium border border-gray-100">
                          <span className="text-gray-400 mr-2">💼</span>{profile.profession || 'Profession hidden'}
                        </span>
                        <span className="bg-gray-50 text-gray-700 text-sm px-3 py-1.5 rounded-lg font-medium border border-gray-100">
                          <span className="text-gray-400 mr-2">🏛️</span>{profile.community || 'Community hidden'}
                        </span>
                        <span className="bg-gray-50 text-gray-700 text-sm px-3 py-1.5 rounded-lg font-medium border border-gray-100">
                          <span className="text-gray-400 mr-2">📍</span>{profile.city ? `${profile.city}, ${profile.country}` : 'Location hidden'}
                        </span>
                      </div>

                      {/* Connection Status Messages */}
                      {interest.status === 'accepted_step2' && (
                        <div className="bg-green-50/50 border border-green-100 text-green-800 p-4 rounded-xl flex items-center gap-3 text-sm font-medium mb-4">
                          <div className="bg-green-100 p-1.5 rounded-full"><FiCheck className="w-4 h-4 text-green-600" /></div>
                          Fully connected! You both have access to profile photos and details.
                        </div>
                      )}
                      
                      {interest.status === 'accepted_step1' && (
                        <div className="bg-blue-50/50 border border-blue-100 text-blue-800 p-4 rounded-xl flex items-center gap-3 text-sm font-medium mb-4">
                          <div className="bg-blue-100 p-1.5 rounded-full"><FiCheck className="w-4 h-4 text-blue-600" /></div>
                          {isSentTab ? "They accepted Step 1. You can now view their bio." : "You have unlocked your bio details for them."}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 border-t border-gray-50 pt-4">
                        
                        {interest.status === 'pending' && (
                          <>
                            {!isSentTab ? (
                              <>
                                <button onClick={() => handleAction(interest.id, 'accept_step1')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 hover:shadow-lg transition">
                                  <FiUnlock /> Accept Step 1 (Unlock Bio)
                                </button>
                                <button onClick={() => handleAction(interest.id, 'decline')} className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition">
                                  <FiX /> Decline
                                </button>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500 italic bg-gray-50 px-4 py-2 rounded-xl">Waiting for their response...</span>
                            )}
                          </>
                        )}

                        {interest.status === 'accepted_step1' && (
                          <>
                            {!isSentTab && (
                              <button onClick={() => handleAction(interest.id, 'accept_step2')} className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 hover:shadow-lg transition">
                                <FiUnlock /> Accept Step 2 (Unlock Photos)
                              </button>
                            )}
                            <button onClick={() => navigate(`/dating/profile/${profile.id}`)} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 transition">
                              <FiUser /> View Profile
                            </button>
                          </>
                        )}

                        {interest.status === 'accepted_step2' && (
                          <>
                            <button onClick={() => navigate(`/dating/profile/${profile.id}`)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                              <FiUser /> View Profile
                            </button>
                            <button 
                              onClick={() => {
                                const info = { chatPartnerId: profile.user_id, chatPartnerName: profile.display_name || 'Anonymous Profile' };
                                navigate(`/inbox?adType=SecureMatch&adId=${profile.id}&chatPartnerInfo=${encodeURIComponent(JSON.stringify(info))}`);
                              }}
                              className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 hover:-translate-y-0.5 transition-all"
                            >
                              <FiMessageSquare /> Message
                            </button>

                            <button onClick={() => handleAlbumAction(interest.id, 'toggle')} className={`${(isSentTab ? interest.sender_album_unlocked : interest.receiver_album_unlocked) ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100'} px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:-translate-y-0.5 transition-all`}>
                              {(isSentTab ? interest.sender_album_unlocked : interest.receiver_album_unlocked) ? <><FiLock /> Revoke Album</> : <><FiUnlock /> Share Album</>}
                            </button>

                            <label className="flex items-center cursor-pointer hover:opacity-80 transition border border-gray-100 px-4 py-2 rounded-xl bg-gray-50 shadow-sm">
                              <div className="relative">
                                <input type="checkbox" className="sr-only" checked={!!hiddenAvatars[interest.id]} onChange={() => setHiddenAvatars(prev => ({ ...prev, [interest.id]: !prev[interest.id] }))} />
                                <div className={`block w-8 h-5 rounded-full transition-colors ${hiddenAvatars[interest.id] ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform transform ${hiddenAvatars[interest.id] ? 'translate-x-3' : ''}`}></div>
                              </div>
                              <div className="ml-2 text-sm text-gray-700 font-bold select-none">Hide My Photo</div>
                            </label>

                            {/* Show if they requested my album */}
                            {!(isSentTab ? interest.sender_album_unlocked : interest.receiver_album_unlocked) && Boolean(isSentTab ? interest.receiver_requested_album : interest.sender_requested_album) && (
                              <span className="bg-yellow-50 text-yellow-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-yellow-200 animate-pulse ml-auto">
                                Album Requested!
                              </span>
                            )}

                            {profile.photos && profile.photos.filter(p => !p.is_primary).length > 0 && !(isSentTab ? interest.receiver_album_unlocked : interest.sender_album_unlocked) && !Boolean(isSentTab ? interest.sender_requested_album : interest.receiver_requested_album) && (
                              <button onClick={() => handleAlbumAction(interest.id, 'request')} className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition ml-auto">
                                Request Album ({profile.photos.filter(p => !p.is_primary).length})
                              </button>
                            )}
                            {!(isSentTab ? interest.receiver_album_unlocked : interest.sender_album_unlocked) && Boolean(isSentTab ? interest.sender_requested_album : interest.receiver_requested_album) && (
                              <span className="text-sm text-gray-500 italic ml-auto mt-2 md:mt-0">Request sent</span>
                            )}
                          </>
                        )}
                        
                        {interest.status === 'declined' && (
                          <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold w-full text-center">
                            {isSentTab ? 'They declined this interest.' : 'You declined this interest.'}
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


        {/* FEATURE LIST */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 md:p-12 mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Premium Features Included</h2>
            <p className="text-gray-600">You now have access to exclusive tools to help you find the right match.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "AI Matchmaker", desc: "Curated recommendations", icon: <FiActivity />, color: "bg-pink-100 text-pink-600 border-pink-200" },
              { title: "Voice Intros", desc: "Hear them first", icon: <FiMic />, color: "bg-blue-100 text-blue-600 border-blue-200" },
              { title: "Private Photos", desc: "Full control over album", icon: <FiImage />, color: "bg-purple-100 text-purple-600 border-purple-200" },
              { title: "Visa Filters", desc: "H1B, PR, Citizen, etc.", icon: <FiGlobe />, color: "bg-emerald-100 text-emerald-600 border-emerald-200" },
              { title: "Privacy First", desc: "Hide your personal information including your name until you get trust about the connection", icon: <FiLock />, color: "bg-orange-100 text-orange-600 border-orange-200" },
              { title: "Family Mode", desc: "Parent-assisted matching", icon: <FiUsers />, color: "bg-teal-100 text-teal-600 border-teal-200" }
            ].map((feat, idx) => (
              <div key={idx} className={`rounded-2xl p-4 border flex items-center gap-4 hover:shadow-md transition ${feat.color} bg-opacity-40`}>
                <div className={`p-3 rounded-full bg-white shadow-sm`}>
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{feat.title}</h3>
                  <p className="text-gray-600 text-xs">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer hideOnMobile />
    </div>
  );
}
