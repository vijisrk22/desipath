import React from 'react';
import { getFullImageUrl } from '../../../utils/imageHelper';

export default function Step6Preview({ data, onEditStep }) {
  const { instructorInfo, classBasic, schedule, about, pricing } = data;

  const renderBadgeList = (list, colorClass) => {
    if (!list || list.length === 0) return <span className="text-gray-400 italic">None selected</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {list.map((item, idx) => (
          <span key={idx} className={`px-3 py-1 rounded-lg text-xs font-bold ${colorClass}`}>
            {item}
          </span>
        ))}
      </div>
    );
  };

  const renderBulletList = (list) => {
    if (!list || list.length === 0) return <p className="text-gray-400 italic text-sm">No items provided.</p>;
    return (
      <ul className="list-disc pl-5 space-y-1">
        {list.map((item, idx) => (
          <li key={idx} className="text-gray-700 text-sm">{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-3">Final Program Review</h2>
        <p className="text-gray-500 max-w-lg mx-auto font-medium">Please review all details before publishing your technical training program.</p>
      </div>

      <div className="space-y-8">
        {/* Step 1: Instructor Profile */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
          <button onClick={() => onEditStep(1)} className="absolute top-6 right-8 text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-bold underline transition-all">Edit Profile</button>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-3 mb-6">Step 1: Instructor Identity</h3>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 shadow-inner">
              {instructorInfo?.photoUrl ? (
                 <img 
                   src={getFullImageUrl(instructorInfo.photoUrl)} 
                   alt="Avatar" 
                   className="w-full h-full object-cover" 
                 />
              ) : <span className="text-3xl">📸</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 w-full">
              <div><p className="text-xs text-gray-400 font-bold uppercase mb-0.5">Full Name</p><p className="font-bold text-gray-900">{instructorInfo?.name || 'N/A'}</p></div>
              <div><p className="text-xs text-gray-400 font-bold uppercase mb-0.5">Account Type</p><p className="font-bold text-gray-900 capitalize">{instructorInfo?.accountType || 'N/A'}</p></div>
              <div><p className="text-xs text-gray-400 font-bold uppercase mb-0.5">Tech Experience</p><p className="font-bold text-gray-900">{instructorInfo?.yearsExperience ? `${instructorInfo.yearsExperience} Years` : 'N/A'}</p></div>
              <div className="col-span-full"><p className="text-xs text-gray-400 font-bold uppercase mb-0.5">Professional Bio</p><p className="text-gray-700 leading-relaxed text-sm">{instructorInfo?.bio || 'N/A'}</p></div>
            </div>
          </div>
        </div>

        {/* Step 2: Program Basics */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
          <button onClick={() => onEditStep(2)} className="absolute top-6 right-8 text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-bold underline transition-all">Edit Basics</button>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-3 mb-6">Step 2: Training Program Basics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="col-span-full">
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Program Title</p>
              <p className="text-2xl font-extrabold text-blue-900 leading-tight">{classBasic?.title || 'Untitled Training'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Category & Specialization</p>
              <p className="font-bold text-gray-900 text-lg">{classBasic?.category || 'N/A'} <span className="text-blue-500 mx-2">→</span> {classBasic?.subcategory || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Target Skill Levels</p>
              {renderBadgeList(classBasic?.level, 'bg-blue-50 text-blue-700 border border-blue-100')}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Learning Formats</p>
              {renderBadgeList(classBasic?.format, 'bg-emerald-50 text-emerald-700 border border-emerald-100')}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Search Keywords</p>
              {renderBadgeList(classBasic?.tags, 'bg-slate-100 text-slate-600 border border-slate-200')}
            </div>
            <div className="col-span-full">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Training Coverage (Short Summary)</p>
              <p className="text-gray-900 font-bold text-lg bg-blue-50/50 p-4 rounded-xl border border-blue-100">{classBasic?.trainingCovers || 'N/A'}</p>
            </div>
            <div className="col-span-full">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Program Summary</p>
              <p className="text-gray-700 font-medium leading-relaxed italic border-l-4 border-blue-200 pl-4 bg-blue-50/30 py-3 rounded-r-xl">{classBasic?.shortDescription || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Step 3: Logistics */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
          <button onClick={() => onEditStep(3)} className="absolute top-6 right-8 text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-bold underline transition-all">Edit Logistics</button>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-3 mb-6">Step 3: Training Logistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Duration</p><p className="font-bold">{schedule?.duration || 'N/A'}</p></div>
            <div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Sessions Count</p><p className="font-bold">{schedule?.totalSessions || 'N/A'}</p></div>
            <div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Session length</p><p className="font-bold">{schedule?.sessionLength ? `${schedule.sessionLength} Mins` : 'N/A'}</p></div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Weekly Schedule</p>
              {renderBadgeList(schedule?.daysOfWeek, 'bg-indigo-50 text-indigo-700 border border-indigo-100')}
            </div>
            <div>
               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Schedule Category</p>
               <p className="font-black text-indigo-600">{schedule?.scheduleCategory || 'N/A'}</p>
            </div>
            <div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Time Slot</p><p className="font-bold">{schedule?.timeStart || '-'} to {schedule?.timeEnd || '-'}</p></div>
            <div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Batch Starts</p><p className="font-bold">{schedule?.startDate || 'N/A'}</p></div>
            <div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Trial Session</p><p className={`font-bold ${schedule?.trialAvailable ? 'text-emerald-600' : 'text-gray-400'}`}>{schedule?.trialAvailable ? 'AVAILABLE' : 'NOT OFFERED'}</p></div>
          </div>
        </div>

        {/* Step 4: Curriculum */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
          <button onClick={() => onEditStep(4)} className="absolute top-6 right-8 text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-bold underline transition-all">Edit Curriculum</button>
          <div className="flex justify-between items-center border-b pb-3 mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 4: Deep-Dive Curriculum</h3>
            {data.curriculumPdfName && (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                <span>📄 {data.curriculumPdfName}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Full Program Description</p>
              <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm leading-relaxed">{about?.overview?.detailedDescription || 'N/A'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-xs text-blue-900 font-extrabold uppercase tracking-widest mb-3 flex items-center gap-2">🎯 Target Audience</p>
                {renderBulletList(about?.overview?.whoIsItFor)}
              </div>
              <div>
                <p className="text-xs text-emerald-900 font-extrabold uppercase tracking-widest mb-3 flex items-center gap-2">🚀 Learning Goals</p>
                {renderBulletList(about?.overview?.whatWillKidsLearn)}
              </div>
              <div>
                <p className="text-xs text-purple-900 font-extrabold uppercase tracking-widest mb-3 flex items-center gap-2">⭐ Highlights</p>
                {renderBulletList(about?.overview?.highlights)}
              </div>
            </div>

            <div className="border-t pt-8">
              <p className="text-sm font-extrabold text-gray-900 mb-6 uppercase tracking-wider">Detailed Roadmap</p>
              {!(about?.curriculum) || about.curriculum.length === 0 ? (
                <p className="text-gray-400 italic">No modules defined.</p>
              ) : (
                <div className="space-y-4">
                  {about.curriculum.map((mod, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-lg shadow-blue-500/20">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{mod.title || 'Untitled Module'}</p>
                        <p className="text-xs text-blue-600 font-bold mb-2 uppercase tracking-tight">{mod.duration || 'Flexible Duration'}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{mod.description || 'Detailed roadmap coming soon.'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-3">Prerequisites</p>
                {renderBulletList(about?.requirements?.prerequisites)}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-3">Software / Tools</p>
                {renderBulletList(about?.requirements?.materialsNeeded)}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-3">Tech Specs</p>
                {renderBulletList(about?.requirements?.techRequirements)}
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Pricing */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
          <button onClick={() => onEditStep(5)} className="absolute top-6 right-8 text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-bold underline transition-all">Edit Pricing</button>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-3 mb-6">Step 5: Investment & Value</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="bg-blue-900 p-8 rounded-3xl text-white shadow-2xl shadow-blue-900/20">
              <p className="text-xs font-bold uppercase opacity-60 mb-2">Total Training Fee</p>
              <div className="text-6xl font-black flex items-start">
                <span className="text-3xl mt-2 mr-1">$</span>{pricing?.feeAmount || '0'} 
              </div>
              <p className="text-blue-300 font-bold uppercase text-xs mt-2 tracking-widest">
                Charged {pricing?.feeType?.replace('_', ' ') || 'per course'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                <span className="font-bold text-gray-500 uppercase text-xs tracking-wider">Promotion</span>
                <span className="text-blue-700 font-black">{pricing?.discountLabel || 'Standard Price'}</span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                <span className="font-bold text-gray-500 uppercase text-xs tracking-wider">Industry Certificate</span>
                <span className={`font-black tracking-widest ${pricing?.certificateProvided ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {pricing?.certificateProvided ? 'INCLUDED' : 'NOT AVAILABLE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
