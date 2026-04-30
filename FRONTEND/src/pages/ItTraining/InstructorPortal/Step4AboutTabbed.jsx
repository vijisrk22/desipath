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
            placeholder="Provide a comprehensive breakdown of the training program, its goals, and why it's unique..."
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <MultiTextInput label="Target Audience" items={ov.whoIsItFor} onChange={(val) => updateOverview({ whoIsItFor: val })} placeholder="e.g. Aspiring Data Scientists, Backend Developers" />
        <MultiTextInput label="Key Learning Objectives" items={ov.whatWillKidsLearn} onChange={(val) => updateOverview({ whatWillKidsLearn: val })} placeholder="e.g. Master Docker & Kubernetes orchestration" />
        <MultiTextInput label="Training Highlights" items={ov.highlights} onChange={(val) => updateOverview({ highlights: val })} placeholder="e.g. 10+ Real-world Projects, Certification Prep" />
      </div>
    );
  };

  const renderCurriculum = () => {
    const modules = data.curriculum || [];
    
    const addModule = () => {
      update({ curriculum: [...modules, { id: Date.now(), title: '', description: '', duration: '', topics: [] }] });
    };
    
    const setMod = (idx, fields) => {
      const newMods = [...modules];
      newMods[idx] = { ...newMods[idx], ...fields };
      update({ curriculum: newMods });
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Course Modules</h3>
        {modules.map((mod, idx) => (
          <div key={mod.id} className="p-5 border border-gray-200 rounded-2xl bg-gray-50 space-y-4 shadow-inner">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-blue-900 uppercase tracking-wider text-xs">Module {idx + 1}</h4>
              <button onClick={() => update({ curriculum: modules.filter((_, i) => i !== idx) })} className="text-red-500 text-xs font-bold hover:bg-red-50 px-2 py-1 rounded transition-all">Remove Module</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Module Title (e.g., Intro to AWS)" value={mod.title} onChange={e => setMod(idx, { title: e.target.value })} className="w-full p-3 rounded-xl border border-gray-300" />
              <input type="text" placeholder="Duration (e.g. Week 1-2)" value={mod.duration} onChange={e => setMod(idx, { duration: e.target.value })} className="w-full p-3 rounded-xl border border-gray-300" />
              <div className="md:col-span-2">
                <textarea rows="2" placeholder="Briefly describe the key topics covered in this module..." value={mod.description} onChange={e => setMod(idx, { description: e.target.value })} className="w-full p-3 rounded-xl border border-gray-300" />
              </div>
            </div>
          </div>
        ))}
        <button onClick={addModule} className="w-full py-4 border-2 border-dashed border-blue-400 text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
          <span className="text-xl">+</span> Add Training Module
        </button>
      </div>
    );
  };

  const renderRequirements = () => {
    const req = data.requirements || {};
    return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Prerequisites & Tech Setup</h3>
        <MultiTextInput label="Minimum Prerequisites" items={req.prerequisites} onChange={(val) => updateRequirements({ prerequisites: val })} placeholder="e.g. Basic knowledge of Python, Understanding of APIs" />
        <MultiTextInput label="Software / Tools Needed" items={req.materialsNeeded} onChange={(val) => updateRequirements({ materialsNeeded: val })} placeholder="e.g. VS Code, AWS Account (Free Tier)" />
        <MultiTextInput label="Hardware Requirements" items={req.techRequirements} onChange={(val) => updateRequirements({ techRequirements: val })} placeholder="e.g. 8GB RAM, i5 Processor or equivalent" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Detailed Program Info</h2>
        <p className="text-gray-500">Break down the curriculum and technical requirements for your students.</p>
      </div>

      <div className="flex border-b border-gray-200 font-bold overflow-x-auto hide-scrollbar bg-slate-50 rounded-t-2xl px-2">
        {['Overview', 'Curriculum', 'Requirements'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 whitespace-nowrap border-b-4 transition-all uppercase tracking-widest text-xs ${activeTab === tab ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl' : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white pt-4">
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Curriculum' && renderCurriculum()}
        {activeTab === 'Requirements' && renderRequirements()}
      </div>
    </div>
  );
}
