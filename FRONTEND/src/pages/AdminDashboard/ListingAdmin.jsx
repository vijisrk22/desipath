import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function ListingAdmin({ endpoint, title, categoryIcon, customBasePath }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const basePath = customBasePath || endpoint.split('/').pop();

  useEffect(() => {
    fetchListings();
  }, [endpoint]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      // Backend paginates, so data is in res.data.data
      setListings(res.data.data || []);
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
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    
    try {
      await api.delete(`${endpoint}/${id}`);
      setListings(listings.filter(l => l.id !== id));
      showToast('Listing deleted successfully!', 'success');
    } catch (err) {
      showToast('Error deleting listing.', 'error');
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
             <span className="text-4xl">{categoryIcon}</span> {title}
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage and moderate all {title.toLowerCase()} postings.</p>
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
          <p className="text-gray-500">There are currently no active postings in this category.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Preview</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Details</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Location</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Price/Rent</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      {item.images && item.images.length > 0 ? (
                        <img 
                           src={(() => {
                             let img = typeof item.images === 'string' ? JSON.parse(item.images)[0] : (Array.isArray(item.images) ? item.images[0] : '');
                             if (img && img.startsWith('storage/')) {
                               return `https://desipathapi.azurewebsites.net/${img}`;
                             }
                             return img;
                           })()} 
                           className="w-full h-full object-cover" 
                           onError={(e) => { 
                             e.target.onerror = null; 
                             e.target.src = '/placeholder.png'; 
                           }}
                           alt="listing"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">No Img</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 truncate max-w-xs">{item.title || item.address || item.make || 'Untitled'}</div>
                    <div className="text-xs text-gray-500 mt-0.5 capitalize">{item.property_type || item.type || item.model || 'Standard'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]">
                    {item.location_city || item.location || 'N/A'}{item.location_state ? `, ${item.location_state}` : ''}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600">
                      {formatPrice(item.deposit_rent || item.price || item.rent)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {/* Link to public view */}
                       <a 
                         href={`/services/${basePath}/details/${item.id}`} 
                         target="_blank" 
                         rel="noreferrer"
                         className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                         title="View Publicly"
                       >
                         👁️
                       </a>
                       {/* Edit button */}
                       <a 
                         href={`/services/${basePath}/edit/${item.id}`} 
                         className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                         title="Edit Listing"
                       >
                         ✏️
                       </a>
                       <button 
                         onClick={() => handleDelete(item.id)}
                         className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                         title="Delete Listing"
                       >
                         🗑️
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Toast Notification */}
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
