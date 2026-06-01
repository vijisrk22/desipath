import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import dayjs from 'dayjs';

export default function ItTrainingLeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    setLoading(true);
    api.get('/api/it-training/admin/leads')
      .then(res => {
        if (res.data.success) {
          setLeads(res.data.data);
        }
      })
      .catch(err => console.error("Error fetching leads:", err))
      .finally(() => setLoading(false));
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in font-dmsans">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">IT Training Leads</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and track curriculum syllabus requests from potential students.</p>
        </div>

        <div className="relative group w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search leads by name, email or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium pl-12"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale opacity-50 group-focus-within:opacity-100 transition-all">🔍</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Lead Info</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Course Requested</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Contact Details</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Message</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <span className="text-4xl block mb-2">📥</span>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No leads found yet</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/20">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-400 font-medium">ID: {lead.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black border border-blue-100">
                        {lead.course_title}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">✉️</span>
                          <span className="text-sm font-bold text-gray-700">{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">📞</span>
                            <span className="text-sm font-medium text-gray-500">{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-sm text-gray-600 line-clamp-2 italic">
                        {lead.message || "No message provided."}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-black text-gray-400 uppercase">
                        {dayjs(lead.created_at).format('MMM DD, YYYY')}
                      </p>
                      <p className="text-[10px] text-gray-300 font-bold">
                        {dayjs(lead.created_at).format('hh:mm A')}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
