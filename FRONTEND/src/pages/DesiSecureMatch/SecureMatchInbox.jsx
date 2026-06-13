import React, { useState, useEffect } from 'react';
import { FiInbox, FiCheck, FiX, FiLock, FiUnlock, FiUser, FiInfo, FiMessageSquare } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import DisplayPath from '../../components/DisplayPath';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function SecureMatchInbox() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterests();
  }, []);

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
    } catch (err) {
      toast.error('Failed to load interests');
    } finally {
      setLoading(false);
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
      fetchInterests(); // Refresh the list
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

  const paths = [
    { text: 'Home', eP: '/' },
    { text: 'SecureMatch', eP: '/dating' },
    { text: 'Inbox', eP: '#' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4">
        <DisplayPath paths={paths} color="gray-500" additionalStyles="mb-6 -mt-6 hover:text-indigo-600 transition" />
        <div className="flex items-center gap-3 mb-6">
          <FiInbox className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">SecureMatch Inbox</h1>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl mb-10">
          <h2 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <FiInfo className="text-indigo-600" /> How SecureMatch Works
          </h2>
          <div className="text-indigo-800 text-sm space-y-2">
            <p><strong>Step 1:</strong> Accepting Step 1 unlocks basic personal details (like Name, Family background, and Contact info) so you can get to know each other better. Photos remain locked.</p>
            <p><strong>Step 2:</strong> Accepting Step 2 unlocks your Primary Profile Picture, indicating a mutual level of trust. After Step 2, you can also manually choose to share your private Album.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : interests.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <FiInbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Interests Yet</h3>
            <p className="text-gray-500 mb-6">When you send or receive interests, they will appear here.</p>
            <button 
              onClick={() => navigate('/dating/search')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              Browse Profiles
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {interests.map(interest => {
              const isSentTab = interest.type === 'sent';
              const profile = isSentTab ? interest.receiver?.secure_match_profile : interest.sender?.secure_match_profile;
              if (!profile) return null;

              return (
                <div key={interest.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start">
                  
                  {/* Avatar / Placeholder */}
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-indigo-100 overflow-hidden">
                    {interest.status === 'accepted_step2' && profile.photos && profile.photos.length > 0 ? (
                      <img 
                        src={profile.photos[0].photo_url.startsWith('http') ? profile.photos[0].photo_url : `${api.defaults.baseURL}${profile.photos[0].photo_url}`}
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-10 h-10 text-indigo-300" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {interest.status === 'accepted_step1' || interest.status === 'accepted_step2' 
                            ? profile.display_name || 'Anonymous Profile' 
                            : 'Anonymous Profile'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {profile.age ? `${profile.age} yrs` : 'Age hidden'} • {profile.gender}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        interest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        interest.status === 'accepted_step1' ? 'bg-blue-100 text-blue-800' :
                        interest.status === 'accepted_step2' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {interest.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>

                    {isSentTab && (
                      <div className="text-xs text-blue-600 font-bold mb-2 uppercase tracking-wide">
                        Sent Interest
                      </div>
                    )}

                    <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                      <p><span className="font-semibold">Profession:</span> {profile.profession || 'Not specified'}</p>
                      <p><span className="font-semibold">Community:</span> {profile.community || 'Not specified'}</p>
                      <p><span className="font-semibold">Location:</span> {profile.city ? `${profile.city}, ${profile.country}` : 'Hidden'}</p>
                    </div>

                    {/* Action Buttons based on status */}
                    {interest.status === 'pending' && (
                      <div className="flex flex-wrap gap-3">
                        {!isSentTab ? (
                          <>
                            <button 
                              onClick={() => handleAction(interest.id, 'accept_step1')}
                              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition"
                            >
                              <FiUnlock /> Accept Step 1 (Unlock Bio)
                            </button>
                            <button 
                              onClick={() => handleAction(interest.id, 'decline')}
                              className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition"
                            >
                              <FiX /> Decline
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 italic flex items-center mt-2 w-full">Waiting for their response...</span>
                        )}
                      </div>
                    )}

                    {interest.status === 'accepted_step1' && (
                      <div className="flex flex-wrap gap-3">
                        {!isSentTab && (
                          <button 
                            onClick={() => handleAction(interest.id, 'accept_step2')}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 transition"
                          >
                            <FiUnlock /> Accept Step 2 (Unlock Photos)
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/dating/profile/${profile.id}`)}
                          className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition"
                        >
                          <FiUser /> View Profile
                        </button>
                        <p className="text-sm text-gray-500 flex items-center mt-2 w-full">
                          <FiCheck className="text-green-500 mr-1" /> {isSentTab ? "They accepted Step 1. You can now view their personal details." : "You have unlocked your personal details."}
                        </p>
                      </div>
                    )}

                    {interest.status === 'accepted_step2' && (
                      <div className="flex flex-col gap-3">
                        <div className="bg-green-50 text-green-800 p-3 rounded-lg flex items-center gap-2 text-sm font-medium">
                          <FiCheck className="w-5 h-5" />
                          Fully connected! You both have access to profile photos and details.
                        </div>
                        <div className="flex flex-wrap gap-3 items-center">
                          <button 
                            onClick={() => navigate(`/dating/profile/${profile.id}`)}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition"
                          >
                            <FiUser /> View Profile
                          </button>

                          <button 
                            onClick={() => {
                              const info = {
                                chatPartnerId: profile.user_id,
                                chatPartnerName: profile.display_name || 'Anonymous Profile',
                              };
                              navigate(
                                `/inbox?adType=SecureMatch&adId=${profile.id}&chatPartnerInfo=${encodeURIComponent(JSON.stringify(info))}`
                              );
                            }}
                            className="bg-blue-100 text-blue-700 px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-200 transition"
                          >
                            <FiMessageSquare /> Message
                          </button>

                          <button 
                            onClick={() => handleAlbumAction(interest.id, 'toggle')}
                            className={`${(isSentTab ? interest.sender_album_unlocked : interest.receiver_album_unlocked) ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'} px-5 py-2 rounded-lg font-bold flex items-center gap-2 transition`}
                          >
                            {(isSentTab ? interest.sender_album_unlocked : interest.receiver_album_unlocked) ? <><FiUnlock /> Revoke My Album from {profile.display_name || 'Anonymous Profile'}</> : <><FiLock /> Share My Album to {profile.display_name || 'Anonymous Profile'}</>}
                          </button>

                          {/* Show if they requested my album */}
                          {!(isSentTab ? interest.sender_album_unlocked : interest.receiver_album_unlocked) && Boolean(isSentTab ? interest.receiver_requested_album : interest.sender_requested_album) && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-2 rounded-lg border border-yellow-200 animate-pulse">
                              They requested your album!
                            </span>
                          )}

                          {profile.photos && profile.photos.filter(p => !p.is_primary).length > 0 && !(isSentTab ? interest.receiver_album_unlocked : interest.sender_album_unlocked) && !Boolean(isSentTab ? interest.sender_requested_album : interest.receiver_requested_album) && (
                            <button 
                              onClick={() => handleAlbumAction(interest.id, 'request')}
                              className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition"
                            >
                              Request Their Album ({profile.photos.filter(p => !p.is_primary).length})
                            </button>
                          )}
                          {!(isSentTab ? interest.receiver_album_unlocked : interest.sender_album_unlocked) && Boolean(isSentTab ? interest.sender_requested_album : interest.receiver_requested_album) && (
                            <span className="text-sm text-gray-500 italic">Album requested</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {interest.status === 'declined' && (
                      <div className="text-red-500 text-sm font-medium mt-2">
                        {isSentTab ? 'They declined this interest.' : 'You declined this interest.'}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
