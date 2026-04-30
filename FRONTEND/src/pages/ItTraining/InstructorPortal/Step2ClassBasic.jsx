import React, { useState, useEffect, useRef } from 'react';
import api from '../../../utils/api';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional / Certification'];
const FORMATS = ['Online (Live)', 'Offline (In-Person)', 'Self-Paced / Hybrid', 'Corporate Training'];

export default function Step2ClassBasic({ data, update }) {
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  
  // Searchable Subcategory State
  const [subSearch, setSubSearch] = useState(data.subcategory || '');
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCats = async () => {
      setLoadingCats(true);
      try {
        const res = await api.get('/api/marketplace/categories?module=it_training');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch IT categories", err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSubDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync subSearch when data.subcategory changes externally (e.g. hydration)
  useEffect(() => {
    if (data.subcategory) {
      setSubSearch(data.subcategory);
    }
  }, [data.subcategory]);

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

  const selectedCat = categories.find(c => c.name === data.category);
  const subcategories = selectedCat?.subcategories || [];
  
  const filteredSubs = subcategories.filter(sub => 
    sub.name.toLowerCase().includes(subSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Program Details</h2>
        <p className="text-gray-500">Provide the basic information about your IT training program.</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Program Title <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="e.g., Full Stack Web Development with React and Node.js"
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
                update({ category: e.target.value, subcategory: '' });
                setSubSearch('');
              }}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={loadingCats}
            >
              <option value="">{loadingCats ? 'Loading...' : 'Select a Tech Category'}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="font-semibold text-gray-700">Subcategory / Skill <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type="text"
                placeholder={data.category ? "Search specialization..." : "Select category first"}
                value={subSearch}
                onChange={(e) => {
                  setSubSearch(e.target.value);
                  setIsSubDropdownOpen(true);
                }}
                onFocus={() => data.category && setIsSubDropdownOpen(true)}
                disabled={!data.category}
                className="w-full p-3 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                🔍
              </div>

              {isSubDropdownOpen && data.category && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden animate-slide-down">
                  {filteredSubs.length > 0 ? filteredSubs.map(sub => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        update({ subcategory: sub.name });
                        setSubSearch(sub.name);
                        setIsSubDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-0 font-medium"
                    >
                      {sub.name}
                    </button>
                  )) : (
                    <div className="p-4 text-center text-gray-400 italic">No matches found.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Level and Format Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Target Level</label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map(level => {
                const isSelected = (data.level || []).includes(level);
                return (
                  <button 
                    key={level}
                    type="button"
                    onClick={() => toggleArrayItem('level', level)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {level}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Training Format</label>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map(fmt => {
                const isSelected = (data.format || []).includes(fmt);
                return (
                  <button 
                    key={fmt}
                    type="button"
                    onClick={() => toggleArrayItem('format', fmt)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
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
          <label className="font-semibold text-gray-700">Program Summary</label>
          <p className="text-xs text-gray-500">Briefly explain what makes your training unique (shown in search results).</p>
          <textarea 
            rows="2"
            value={data.shortDescription || ''}
            onChange={(e) => update({ shortDescription: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Become a job-ready DevOps engineer in 12 weeks with real-world projects on AWS and Azure..."
          ></textarea>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Search Keywords (Skills/Tools)</label>
          <p className="text-xs text-gray-500">Press ENTER to add tags (e.g., Docker, Kubernetes, React, Python)</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {(data.tags || []).map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg flex items-center gap-2 border border-gray-200">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500 font-bold">×</button>
              </span>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Add tools, languages, or skills..."
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={addTag}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

      </div>
    </div>
  );
}
