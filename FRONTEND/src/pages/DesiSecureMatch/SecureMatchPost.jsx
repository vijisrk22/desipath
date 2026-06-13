import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { FiShield, FiUpload, FiX } from 'react-icons/fi';
import DisplayPath from '../../components/DisplayPath';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function SecureMatchPost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    dob: '',
    gender: '',
    community: '',
    religion: '',
    education: '',
    profession: '',
    company_name: '',
    languages_spoken: [],
    city: '',
    country: '',
    residency_tier: 'PR',
    about_me: '',
    family_details: '',
    contact_phone: '',
    contact_email: '',
    food_preference: 'No Preference',
    linkedin_url: '',
    created_by_relative: 'No',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState(null);
  const [existingProfilePic, setExistingProfilePic] = useState(null);
  const [existingAlbumPhotos, setExistingAlbumPhotos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/sm/my-profile');
        if (res.data && res.data.id) {
          setIsEditing(true);
          setFormData({
            display_name: res.data.display_name || '',
            dob: res.data.dob ? res.data.dob.split('T')[0] : '',
            gender: res.data.gender || '',
            community: res.data.community || '',
            religion: res.data.religion || '',
            education: res.data.education || '',
            profession: res.data.profession || '',
            company_name: res.data.company_name || '',
            languages_spoken: res.data.languages_spoken || [],
            city: res.data.city || '',
            country: res.data.country || '',
            residency_tier: res.data.residency_tier || 'PR',
            about_me: res.data.about_me || '',
            family_details: res.data.family_details || '',
            contact_phone: res.data.contact_phone || '',
            contact_email: res.data.contact_email || '',
            food_preference: res.data.food_preference || 'No Preference',
            linkedin_url: res.data.linkedin_url || '',
            created_by_relative: res.data.created_by_relative ? 'Yes' : 'No',
          });
          
          if (res.data.photos && res.data.photos.length > 0) {
            setExistingProfilePic(res.data.photos.find(p => p.is_primary));
            setExistingAlbumPhotos(res.data.photos.filter(p => !p.is_primary));
          }
        }
      } catch (err) {
        // Profile might not exist yet, ignore
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const indianLanguages = ['Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese', 'Maithili'];

  const toggleLanguage = (lang) => {
    setFormData(prev => {
      const isSelected = prev.languages_spoken.includes(lang);
      if (isSelected) {
        return { ...prev, languages_spoken: prev.languages_spoken.filter(l => l !== lang) };
      } else {
        return { ...prev, languages_spoken: [...prev.languages_spoken, lang] };
      }
    });
  };

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleAlbumChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentFiles = albumPhotos ? Array.from(albumPhotos) : [];
    const total = existingAlbumPhotos.length + currentFiles.length + newFiles.length;
    
    if (total > 5) {
      toast.error('You can only have up to 5 album photos in total.');
      return;
    }
    setAlbumPhotos([...currentFiles, ...newFiles]);
  };

  const handleDeleteExistingPhoto = async (photoId, isPrimary) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await api.delete(`/api/sm/profiles/photos/${photoId}`);
      toast.success('Photo deleted successfully');
      if (isPrimary) {
        setExistingProfilePic(null);
      } else {
        setExistingAlbumPhotos(prev => prev.filter(p => p.id !== photoId));
      }
    } catch (err) {
      toast.error('Failed to delete photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'languages_spoken') {
          formData[key].forEach(lang => data.append('languages_spoken[]', lang));
        } else if (key === 'created_by_relative') {
          data.append('created_by_relative', formData[key] === 'Yes' ? 1 : 0);
        } else {
          data.append(key, formData[key]);
        }
      });
      
      if (profilePic) {
        data.append('profile_pic', profilePic);
      }
      
      if (albumPhotos) {
        Array.from(albumPhotos).forEach(file => data.append('album_photos[]', file));
      }

      await api.post('/api/sm/profiles', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(isEditing ? 'Profile Updated Successfully!' : 'Anonymous Profile Created Successfully!');
      navigate('/dating/success');
    } catch (err) {
      toast.error('Failed to create profile. Please check the inputs.');
    } finally {
      setLoading(false);
    }
  };

  const paths = [
    { text: 'Home', eP: '/' },
    { text: 'SecureMatch', eP: '/dating' },
    { text: isEditing ? 'Edit Profile' : 'Create Profile', eP: '#' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <DisplayPath paths={paths} color="gray-500" additionalStyles="mb-6 -mt-6 hover:text-indigo-600 transition" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-8 border-b pb-6">
            <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full">
              <FiShield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{isEditing ? 'View / Edit Profile' : 'Create Anonymous Profile'}</h1>
              <p className="text-gray-500 mt-1">Your identity is hidden by default. Only shared upon mutual consent.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Alias (Optional)</label>
                <input type="text" name="display_name" value={formData.display_name} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="e.g. Caring Professional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created by Parents/Relatives?</label>
                <select name="created_by_relative" value={formData.created_by_relative} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Residency Status (Verification Required Later)</label>
                <select name="residency_tier" value={formData.residency_tier} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                  <option value="CITIZEN">Citizen (US/Canada/UK)</option>
                  <option value="PR">Permanent Resident (Green Card/PR)</option>
                  <option value="WORK_VISA">Work Visa (H1B/L1)</option>
                  <option value="STUDENT">Student Visa</option>
                  <option value="OTHER">Other / Non-Immigrant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
                <input type="text" name="community" value={formData.community} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="e.g. Punjabi, Telugu, Gujarati" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <input type="text" name="religion" value={formData.religion} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="e.g. Hindu, Sikh, Muslim" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="e.g. Software Engineer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="e.g. Google, Apple" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City/State</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="e.g. San Francisco, CA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Habits Preference</label>
                <select name="food_preference" value={formData.food_preference} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                  <option value="No Preference">No Preference</option>
                  <option value="Prefer Veg">Prefer Veg</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL (Highly recommended for more responses)</label>
                <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="e.g. https://linkedin.com/in/..." />
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">About You</h2>
              <textarea name="about_me" value={formData.about_me} onChange={handleChange} rows="4" className="w-full p-3 border rounded-lg" placeholder="Describe your personality, hobbies, and what you are looking for..." required></textarea>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Indian Languages You Speak</h2>
              <div className="flex flex-wrap gap-2">
                {indianLanguages.map(lang => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                      formData.languages_spoken.includes(lang)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Private Contact & Family Details (Hidden by Default)</h2>
              <p className="text-sm text-gray-500 mb-4">These details are strictly protected and only shared in Step 1 of the mutual unlock process.</p>
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Private Phone Number</label>
                  <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Private Email</label>
                  <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50" required />
                </div>
              </div>
              <textarea name="family_details" value={formData.family_details} onChange={handleChange} rows="3" className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Details about your family background..."></textarea>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Profile & Album Photos (Hidden by Default)</h2>
              <p className="text-sm text-gray-500 mb-4">Your Primary Profile Picture is revealed in Step 2. Your Album (up to 5 photos) is revealed when you manually share it.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition relative overflow-hidden">
                  {existingProfilePic && !profilePic ? (
                    <div className="flex flex-col items-center">
                      <div className="relative inline-block">
                        <img src={existingProfilePic.photo_url.startsWith('http') ? existingProfilePic.photo_url : `${api.defaults.baseURL}${existingProfilePic.photo_url}`} alt="Existing Profile" className="w-24 h-24 object-cover rounded-full mb-2 border-2 border-indigo-200 shadow-sm" />
                        <button type="button" onClick={() => handleDeleteExistingPhoto(existingProfilePic.id, true)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-gray-700 font-medium">Primary Profile Picture</span>
                      <label htmlFor="profile-pic-upload" className="cursor-pointer text-indigo-600 text-sm mt-2 hover:underline">Change Photo</label>
                      <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" id="profile-pic-upload" />
                    </div>
                  ) : (
                    <>
                      <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" id="profile-pic-upload" />
                      <label htmlFor="profile-pic-upload" className="cursor-pointer flex flex-col items-center">
                        {profilePic ? (
                          <img src={URL.createObjectURL(profilePic)} alt="Preview" className="w-24 h-24 object-cover rounded-full mb-2 border-2 border-indigo-200 shadow-sm" />
                        ) : (
                          <FiUpload className="w-8 h-8 text-indigo-500 mb-2" />
                        )}
                        <span className="text-gray-700 font-medium">Primary Profile Picture</span>
                        <span className="text-gray-400 text-sm mt-1">{profilePic ? profilePic.name : 'Select 1 image'}</span>
                      </label>
                    </>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition relative">
                  <div className="flex flex-col items-center">
                    <div className="flex flex-wrap gap-3 justify-center mb-4">
                      {/* Existing Photos */}
                      {existingAlbumPhotos.map((photo) => (
                        <div key={photo.id} className="relative inline-block">
                          <img src={photo.photo_url.startsWith('http') ? photo.photo_url : `${api.defaults.baseURL}${photo.photo_url}`} alt="Album" className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-md" />
                          <button type="button" onClick={() => handleDeleteExistingPhoto(photo.id, false)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Pending Photos */}
                      {albumPhotos && Array.from(albumPhotos).map((file, i) => (
                        <div key={`pending-${i}`} className="relative inline-block opacity-80">
                          <img src={URL.createObjectURL(file)} alt="Pending Album" className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-md" />
                          <button type="button" onClick={() => {
                            const newFiles = Array.from(albumPhotos);
                            newFiles.splice(i, 1);
                            setAlbumPhotos(newFiles.length > 0 ? newFiles : null);
                          }} className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-1 shadow-md hover:bg-gray-600">
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Plus Button */}
                      {(existingAlbumPhotos.length + (albumPhotos ? albumPhotos.length : 0)) < 5 && (
                        <label htmlFor="album-upload" className="w-16 h-16 flex items-center justify-center rounded-xl border-2 border-dashed border-purple-300 text-purple-500 hover:bg-purple-50 cursor-pointer shadow-sm transition">
                          <FiUpload className="w-6 h-6" />
                        </label>
                      )}
                    </div>
                    
                    <span className="text-gray-700 font-medium">Private Album (Max 5)</span>
                    <span className="text-gray-400 text-sm mt-1">
                      {existingAlbumPhotos.length + (albumPhotos ? albumPhotos.length : 0)} / 5 photos selected
                    </span>
                    <input type="file" multiple accept="image/*" onChange={handleAlbumChange} className="hidden" id="album-upload" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg disabled:opacity-70">
                {loading ? 'Saving...' : (isEditing ? 'Update Profile' : 'Save Anonymous Profile')}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
