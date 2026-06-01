import React, { useState } from 'react';

const MultiTextInput = ({ label, items = [], onChange, placeholder }) => {
  const [val, setVal] = useState('');
  const safeItems = Array.isArray(items) ? items : [];
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (val.trim() && !safeItems.includes(val.trim())) {
      onChange([...safeItems, val.trim()]);
      setVal('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={val} 
          onChange={e => setVal(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd(e)}
          className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button onClick={handleAdd} className="px-4 bg-gray-100 font-bold hover:bg-gray-200 rounded-xl text-gray-700 transition">Add</button>
      </div>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        {safeItems.map((item, idx) => (
          <li key={idx} className="text-gray-600 flex justify-between items-center group">
            {item}
            <button onClick={() => onChange(safeItems.filter((_, i) => i !== idx))} className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 font-bold text-lg">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Step4AboutTabbed({ data, update }) {
  const [activeTab, setActiveTab] = useState('Overview');

  // Helpers to update deeply nested fields cleanly
  const updateOverview = (fields) => update({ overview: { ...(data.overview || {}), ...fields } });
  const updateRequirements = (fields) => update({ requirements: { ...(data.requirements || {}), ...fields } });

  const renderOverview = () => {
    const ov = data.overview || {};
    return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Overview</h3>
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Detailed Description</label>
          <textarea 
            rows="6"
            value={ov.detailedDescription || ''}
            onChange={(e) => updateOverview({ detailedDescription: e.target.value })}
            placeholder="Full depth description of the course..."
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <MultiTextInput label="Who Is This Class For?" items={ov.whoIsItFor} onChange={(val) => updateOverview({ whoIsItFor: val })} placeholder="e.g. Total beginners in music" />
        <MultiTextInput label="What Will Kids Learn?" items={ov.whatWillKidsLearn} onChange={(val) => updateOverview({ whatWillKidsLearn: val })} placeholder="e.g. Read basic sheet music" />
        <MultiTextInput label="Class Highlights" items={ov.highlights} onChange={(val) => updateOverview({ highlights: val })} placeholder="e.g. Theory + Practical included" />
      </div>
    );
  };

  const renderCurriculum = () => {
    const modules = data.curriculum || [];
    
    const addModule = () => {
      update({ curriculum: [...modules, { id: Date.now(), title: '', description: '', duration: '', topics: [] }] });
    };
    
    // Quick module internal update
    const setMod = (idx, fields) => {
      const newMods = [...modules];
      newMods[idx] = { ...newMods[idx], ...fields };
      update({ curriculum: newMods });
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Curriculum Builder</h3>
        {modules.map((mod, idx) => (
          <div key={mod.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-700">Module {idx + 1}</h4>
              <button onClick={() => update({ curriculum: modules.filter((_, i) => i !== idx) })} className="text-red-500 text-sm font-semibold hover:underline">Remove</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Module Title" value={mod.title} onChange={e => setMod(idx, { title: e.target.value })} className="w-full p-2 rounded border border-gray-300" />
              <input type="text" placeholder="Estimated Duration (e.g. 2 weeks)" value={mod.duration} onChange={e => setMod(idx, { duration: e.target.value })} className="w-full p-2 rounded border border-gray-300" />
              <div className="md:col-span-2">
                <textarea rows="2" placeholder="Description of this module" value={mod.description} onChange={e => setMod(idx, { description: e.target.value })} className="w-full p-2 rounded border border-gray-300" />
              </div>
            </div>
          </div>
        ))}
        <button onClick={addModule} className="w-full py-3 border-2 border-dashed border-blue-400 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
          + Add New Module
        </button>
      </div>
    );
  };

  const renderRequirements = () => {
    const req = data.requirements || {};
    return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Requirements & Setup</h3>
        <MultiTextInput label="Prerequisites" items={req.prerequisites} onChange={(val) => updateRequirements({ prerequisites: val })} placeholder="e.g. Basic understanding of numbers" />
        <MultiTextInput label="Materials Needed" items={req.materialsNeeded} onChange={(val) => updateRequirements({ materialsNeeded: val })} placeholder="e.g. Sketchpad, 2B Pencil" />
        <MultiTextInput label="Tech Requirements" items={req.techRequirements} onChange={(val) => updateRequirements({ techRequirements: val })} placeholder="e.g. Laptop with Webcam" />
        
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Parental Involvement</label>
          <select value={req.parentalInvolvement || ''} onChange={(e) => updateRequirements({ parentalInvolvement: e.target.value })} className="w-full p-3 rounded-xl border border-gray-300 bg-white">
            <option value="">Select Level</option>
            <option value="none">None - Kids participate independently</option>
            <option value="occasional">Occasional - Needed for setup</option>
            <option value="required">Required - Parent must be present</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">About This Class</h2>
        <p className="text-gray-500">Provide an in-depth curriculum and set expectations.</p>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-200 font-semibold overflow-x-auto hide-scrollbar">
        {['Overview', 'Curriculum', 'Requirements'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 whitespace-nowrap border-b-4 transition-all ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white pt-4">
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Curriculum' && renderCurriculum()}
        {activeTab === 'Requirements' && renderRequirements()}
      </div>
    </div>
  );
}
