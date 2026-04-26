import React, { useState } from 'react';

const CATEGORIES = {
  'Indian Languages': ['Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati', 'Punjabi'],
  'Classical Arts-Dance': ['Bharatanatyam', 'Kathak', 'Bollywood Dance'],
  'Music': ['Carnatic Vocal', 'Hindustani Vocal', 'Veena', 'Keyboard', 'Mridangam', 'Tabla'],
  'Academic Classes': ['Online Chess', 'Online English', 'Maths Class', 'Computer Programming'],
  'Spiritual & Cultural': ['Sloka Chanting', 'Vedic Math', 'Shlokas w/ Meaning'],
  'Mythology Storytelling': ['Ramayana', 'Mahabharata', 'Panchatantra']
};

const LEVELS = ['Beginner', 'Mid-Level', 'Advanced'];
const FORMATS = ['Online', 'Offline', 'Hybrid'];
const AGE_GROUPS = ['Under 5 yrs', '5-8 yrs', '9-12 yrs', '13-17 yrs'];

export default function Step2ClassBasic({ data, update }) {
  const [tagInput, setTagInput] = useState('');

  const toggleArrayItem = (field, value) => {
    const current = data[field] || [];
    if (current.includes(value)) {
      update({ [field]: current.filter(v => v !== value) });
    } else {
      update({ [field]: [...current, value] });
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = data.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        update({ tags: [...currentTags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    update({ tags: (data.tags || []).filter(t => t !== tagToRemove) });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Class Details</h2>
        <p className="text-gray-500">Provide the basic information about your class.</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Class Title <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="e.g., Beginner Piano & Keyboard Mastery"
            value={data.title || ''}
            onChange={(e) => update({ title: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
            <select 
              value={data.category || ''}
              onChange={(e) => {
                update({ category: e.target.value, subcategory: '' }); // Reset subcategory
              }}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select a Category</option>
              {Object.keys(CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Subcategory <span className="text-red-500">*</span></label>
            <select 
              value={data.subcategory || ''}
              onChange={(e) => update({ subcategory: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={!data.category}
            >
              <option value="">Select Subcategory</option>
              {data.category && CATEGORIES[data.category] ? CATEGORIES[data.category].map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              )) : null}
            </select>
          </div>
        </div>

        {/* Level and Format Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Level (Select multiple)</label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map(level => {
                const isSelected = (data.level || []).includes(level);
                return (
                  <button 
                    key={level}
                    onClick={() => toggleArrayItem('level', level)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${isSelected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {level}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Class Format</label>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map(fmt => {
                const isSelected = (data.format || []).includes(fmt);
                return (
                  <button 
                    key={fmt}
                    onClick={() => toggleArrayItem('format', fmt)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${isSelected ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {fmt}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Short Description</label>
          <p className="text-xs text-gray-500">1-2 lines shown on the marketplace listing card.</p>
          <textarea 
            rows="2"
            value={data.shortDescription || ''}
            onChange={(e) => update({ shortDescription: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="A fun, interactive class introducing kids to the world of music..."
          ></textarea>
        </div>

        {/* Tags and Age Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Age Group</label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map(age => {
                const isSelected = (data.ageGroup || []).includes(age);
                return (
                  <button 
                    key={age}
                    onClick={() => toggleArrayItem('ageGroup', age)}
                    className={`px-3 py-1.5 rounded-md border text-sm transition-all ${isSelected ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {age}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Search Tags</label>
            <p className="text-xs text-gray-500">Press ENTER to add tags</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {(data.tags || []).map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-gray-500 hover:text-red-500">×</button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              placeholder="e.g. keyboard, beginner"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
