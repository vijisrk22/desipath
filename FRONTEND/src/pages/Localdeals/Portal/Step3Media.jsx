import React, { useState } from 'react';
import { IoImageOutline, IoCloseCircle } from 'react-icons/io5';

export default function Step3Media({ data, update, onNext, onBack }) {
  const [previews, setPreviews] = useState(data.images || []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (previews.length + files.length > 5) {
      alert("Max 5 images allowed");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPreviews(prev => {
          const newList = [...prev, base64];
          update({ images: newList });
          return newList;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    const newList = previews.filter((_, i) => i !== idx);
    setPreviews(newList);
    update({ images: newList });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Promotional Posters</h2>
        <p className="text-gray-500">Upload up to 5 flyers or photos for your deal. These will appear in a slider.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previews.map((src, idx) => (
            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-gray-100">
              <img src={src} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 text-red-500 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IoCloseCircle size={24} />
              </button>
            </div>
          ))}
          
          {previews.length < 5 && (
            <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all">
              <IoImageOutline size={32} className="text-gray-400 mb-2" />
              <span className="text-xs font-bold text-gray-500">Upload Image</span>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            </label>
          )}
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <p className="text-sm text-blue-700 leading-relaxed">
            <strong>Tip:</strong> Use high-quality portrait or square images. These posters are the first thing users see, so make them eye-catching!
          </p>
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <button 
          type="button"
          onClick={onBack}
          className="px-8 py-4 font-bold text-gray-600 hover:text-gray-900 transition-colors"
        >
          Back
        </button>
        <button 
          onClick={onNext}
          disabled={previews.length === 0}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Ad
        </button>
      </div>
    </div>
  );
}
