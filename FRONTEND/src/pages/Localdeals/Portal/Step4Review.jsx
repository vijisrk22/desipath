import React from 'react';
import { IoCheckmarkCircle, IoBusiness, IoMegaphoneOutline, IoPricetagOutline } from 'react-icons/io5';

export default function Step4Review({ data, onBack, onSubmit, isSaving }) {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
          <IoCheckmarkCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Final Review</h2>
        <p className="text-gray-500">Please verify all details before submitting your ad for review.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Business Profile */}
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6 text-blue-600">
            <IoBusiness size={24} />
            <h3 className="text-xl font-bold">Business Profile</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Name:</span>
              <span className="font-bold text-gray-900">{data.businessName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Owner:</span>
              <span className="font-medium text-gray-900">{data.ownerName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Location:</span>
              <span className="font-medium text-gray-900 text-right">{data.city}, {data.state} {data.zipcode}, {data.country}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Contact:</span>
              <span className="font-medium text-gray-900">{data.ownerPhone}</span>
            </div>
          </div>
        </div>

        {/* Ad Details */}
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6 text-orange-500">
            <IoMegaphoneOutline size={24} />
            <h3 className="text-xl font-bold">Ad Content</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Title:</span>
              <span className="font-bold text-gray-900">{data.title}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Category:</span>
              <span className="font-medium text-gray-900">{data.category}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Display Contact:</span>
              <span className="font-medium text-gray-900">{data.displayPhone || data.ownerPhone}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag, i) => (
                  <span key={i} className="bg-white px-2 py-1 rounded-md text-xs font-bold text-gray-600 border border-gray-200">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border-2 border-gray-100">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Description Preview</h4>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{data.description}</p>
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
          onClick={onSubmit}
          disabled={isSaving}
          className="px-12 py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl shadow-green-200 transition-all hover:-translate-y-1 disabled:opacity-50"
        >
          {isSaving ? 'Submitting...' : 'Confirm & Post Ad'}
        </button>
      </div>
    </div>
  );
}
