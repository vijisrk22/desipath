import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { getFullImageUrl } from '../../utils/imageHelper';

export default function ListingAdmin({ endpoint, title, categoryIcon, customBasePath }) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'active', 'rejected'
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ pending: 0, active: 0, rejected: 0 });

  const adminEndpoint = `${endpoint}-admin`;
  const basePath = customBasePath || endpoint.split('/').pop();

  useEffect(() => {
    fetchCounts();
  }, [endpoint, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchListings();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [endpoint, activeTab, page, searchTerm]);

  const fetchCounts = async () => {
    try {
      const [pending, active, rejected] = await Promise.all([
        api.get(`${adminEndpoint}?status=pending&search=${searchTerm}`),
        api.get(`${adminEndpoint}?status=active&search=${searchTerm}`),
        api.get(`${adminEndpoint}?status=rejected&search=${searchTerm}`)
      ]);
      setCounts({
        pending: pending.data.total || 0,
        active: active.data.total || 0,
        rejected: rejected.data.total || 0
      });
    } catch (err) {
      console.error('Error fetching counts:', err);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${adminEndpoint}?page=${page}&status=${activeTab}&search=${searchTerm}`);
      if (res.data.data) {
        setListings(res.data.data);
        setTotalPages(res.data.last_page || 1);
      } else if (Array.isArray(res.data)) {
        setListings(res.data);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // All our toggle endpoints follow this pattern now
      await api.post(`${endpoint}/${id}/toggle-status`, { status: newStatus });
      
      // Update local state to move item
      setListings(listings.filter(l => l.id !== id));
      
      // Refresh counts
      fetchCounts();
      
      showToast(`Listing ${newStatus === 'active' ? 'Approved' : newStatus === 'rejected' ? 'Rejected' : 'Revoked'} successfully!`);
    } catch (err) {
      showToast('Error updating status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    
    try {
      await api.delete(`${endpoint}/${id}`);
      setListings(listings.filter(l => l.id !== id));
      fetchCounts();
      showToast('Listing deleted successfully!', 'success');
    } catch (err) {
      showToast('Error deleting listing.', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  const getPreviewImage = (item) => {
    const imgField = item.images || item.pictures || item.photos || item.cover_images || item.profile_photo;
    if (!imgField) return null;
    if (Array.isArray(imgField)) return imgField[0];
    return imgField;
  };

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
             <span className="text-4xl">{categoryIcon}</span> {title} Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">Review and moderate all {title.toLowerCase()} postings.</p>
        </div>

        {/* Searchbar */}
        <div className="relative w-full md:w-96 group">
          <input 
            type="text" 
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium pl-12"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale opacity-50 group-focus-within:opacity-100 transition-all">🔍</span>
        </div>
      </div>

      {/* Tabs Interface */}
      <div className="flex items-center gap-2 mb-6 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'pending', label: 'Pending Review', color: 'amber', count: counts.pending },
          { id: 'active', label: 'Approved & Live', color: 'green', count: counts.active },
          { id: 'rejected', label: 'Rejected', color: 'red', count: counts.rejected }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setPage(1); }}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === tab.id 
                ? `bg-white text-${tab.color}-600 shadow-sm border border-${tab.color}-100` 
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
              activeTab === tab.id ? `bg-${tab.color}-50 border-${tab.color}-200` : 'bg-gray-200 border-gray-300'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-200">
          <span className="text-6xl block mb-4">{searchTerm ? "🔍" : "🏜️"}</span>
          <h2 className="text-2xl font-bold text-gray-800">{searchTerm ? "No Matches Found" : "No Listings Found"}</h2>
          <p className="text-gray-500">{searchTerm ? "Try searching for something else." : `There are currently no ${activeTab} postings in this category.`}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Preview</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Details</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Location</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Price/Rent</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {getPreviewImage(item) ? (
                          <img 
                            src={getFullImageUrl(getPreviewImage(item))} 
                            className="w-full h-full object-cover" 
                            alt="preview"
                            onError={(e) => {
                                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">Error</div>';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] italic">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 truncate max-w-xs">{item.title || item.course_title || item.event_name || item.address || item.make || 'Untitled'}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-tighter font-bold flex items-center gap-2">
                        ID: #{item.id} <span className="text-gray-300">|</span> {item.owner_name || item.poster_name || item.seller_name || item.user_name || 'Anonymous'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {item.location_city || item.location || item.state_city_zipcode || 'N/A'}{item.location_state ? `, ${item.location_state}` : ''}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-600">
                        {formatPrice(item.deposit_rent || item.price || item.rent || item.course_fee || item.ticket_price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {/* Contextual Actions */}
                        {activeTab === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(item.id, 'active')}
                              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(item.id, 'rejected')}
                              className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {activeTab === 'active' && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'pending')}
                            className="px-4 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
                          >
                            Revoke
                          </button>
                        )}

                        {activeTab === 'rejected' && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'active')}
                            className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                          >
                            Re-approve
                          </button>
                        )}

                        {/* Standard Actions */}
                        <div className="flex items-center gap-1 ml-2 border-l pl-3 border-gray-200">
                          <a 
                            href={`/services/${basePath}/details/${item.id}`} 
                            target="_blank" rel="noreferrer"
                            className="p-1.5 text-gray-400 hover:text-blue-600"
                            title="View Publicly"
                          >👁️</a>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500"
                            title="Delete"
                          >🗑️</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/20">
            <div className="text-sm text-gray-500 font-medium">
              Showing page <span className="text-gray-900 font-bold">{page}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-white disabled:opacity-30 transition-all"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-30 transition-all shadow-lg shadow-blue-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
