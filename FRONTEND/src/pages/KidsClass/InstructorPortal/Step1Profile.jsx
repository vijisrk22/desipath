import React, { useState } from 'react';
import { getFullImageUrl } from '../../../utils/imageHelper';
import ProfilePhotoCropModal from '../../../components/ProfilePhotoCropModal';
import api from '../../../utils/api';

export default function Step1Profile({ data, update, instructorId, setInstructorId, errors = {} }) {
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [localBlobUrl, setLocalBlobUrl] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setIsCropOpen(true);
        // Reset the input so the same file can be re-selected if needed
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async (blob) => {
    // 1. Visually update the UI instantly
    const objectUrl = URL.createObjectURL(blob);
    setLocalBlobUrl(objectUrl);
    setImageError(false); // Reset error state on new upload
    update({ photoUrl: objectUrl });
    setIsCropOpen(false);
    
    // 2. Upload to API secretly in background
    const formData = new FormData();
    formData.append('photo', blob, 'cropped_profile.jpg');
    formData.append('instructor_id', instructorId || 'new');
    formData.append('is_cropped', 1);

    try {
      const result = await api.post('/api/instructors/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (result.data.success) {
        update({ photoUrl: result.data.url }); // Update with real URL for DB persistence
        if(result.data.instructor_id) setInstructorId(result.data.instructor_id); 
      }
    } catch (err) {
      console.error("Failed to upload photo", err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Instructor Profile</h2>
        <p className="text-gray-500">Provide details about yourself or your institution.</p>
      </div>

      {/* Account Type Toggle */}
      <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl w-max">
        <button 
          onClick={() => update({ accountType: 'individual' })}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${data.accountType === 'individual' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          Individual
        </button>
        <button 
          onClick={() => update({ accountType: 'institution' })}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${data.accountType === 'institution' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          Institution
        </button>
      </div>

      {/* Photo Uploader */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
            {(localBlobUrl || data.photoUrl) && !imageError ? (
              <img 
                src={localBlobUrl || getFullImageUrl(data.photoUrl)} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-4xl">📸</span>
            )}
          </div>
          <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 cursor-pointer font-semibold transition-opacity">
            {data.photoUrl ? 'Change' : 'Upload'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          </label>
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-lg">
            {data.accountType === 'individual' ? 'Instructor Photo' : 'Institution Logo'}
          </h4>
          <p className="text-sm text-gray-500">This will appear on your class listing. Use a clear, professional photo.</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">
            {data.accountType === 'individual' ? 'Full Name' : 'Institution Name'} <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            placeholder={data.accountType === 'individual' ? "John Doe" : "Global Arts Academy"}
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
            className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Experience (Years) <span className="text-red-500">*</span></label>
          <input 
            type="number" 
            placeholder="5"
            value={data.yearsExperience}
            onChange={(e) => update({ yearsExperience: e.target.value })}
            className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.yearsExperience ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.yearsExperience && <p className="text-xs text-red-500 font-medium">{errors.yearsExperience}</p>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
          <input 
            type="email" 
            placeholder="john@example.com"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="+91 ..."
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value })}
            className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="font-semibold text-gray-700">Bio / About <span className="text-red-500">*</span></label>
          <textarea 
            rows="4"
            placeholder="Tell parents about your teaching style and background..."
            value={data.bio}
            onChange={(e) => update({ bio: e.target.value })}
            className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.bio ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          ></textarea>
          {errors.bio && <p className="text-xs text-red-500 font-medium">{errors.bio}</p>}
        </div>

        {/* Profile Slug URL */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="font-semibold text-gray-700">Profile Slug URL <span className="text-red-500">*</span></label>
          <div className="flex items-stretch shadow-sm">
            <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl px-4 flex items-center text-gray-500 text-sm font-medium whitespace-nowrap">
              desipath.com/instructor/
            </div>
            <input 
              type="text" 
              maxLength={30}
              placeholder="your-name-123"
              value={data.slug || ''}
              onChange={(e) => {
                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                update({ slug: val });
              }}
              className={`flex-grow p-3 rounded-r-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.slug ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Max 30 characters. Letters, numbers and hyphens only.</p>
            {data.slug && <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{data.slug.length}/30</p>}
          </div>
          {errors.slug && <p className="text-xs text-red-500 font-medium">{errors.slug}</p>}
        </div>
      </div>

      {/* Render Crop Modal if image selected */}
      <ProfilePhotoCropModal 
        isOpen={isCropOpen} 
        imageSrc={previewImage} 
        onCancel={() => setIsCropOpen(false)}
        onCropSave={handleCropSave}
      />
    </div>
  );
}
