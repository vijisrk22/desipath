import React, { useState, useEffect } from 'react';
import { FiShield, FiHeart, FiLock, FiInfo, FiInbox } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DisplayPath from '../../components/DisplayPath';

export default function SecureMatchSearch() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [sentInterests, setSentInterests] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    checkMyProfile();
  }, []);

  const checkMyProfile = async () => {
    try {
      await api.get('/api/sm/my-profile');
      // If profile exists, fetch feed
      fetchProfiles();
    } catch (err) {
      if (err.response?.status === 404) {
        setNeedsProfile(true);
        setLoading(false);
      } else {
        toast.error('Failed to verify profile status.', { toastId: 'profile-error' });
        setLoading(false);
      }
    }
  };

  const fetchProfiles = async () => {
    try {
      const res = await api.get('/api/sm/profiles');
      setProfiles(res.data.data); // Assuming pagination
    } catch (err) {
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInterest = async (profileId) => {
    try {
      await api.post('/api/sm/interests', { receiver_profile_id: profileId });
      toast.success('Interest sent successfully! Awaiting mutual consent.');
      setSentInterests((prev) => [...prev, profileId]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send interest');
    }
  };

  if (needsProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto py-20 px-4 text-center">
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
            <FiShield className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Create Your Profile First</h2>
            <p className="text-gray-500 mb-8 text-lg">
              To ensure the privacy and security of our community, you must create an anonymous profile before you can browse other members.
            </p>
            <button 
              onClick={() => navigate('/dating/post')}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition"
            >
              Create Anonymous Profile
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const paths = [
    { text: 'Home', eP: '/' },
    { text: 'SecureMatch', eP: '/dating' },
    { text: 'Search', eP: '#' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-12 px-4">
        <DisplayPath paths={paths} color="gray-500" additionalStyles="mb-6 -mt-6 hover:text-indigo-600 transition" />
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <FiShield className="text-indigo-600" /> Secure Match Feed
            </h1>
            <p className="text-gray-500 mt-2">Browse anonymous profiles. Identity is hidden until you both connect.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dating/inbox')}
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-200 transition"
            >
              <FiInbox className="w-5 h-5" /> View Interests
            </button>
            <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <FiLock className="w-4 h-4" /> Photos & Contact Details are locked.
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-500">
                No profiles found.
              </div>
            ) : (
              profiles.map(profile => {
                const isSent = sentInterests.includes(profile.id) || profile.interest_status && profile.interest_status !== 'none';
                return (
                  <div key={profile.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden group ${profile.is_mine ? 'border-2 border-purple-300' : 'border border-gray-100'}`}>
                    {/* Photo Area */}
                    <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                      {profile.photos && profile.photos.length > 0 ? (
                        <img 
                          src={profile.photos[0].photo_url.startsWith('http') ? profile.photos[0].photo_url : `${api.defaults.baseURL}${profile.photos[0].photo_url}`}
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-10 flex flex-col items-center justify-center">
                          <FiLock className="w-10 h-10 text-indigo-400 mb-2" />
                          <span className="text-indigo-800 font-medium bg-white/80 px-3 py-1 rounded-full text-sm shadow-sm">Photo Locked</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {profile.display_name ? profile.display_name : 'Anonymous Profile'}
                            </h3>
                            {profile.is_mine && (
                              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full border border-purple-200">
                                Your Profile
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{profile.age ? `${profile.age} yrs` : 'Age hidden'} • {profile.gender}</p>
                        </div>
                        {profile.residency_tier && profile.residency_tier.toUpperCase() !== 'OTHER' && (
                          <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                            {profile.residency_tier}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="font-semibold w-20">Profession:</span>
                          <span className="flex-1">{profile.profession || 'Not specified'}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="font-semibold w-20">Community:</span>
                          <span className="flex-1">{profile.community || 'Not specified'}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="font-semibold w-20">Location:</span>
                          <span className="flex-1">{profile.city || 'Hidden'}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 line-clamp-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        "{profile.about_me}"
                      </div>

                      {profile.interest_status === 'accepted_step1' || profile.interest_status === 'accepted_step2' ? (
                        <button 
                          onClick={() => navigate(`/dating/profile/${profile.id}`)}
                          className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          <FiInfo /> View Profile
                        </button>
                      ) : profile.is_mine ? (
                        <button 
                          onClick={() => navigate('/dating/post')}
                          className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        >
                          View / Edit my Profile
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSendInterest(profile.id)}
                          disabled={isSent}
                          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                            isSent 
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          <FiHeart className={isSent ? 'fill-current' : ''} /> 
                          {isSent ? 'Interest Sent' : 'Send Interest'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
