import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { getFullImageUrl } from '../../utils/imageHelper';

export default function PhotographyAdmin() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchListings();
  }, [searchTerm]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Reusing the search endpoint but for all statuses for admin
      const res = await api.get(`/api/photography/search?q=${searchTerm}&admin=true`);
      if (res.data.success) {
        setListings(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/api/photography/delete/${id}`);
      setListings(listings.filter(l => l.id !== id));
      showToast('Listing deleted successfully!', 'success');
    } catch (err) {
      showToast('Error deleting listing.', 'error');
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const res = await api.post(`/api/photography/toggle-status/${item.id}`);
      if (res.data.success) {
        setListings(listings.map(l => l.id === item.id ? { ...l, status: res.data.status } : l));
        showToast(`Listing is now ${res.data.status}`, 'success');
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
             <span className="text-4xl">📸</span> Photography Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">Review and moderate all photographer profiles.</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <input 
            type="text" 
            placeholder="Search photographers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium pl-12"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale opacity-50 group-focus-within:opacity-100 transition-all">🔍</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-200">
          <span className="text-6xl block mb-4">🏜️</span>
          <h2 className="text-2xl font-bold text-gray-800">No Listings Found</h2>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Photographer</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Type</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Location</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                         <img 
                           src={getFullImageUrl(item.profile_photo)} 
                           className="w-full h-full object-cover"
                           alt=""
                           onError={(e) => e.target.src = "/img/photography/default_profile.png"}
                         />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-400 font-medium">{item.experience_years}y Exp</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">
                      {item.service_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {item.locations?.[0]?.city}, {item.locations?.[0]?.state}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(item)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === 'active' 
                        ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                      } transition-colors`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <a 
                         href={`/services/photography/details/${item.id}`} 
                         target="_blank" rel="noreferrer"
                         className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                         title="View"
                       >👁️</a>
                       <a 
                         href={`/services/photography/edit/${item.id}`}
                         className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                         title="Edit"
                       >✏️</a>
                       <button 
                         onClick={() => handleDelete(item.id)}
                         className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                         title="Delete"
                       >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in-up">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${toast.type === 'success' ? 'bg-white border-green-500 shadow-green-100' : 'bg-white border-red-500 shadow-red-100'}`}>
            <span className={`text-2xl ${toast.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {toast.type === 'success' ? '✅' : '🚨'}
            </span>
            <p className="font-bold text-gray-800">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
