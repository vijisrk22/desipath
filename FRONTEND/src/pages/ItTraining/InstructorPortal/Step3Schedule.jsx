import React from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LENGTHS = ['30 min', '45 min', '1 hr', '1.5 hrs', '2 hrs', 'Custom'];
const PLATFORMS = ['Zoom', 'Google Meet', 'Microsoft Teams', 'Custom Link'];

export default function Step3Schedule({ data, update }) {

  const toggleDay = (day) => {
    const current = data.daysOfWeek || [];
    if (current.includes(day)) {
      update({ daysOfWeek: current.filter(d => d !== day) });
    } else {
      update({ daysOfWeek: [...current, day] });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Schedule & Location</h2>
        <p className="text-gray-500">When and where is this class happening?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Duration & Sessions */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Course Duration</label>
          <input 
            type="text" 
            placeholder="e.g. 3 months"
            value={data.duration || ''}
            onChange={(e) => update({ duration: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Total Sessions</label>
          <input 
            type="number" 
            placeholder="e.g. 24"
            value={data.totalSessions || ''}
            onChange={(e) => update({ totalSessions: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Days of week */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="font-semibold text-gray-700">Days of the Week</label>
          <div className="flex flex-wrap gap-3">
            {DAYS.map(day => {
              const isSelected = (data.daysOfWeek || []).includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`w-12 h-12 rounded-full font-bold transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Timing & Timezone */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="font-semibold text-gray-700">Session Time & Timezone</label>
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
            <input 
              type="time" 
              value={data.timeStart || ''}
              onChange={(e) => update({ timeStart: e.target.value })}
              className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none min-w-[120px]"
            />
            <span className="text-gray-500 font-medium">to</span>
            <input 
              type="time" 
              value={data.timeEnd || ''}
              onChange={(e) => update({ timeEnd: e.target.value })}
              className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none min-w-[120px]"
            />
            <select
              value={data.timezone || ''}
              onChange={(e) => update({ timezone: e.target.value })}
              className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white min-w-[100px]"
            >
              <option value="">Timezone</option>
              <option value="IST">IST</option>
              <option value="EST">EST</option>
              <option value="CST">CST</option>
              <option value="PST">PST</option>
              <option value="MST">MST</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Session Length</label>
          <select 
            value={data.sessionLength || ''}
            onChange={(e) => update({ sessionLength: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select length</option>
            {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Start Date & Max Students */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Batch Start Date</label>
          <input 
            type="date" 
            value={data.startDate || ''}
            onChange={(e) => update({ startDate: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Max Students per Batch</label>
          <input 
            type="number" 
            placeholder="10"
            value={data.maxStudents || ''}
            onChange={(e) => update({ maxStudents: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Platform & Location details */}
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Online Platform</label>
          <select 
            value={data.platform || ''}
            onChange={(e) => update({ platform: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">N/A (Offline only)</option>
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Trial Class Available?</label>
          <div className="flex items-center gap-4 h-full pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={data.trialAvailable === true} onChange={() => update({ trialAvailable: true })} className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={data.trialAvailable === false} onChange={() => update({ trialAvailable: false })} className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">No</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Schedule Category <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-4 h-full pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="scheduleCategory"
                checked={data.scheduleCategory === 'Weekday'} 
                onChange={() => update({ scheduleCategory: 'Weekday' })} 
                className="w-5 h-5 text-blue-600" 
              />
              <span className="font-medium text-gray-700">Weekday</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="scheduleCategory"
                checked={data.scheduleCategory === 'Weekend'} 
                onChange={() => update({ scheduleCategory: 'Weekend' })} 
                className="w-5 h-5 text-blue-600" 
              />
              <span className="font-medium text-gray-700">Weekend</span>
            </label>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="font-semibold text-gray-700">Location Address (If Hybrid/Offline)</label>
          <textarea 
            rows="2"
            placeholder="Full physical address..."
            value={data.location || ''}
            onChange={(e) => update({ location: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>
        
      </div>
    </div>
  );
}
