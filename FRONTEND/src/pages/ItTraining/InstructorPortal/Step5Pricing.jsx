import React from 'react';

const FEE_TYPES = [
  { id: 'per_session', label: 'Per Session / Hourly' },
  { id: 'per_month', label: 'Per Month (Subscription)' },
  { id: 'full_course', label: 'Full Program Fee (One Time)' }
];

export default function Step5Pricing({ data, update }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Program Investment</h2>
        <p className="text-gray-500">Define the pricing structure and certification for your technical training.</p>
      </div>

      <div className="bg-blue-900/5 border border-blue-900/10 p-8 rounded-3xl mb-8">
        <h3 className="font-bold text-blue-900 mb-6 text-xl">Pricing Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="font-bold text-gray-700 uppercase text-xs tracking-widest">Training Fee</label>
            <div className="flex border-2 border-gray-100 rounded-2xl overflow-hidden focus-within:border-blue-500 transition-all bg-white shadow-sm">
              <span className="bg-gray-50 px-5 py-4 text-gray-400 font-bold border-r border-gray-100">$</span>
              <input 
                type="number" 
                placeholder="e.g. 499"
                value={data.feeAmount || ''}
                onChange={(e) => update({ feeAmount: e.target.value, feeCurrency: 'USD' })}
                className="w-full p-4 outline-none font-bold text-gray-800 text-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-bold text-gray-700 uppercase text-xs tracking-widest">Billing Cycle</label>
            <select 
              value={data.feeType || ''}
              onChange={(e) => update({ feeType: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 bg-white outline-none font-bold text-gray-800 shadow-sm appearance-none cursor-pointer"
            >
              <option value="">Select Fee Type</option>
              {FEE_TYPES.map(ft => <option key={ft.id} value={ft.id}>{ft.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="font-bold text-gray-700 uppercase text-xs tracking-widest">Promotion / Discount Note (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. 20% Early Bird Discount until May 15th"
            value={data.discountLabel || ''}
            onChange={(e) => update({ discountLabel: e.target.value })}
            className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none font-medium shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-gray-700 uppercase text-xs tracking-widest">Industry Certification</label>
          <p className="text-sm text-gray-500 mb-3">Does this program include a recognized certificate?</p>
          <label className="flex items-center gap-4 cursor-pointer p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-emerald-500 transition-all shadow-sm group">
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${data.certificateProvided ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 group-hover:border-emerald-300'}`}>
              {data.certificateProvided && <span className="text-white font-bold text-sm">✓</span>}
            </div>
            <input 
              type="checkbox" 
              checked={data.certificateProvided || false}
              onChange={(e) => update({ certificateProvided: e.target.checked })}
              className="hidden" 
            />
            <span className="font-bold text-gray-800">Yes, Certification Included</span>
          </label>
        </div>
      </div>
    </div>
  );
}
