import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { getFullImageUrl } from '../../utils/imageHelper';

const TABS = [
  { key: 'pending',  label: 'Pending Review',  emoji: '🕐' },
  { key: 'approved', label: 'Approved & Live',  emoji: '✅' },
  { key: 'rejected', label: 'Rejected',          emoji: '❌' },
];

// Some endpoints use 'active'/'inactive' instead of 'approved'/'pending'
// We normalise display but pass the correct values per endpoint
const STATUS_DISPLAY = {
  approved: { label: 'Approved', cls: 'bg-green-50 text-green-700 border-green-200' },
  active:   { label: 'Active',   cls: 'bg-green-50 text-green-700 border-green-200' },
  pending:  { label: 'Pending',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  inactive: { label: 'Inactive', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 border-red-200' },
};

export default function ListingAdmin({ endpoint, title, categoryIcon, customBasePath, statusField = 'status', approvedValue = 'approved', pendingValue = 'pending', rejectedValue = 'rejected' }) {
  const [activeTab, setActiveTab]   = useState('pending');
  const [listings, setListings]     = useState([]);
  const [counts, setCounts]         = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const basePath = customBasePath || endpoint.split('/').pop();

  // Map our tab keys to the actual values used by each endpoint
  const tabToValue = { pending: pendingValue, approved: approvedValue, rejected: rejectedValue };

  const fetchCounts = useCallback(async () => {
    try {
      const [p, a, r] = await Promise.all([
        api.get(`${endpoint}?${statusField}=${pendingValue}&limit=1`),
        api.get(`${endpoint}?${statusField}=${approvedValue}&limit=1`),
        api.get(`${endpoint}?${statusField}=${rejectedValue}&limit=1`),
      ]);
      const getTotal = d => d.data?.total ?? (Array.isArray(d.data) ? d.data.length : 0);
      setCounts({ pending: getTotal(p), approved: getTotal(a), rejected: getTotal(r) });
    } catch { /* silent */ }
  }, [endpoint, statusField, pendingValue, approvedValue, rejectedValue]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const statusVal = tabToValue[activeTab];
      const res = await api.get(`${endpoint}?page=${page}&search=${searchTerm}&${statusField}=${statusVal}&admin=true`);
      if (res.data?.data && Array.isArray(res.data.data)) {
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
  }, [endpoint, activeTab, page, searchTerm, statusField]);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);
  useEffect(() => { setPage(1); }, [activeTab]);
  useEffect(() => {
    const t = setTimeout(fetchListings, 400);
    return () => clearTimeout(t);
  }, [fetchListings]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const changeStatus = async (item, newTabKey) => {
    const newValue = tabToValue[newTabKey];
    try {
      await api.put(`${endpoint}/${item.id}`, { [statusField]: newValue });
      setListings(prev => prev.filter(l => l.id !== item.id));
      setCounts(prev => ({
        ...prev,
        [activeTab]: Math.max(0, prev[activeTab] - 1),
        [newTabKey]: (prev[newTabKey] ?? 0) + 1,
      }));
      showToast(`Listing moved to "${TABS.find(t => t.key === newTabKey)?.label}".`);
    } catch {
      showToast('Status update failed.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this listing?')) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      setListings(prev => prev.filter(l => l.id !== id));
      setCounts(prev => ({ ...prev, [activeTab]: Math.max(0, prev[activeTab] - 1) }));
      showToast('Listing deleted.');
    } catch { showToast('Delete failed.', 'error'); }
  };

  const getImage = (item) => {
    const raw = item.images || item.main_image || item.image || item.photo || item.profile_photo;
    if (!raw) return null;
    return getFullImageUrl(Array.isArray(raw) ? raw[0] : raw);
  };

  const getTitle = (item) => item.title || item.address || `${item.make || ''} ${item.model || ''}`.trim() || 'Untitled';
  const getSub   = (item) => item.property_type || item.type || item.event_type || item.sharing_type || item.model || '';
  const getLoc   = (item) => [item.location_city, item.location_state || item.location_zipcode].filter(Boolean).join(', ') || item.location || '—';
  const getPrice = (item) => {
    const val = item.price || item.deposit_rent || item.rent || item.ticketPrice || item.monthly_rent;
    if (!val) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <span className="text-4xl">{categoryIcon}</span> {title}
        </h1>
        <p className="text-gray-500 font-medium mt-1">Manage and moderate all {title.toLowerCase()} postings.</p>
      </div>

      {/* Tab bar + filters in one card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {counts[tab.key] ?? 0}
                </span>
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">{totalRecords} listings</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-200">
          <span className="text-6xl block mb-4">
            {activeTab === 'pending' ? '📭' : activeTab === 'approved' ? '📋' : '🗑️'}
          </span>
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'pending' ? 'No listings awaiting review'
             : activeTab === 'approved' ? `No approved ${title.toLowerCase()}`
             : 'No rejected listings'}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {activeTab === 'pending' ? 'New submissions will appear here.' : 'Try adjusting your search.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400 font-bold">
                  <th className="px-6 py-4">Listing</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {/* Thumbnail + title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                          {getImage(item)
                            ? <img src={getImage(item)} className="w-full h-full object-cover" alt="" onError={e => e.target.style.display='none'} />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">{categoryIcon}</div>
                          }
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 max-w-[240px] truncate text-sm">{getTitle(item)}</div>
                          {getSub(item) && <div className="text-xs text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-0.5 uppercase font-bold">{getSub(item)}</div>}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{getLoc(item)}</td>

                    <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">{getPrice(item)}</td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-2 flex-nowrap">
                        {/* Icon-only: View, Edit, Delete */}
                        <a href={`/services/${basePath}/details/${item.id}`} target="_blank" rel="noreferrer" title="View"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">👁️</a>
                        <a href={`/services/${basePath}/edit/${item.id}`} title="Edit"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors">✏️</a>
                        <button onClick={() => handleDelete(item.id)} title="Delete"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">🗑️</button>

                        {/* Primary labeled action per tab */}
                        {activeTab === 'pending' && (
                          <>
                            <button onClick={() => changeStatus(item, 'approved')}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                              ✓ Approve
                            </button>
                            <button onClick={() => changeStatus(item, 'rejected')}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                              ✗ Reject
                            </button>
                          </>
                        )}
                        {activeTab === 'approved' && (
                          <button onClick={() => changeStatus(item, 'pending')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                            ↩ Revoke
                          </button>
                        )}
                        {activeTab === 'rejected' && (
                          <button onClick={() => changeStatus(item, 'approved')}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                            ↑ Re-approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/20">
            <span className="text-sm text-gray-500 font-medium">Page <b>{page}</b> of <b>{totalPages}</b></span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-white disabled:opacity-30 transition-all">
                ← Prev
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 bg-blue-600 rounded-xl font-bold text-sm text-white hover:bg-blue-700 disabled:opacity-30 transition-all">
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100]">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${
            toast.type === 'success' ? 'bg-white border-green-400 shadow-green-100' : 'bg-white border-red-400 shadow-red-100'
          }`}>
            <span className="text-xl">{toast.type === 'success' ? '✅' : '🚨'}</span>
            <p className="font-bold text-gray-800 text-sm">{toast.msg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
