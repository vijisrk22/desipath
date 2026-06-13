import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShield, FiLock, FiCheck, FiArrowLeft, FiUser, FiPhone, FiMail, FiUsers } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function SecureMatchProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/api/sm/profiles/${id}`);
      setProfile(res.data);
    } catch (err) {
      toast.error('Failed to load profile details.');
      navigate('/dating/search');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  const isUnlockedStep1 = profile.interest_status === 'accepted_step1' || profile.interest_status === 'accepted_step2' || profile.is_mine;
  const isUnlockedStep2 = profile.interest_status === 'accepted_step2' || profile.is_mine;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4">
        <button 
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-bold flex items-center gap-2 mb-8 hover:text-indigo-800 transition"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Photo Area */}
          <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 relative">
            {isUnlockedStep2 && profile.photos && profile.photos.length > 0 ? (
              <img 
                src={profile.photos[0].photo_url.startsWith('http') ? profile.photos[0].photo_url : `${api.defaults.baseURL}${profile.photos[0].photo_url}`}
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-10 flex flex-col items-center justify-center">
                <FiLock className="w-12 h-12 text-indigo-400 mb-3" />
                <span className="text-indigo-800 font-bold bg-white/90 px-4 py-2 rounded-full shadow-sm">
                  {profile.interest_status === 'accepted_step1' ? 'Photos Unlock at Step 2' : 'Photos are Locked'}
                </span>
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Title Section */}
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-2">
                  {isUnlockedStep1 && profile.display_name ? profile.display_name : 'Anonymous Profile'}
                  {isUnlockedStep1 && <FiCheck className="text-green-500 w-6 h-6 bg-green-50 rounded-full p-1" title="Identity Unlocked" />}
                </h1>
                <p className="text-lg text-gray-500">{profile.age ? `${profile.age} yrs` : 'Age hidden'} • {profile.gender}</p>
              </div>
              {profile.residency_tier && profile.residency_tier.toUpperCase() !== 'OTHER' && (
                <div className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-lg">
                  {profile.residency_tier}
                </div>
              )}
            </div>

            {/* Grid Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUser className="text-indigo-500" /> Basic Details
                </h3>
                <div className="grid grid-cols-3 gap-2 text-gray-600">
                  <span className="font-semibold text-gray-900">Managed By:</span>
                  <span className="col-span-2">{profile.created_by_relative ? 'Parents / Relatives' : 'Self'}</span>

                  <span className="font-semibold text-gray-900">Profession:</span>
                  <span className="col-span-2">{profile.profession || 'Not specified'}</span>
                  
                  <span className="font-semibold text-gray-900">Company:</span>
                  <span className="col-span-2">{profile.company_name || 'Not specified'}</span>
                  
                  <span className="font-semibold text-gray-900">Education:</span>
                  <span className="col-span-2">{profile.education || 'Not specified'}</span>

                  <span className="font-semibold text-gray-900">Languages:</span>
                  <span className="col-span-2">
                    {profile.languages_spoken && profile.languages_spoken.length > 0 
                      ? profile.languages_spoken.join(', ') 
                      : 'Not specified'}
                  </span>

                  <span className="font-semibold text-gray-900">Food Habit:</span>
                  <span className="col-span-2">{profile.food_preference || 'Not specified'}</span>

                  {profile.linkedin_url && (
                    <>
                      <span className="font-semibold text-gray-900">LinkedIn:</span>
                      <span className="col-span-2">
                        <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Profile</a>
                      </span>
                    </>
                  )}
                  
                  <span className="font-semibold text-gray-900">Community:</span>
                  <span className="col-span-2">{profile.community || 'Not specified'}</span>
                  
                  <span className="font-semibold text-gray-900">Religion:</span>
                  <span className="col-span-2">{profile.religion || 'Not specified'}</span>
                  
                  <span className="font-semibold text-gray-900">Location:</span>
                  <span className="col-span-2">{profile.city ? `${profile.city}, ${profile.country}` : 'Hidden'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiLock className={isUnlockedStep1 ? "text-green-500" : "text-gray-400"} /> Private Details
                </h3>
                
                {isUnlockedStep1 ? (
                  <div className="space-y-4 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <div className="flex items-start gap-3 text-indigo-900">
                      <FiUsers className="mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold mb-1">Family Details</p>
                        <p className="text-sm">{profile.family_details || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-indigo-900">
                      <FiPhone className="flex-shrink-0" />
                      <span className="font-semibold">{profile.contact_phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-indigo-900">
                      <FiMail className="flex-shrink-0" />
                      <span className="font-semibold">{profile.contact_email || 'Not provided'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center text-gray-500">
                    <FiLock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Family background and contact details are hidden until Step 1 is mutually accepted.</p>
                  </div>
                )}
              </div>
            </div>

            {/* About Me */}
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl italic">
                "{profile.about_me}"
              </p>
            </div>

            {/* Album Section */}
            <div className="border-t border-gray-100 pt-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiLock className={profile.album_unlocked || profile.is_mine ? "text-green-500" : "text-gray-400"} /> Private Photo Album
              </h3>
              
              {profile.album_unlocked || profile.is_mine ? (
                profile.photos && profile.photos.length > 1 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {profile.photos.filter(p => !p.is_primary).map(photo => (
                      <div key={photo.id} className="aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <img 
                          src={photo.photo_url.startsWith('http') ? photo.photo_url : `${api.defaults.baseURL}${photo.photo_url}`} 
                          alt="Album" 
                          className="w-full h-full object-cover hover:scale-105 transition duration-300" 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic bg-gray-50 p-4 rounded-xl text-center">No album photos uploaded.</p>
                )
              ) : (
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 text-center text-gray-500">
                  <FiLock className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium text-gray-700">Album is locked</p>
                  <p className="text-sm mt-1 mb-4">This user has not shared their private album with you yet.</p>
                  
                  {profile.interest_status === 'accepted_step2' && !Boolean(profile.requested_album) && (
                    <button 
                      onClick={async () => {
                        try {
                          await api.post(`/api/sm/interests/${profile.interest_id}/request-album`);
                          toast.success('Album access requested!');
                          fetchProfile();
                        } catch(err) {
                          toast.error('Failed to request album');
                        }
                      }}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                    >
                      Request Their Album
                    </button>
                  )}
                  {profile.interest_status === 'accepted_step2' && Boolean(profile.requested_album) && (
                    <span className="text-sm text-gray-500 italic bg-gray-200 px-4 py-2 rounded-full">Album requested</span>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
