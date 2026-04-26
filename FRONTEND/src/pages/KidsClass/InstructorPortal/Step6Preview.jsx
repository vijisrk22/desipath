import React from 'react';
import { getFullImageUrl } from '../../../utils/imageHelper';

export default function Step6Preview({ data, onEditStep }) {
  const { instructorInfo, classBasic, schedule, about, pricing } = data;

  const renderBadgeList = (list, colorClass) => {
    if (!list || list.length === 0) return <span className="text-gray-400 italic">None selected</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {list.map((item, idx) => (
          <span key={idx} className={`px-2.5 py-1 rounded-md text-xs font-bold ${colorClass}`}>
            {item}
          </span>
        ))}
      </div>
    );
  };

  const renderBulletList = (list) => {
    if (!list || list.length === 0) return <p className="text-gray-400 italic">No items provided.</p>;
    return (
      <ul className="list-disc pl-5 space-y-1">
        {list.map((item, idx) => (
          <li key={idx} className="text-gray-700">{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">Review Your Comprehensive Listing</h2>
        <p className="text-gray-500 max-w-lg mx-auto">This represents the complete dataset that will be submitted to the Admin team.</p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Instructor Profile */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative group">
          <button onClick={() => onEditStep(1)} className="absolute top-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-bold underline transition">Edit Profile</button>
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b pb-2 mb-4">Step 1: Instructor Identity</h3>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center relative shrink-0">
              {instructorInfo?.photoUrl ? (
                 <img 
                   src={getFullImageUrl(instructorInfo.photoUrl)} 
                   alt="Avatar" 
                   className="w-full h-full object-cover" 
                 />
              ) : <span className="text-2xl">📸</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 w-full">
              <p><strong>Name:</strong> {instructorInfo?.name || 'N/A'}</p>
              <p className="capitalize"><strong>Account:</strong> {instructorInfo?.accountType || 'N/A'}</p>
              <p><strong>Experience:</strong> {instructorInfo?.yearsExperience ? `${instructorInfo.yearsExperience} Years` : 'N/A'}</p>
              <p className="col-span-full"><strong>Bio:</strong> {instructorInfo?.bio || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Step 2: Class Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative group">
          <button onClick={() => onEditStep(2)} className="absolute top-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-bold underline transition">Edit Basics</button>
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b pb-2 mb-4">Step 2: Class Basics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <p className="col-span-full text-xl font-bold text-blue-900 border-b pb-2">{classBasic?.title || 'Untitled Class'}</p>
            <div>
              <p className="font-semibold text-gray-600 mb-1">Category / Subcategory</p>
              <p className="font-bold">{classBasic?.category || 'N/A'} {classBasic?.subcategory ? `→ ${classBasic?.subcategory}` : ''}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600 mb-1">Age Group</p>
              {renderBadgeList(classBasic?.ageGroup, 'bg-green-100 text-green-800')}
            </div>
            <div>
              <p className="font-semibold text-gray-600 mb-1">Target Levels</p>
              {renderBadgeList(classBasic?.level, 'bg-blue-100 text-blue-800')}
            </div>
            <div>
              <p className="font-semibold text-gray-600 mb-1">Formats Offered</p>
              {renderBadgeList(classBasic?.format, 'bg-orange-100 text-orange-800')}
            </div>
            <div>
              <p className="font-semibold text-gray-600 mb-1">Search Tags</p>
              {renderBadgeList(classBasic?.tags, 'bg-gray-200 text-gray-700')}
            </div>
            <div className="col-span-full">
              <p className="font-semibold text-gray-600 mb-1">Short Description</p>
              <p>{classBasic?.shortDescription || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Step 3: Schedule & Location */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative group">
          <button onClick={() => onEditStep(3)} className="absolute top-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-bold underline transition">Edit Schedule</button>
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b pb-2 mb-4">Step 3: Logistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div><strong>Duration:</strong> {schedule?.duration || 'N/A'}</div>
            <div><strong>Total Sessions:</strong> {schedule?.totalSessions || 'N/A'}</div>
            <div><strong>Session Length:</strong> {schedule?.sessionLength || 'N/A'}</div>
            <div className="col-span-full"><strong>Days of Week:</strong> {renderBadgeList(schedule?.daysOfWeek, 'bg-indigo-100 text-indigo-700')}</div>
            <div><strong>Timing:</strong> {schedule?.timeStart || '-'} to {schedule?.timeEnd || '-'}</div>
            <div><strong>Batch Start:</strong> {schedule?.startDate || 'N/A'}</div>
            <div><strong>Max Students:</strong> {schedule?.maxStudents || 'Unlimited'}</div>
            <div><strong>Trial Available:</strong> {schedule?.trialAvailable ? 'Yes' : 'No'}</div>
            <div><strong>Platform:</strong> {schedule?.platform || 'N/A'}</div>
            <div className="col-span-full"><strong>Location Address:</strong> {schedule?.location || 'N/A'}</div>
          </div>
        </div>

        {/* Step 4: About / Curriculum */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative group">
          <button onClick={() => onEditStep(4)} className="absolute top-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-bold underline transition">Edit Curriculum</button>
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b pb-2 mb-4">Step 4: Curriculum & Requirements</h3>
          
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-gray-800 mb-1">Detailed Listing Description</p>
              <p className="text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg">{about?.overview?.detailedDescription || 'N/A'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-semibold text-gray-800 mb-2">Who is it for?</p>
                {renderBulletList(about?.overview?.whoIsItFor)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-2">What will kids learn?</p>
                {renderBulletList(about?.overview?.whatWillKidsLearn)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-2">Class Highlights</p>
                {renderBulletList(about?.overview?.highlights)}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-semibold text-gray-800 mb-3 text-lg">Curriculum Modules</p>
              {!(about?.curriculum) || about.curriculum.length === 0 ? (
                <p className="text-gray-400 italic">No modules added.</p>
              ) : (
                <div className="space-y-3">
                  {about.curriculum.map((mod, i) => (
                    <div key={i} className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                      <p className="font-bold text-blue-900">Module {i + 1}: {mod.title || 'Untitled'}</p>
                      <p className="text-sm text-blue-700 font-medium my-1">Duration: {mod.duration || 'N/A'}</p>
                      <p className="text-gray-700 text-sm">{mod.description || 'No description.'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-full">
                <p className="font-semibold text-gray-800 mb-1">Parental Involvement: <span className="text-red-500 capitalize">{about?.requirements?.parentalInvolvement || 'Not specified'}</span></p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-2">Prerequisites</p>
                {renderBulletList(about?.requirements?.prerequisites)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-2">Materials Needed</p>
                {renderBulletList(about?.requirements?.materialsNeeded)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-2">Tech Requirements</p>
                {renderBulletList(about?.requirements?.techRequirements)}
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Pricing */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative group">
          <button onClick={() => onEditStep(5)} className="absolute top-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-bold underline transition">Edit Pricing</button>
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b pb-2 mb-4">Step 5: Financials</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="text-5xl font-extrabold text-green-600 flex items-start">
              <span className="text-2xl mt-2 mr-1">₹</span>{pricing?.feeAmount || '0'} 
              <span className="text-xl text-gray-500 font-medium tracking-normal block mt-1 uppercase text-left">
                / {pricing?.feeType?.replace('_', ' ') || 'unspecified cycle'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg border flex justify-between">
                <span className="font-semibold">Discount Label:</span>
                <span className="text-gray-700">{pricing?.discountLabel || 'None'}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border flex justify-between">
                <span className="font-semibold">Certificate Provided:</span>
                <span className={`font-bold ${pricing?.certificateProvided ? 'text-green-600' : 'text-gray-500'}`}>
                  {pricing?.certificateProvided ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
