import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { getFullImageUrl } from '../../utils/imageHelper';

export default function ListingAdmin({ endpoint, title, categoryIcon, customBasePath }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const basePath = customBasePath || endpoint.split('/').pop();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        fetchListings();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [endpoint, page, searchTerm]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endpoint}?page=${page}&search=${searchTerm}`);
      // Some endpoints might return simple arrays if not updated yet, check for pagination
      if (res.data.data && Array.isArray(res.data.data)) {
        setListings(res.data.data);
        setTotalPages(res.data.last_page || 1);
        setTotalRecords(res.data.total || 0);
      } else if (Array.isArray(res.data)) {
        setListings(res.data);
        setTotalPages(1);
        setTotalRecords(res.data.length);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 on search
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setPage(1);
  };

  const filteredListings = listings.filter(item => {
    const searchStr = searchTerm.toLowerCase();
    const searchableFields = [
      item.title,
      item.address,
      item.location_city,
      item.location_state,
      item.location_zipcode,
      item.make,
      item.model
    ].filter(Boolean).join(" ").toLowerCase();
    
    return searchableFields.includes(searchStr);
  });

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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
             <span className="text-4xl">{categoryIcon}</span> {title}
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage and moderate all {title.toLowerCase()} postings.</p>
        </div>

        {/* Simple Searchbar */}
        <div className="relative w-full md:w-96 group">
          <input 
            type="text" 
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
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
          <span className="text-6xl block mb-4">{searchTerm ? "🔍" : "🏜️"}</span>
          <h2 className="text-2xl font-bold text-gray-800">{searchTerm ? "No Matches Found" : "No Listings Found"}</h2>
          <p className="text-gray-500">{searchTerm ? "Try searching for something else." : `There are currently no active postings in this category.`}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              {totalRecords} Total {title} Entries
            </span>
          </div>
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
                      {item.images && (Array.isArray(item.images) ? item.images.length > 0 : !!item.images) ? (
                        <img 
                           src={getFullImageUrl(Array.isArray(item.images) ? item.images[0] : item.images)} 
                           className="w-full h-full object-cover" 
                           onError={(e) => { 
                             e.target.style.display = 'none';
                             e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">Error</div>';
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

          {/* Simple Pagination Footer */}
          <div className="px-6 py-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/20">
            <div className="text-sm text-gray-500 font-medium">
              Showing page <span className="text-gray-900 font-bold">{page}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-600 border border-blue-600 rounded-xl font-bold text-sm text-white shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
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
