import React from 'react';

const FEE_TYPES = [
  { id: 'per_session', label: 'Per Session' },
  { id: 'per_month', label: 'Per Month' },
  { id: 'full_course', label: 'Full Course (One Time)' }
];

export default function Step5Pricing({ data, update }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Pricing & Policies</h2>
        <p className="text-gray-500">Set your class fee and credential structure.</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8">
        <h3 className="font-bold text-gray-800 mb-4 text-xl">Fee Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Fee Amount</label>
            <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="bg-gray-100 px-4 py-3 text-gray-600 font-bold border-r border-gray-300">₹</span>
              <input 
                type="number" 
                placeholder="e.g. 5000"
                value={data.feeAmount || ''}
                onChange={(e) => update({ feeAmount: e.target.value, feeCurrency: 'INR' })}
                className="w-full p-3 outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Fee Type</label>
            <select 
              value={data.feeType || ''}
              onChange={(e) => update({ feeType: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
            >
              <option value="">Select billing cycle</option>
              {FEE_TYPES.map(ft => <option key={ft.id} value={ft.id}>{ft.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Discount Label / Offer (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. 10% off for siblings"
            value={data.discountLabel || ''}
            onChange={(e) => update({ discountLabel: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Certificate Provided?</label>
          <p className="text-sm text-gray-500 mb-2">Will students get a certificate of completion?</p>
          <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition w-max">
            <input 
              type="checkbox" 
              checked={data.certificateProvided || false}
              onChange={(e) => update({ certificateProvided: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded" 
            />
            <span className="font-bold text-gray-700">Yes, Certificate Provided</span>
          </label>
        </div>
      </div>
    </div>
  );
}
