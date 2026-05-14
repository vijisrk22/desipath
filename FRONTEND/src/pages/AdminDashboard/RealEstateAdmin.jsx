import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getFullImageUrl } from '../../utils/imageHelper';

const TABS = [
  { key: 'pending',  label: 'Pending Review',  emoji: '🕐' },
  { key: 'approved', label: 'Approved & Live',  emoji: '✅' },
  { key: 'rejected', label: 'Rejected',          emoji: '❌' },
];

const STATUS_PILL = {
  approved: 'bg-green-50 text-green-700 border border-green-200',
  pending:  'bg-amber-50 text-amber-700 border border-amber-200',
  rejected: 'bg-red-50  text-red-700  border border-red-200',
  active:   'bg-blue-50 text-blue-700 border border-blue-200',
};

export default function RealEstateAdmin() {
  const [activeTab, setActiveTab]   = useState('pending');
  const [listings, setListings]     = useState([]);
  const [counts, setCounts]         = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);
  const [search, setSearch]         = useState('');
  const [country, setCountry]       = useState('');
  const [page, setPage]             = useState(1);
  const [meta, setMeta]             = useState(null);

  // Fetch counts for all statuses (for the tab badges)
  const fetchCounts = useCallback(async () => {
    try {
      const [pending, approved, rejected] = await Promise.all([
        api.get('/api/realestate-admin?status=pending&page=1'),
        api.get('/api/realestate-admin?status=approved&page=1'),
        api.get('/api/realestate-admin?status=rejected&page=1'),
      ]);
      setCounts({
        pending:  pending.data.total  ?? 0,
        approved: approved.data.total ?? 0,
        rejected: rejected.data.total ?? 0,
      });
    } catch { /* silent */ }
  }, []);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: activeTab, page });
      if (search)  params.append('search', search);
      if (country) params.append('country', country);
      const res = await api.get(`/api/realestate-admin?${params}`);
      setListings(res.data.data ?? []);
      setMeta({ current_page: res.data.current_page, last_page: res.data.last_page, total: res.data.total });
    } catch { showToast('Failed to load listings.', 'error'); }
    finally  { setLoading(false); }
  }, [activeTab, search, country, page]);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);
  useEffect(() => { setPage(1); }, [activeTab, country]);
  useEffect(() => { fetchListings(); }, [fetchListings]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const changeStatus = async (item, newStatus) => {
    try {
      await api.put(`/api/realestate/${item.id}`, { status: newStatus });
      setListings(prev => prev.filter(l => l.id !== item.id));
      setCounts(prev => ({
        ...prev,
        [item.status]: Math.max(0, prev[item.status] - 1),
        [newStatus]:   (prev[newStatus] ?? 0) + 1,
      }));
      showToast(`"${item.title.substring(0, 30)}..." marked as ${newStatus}.`);
    } catch { showToast('Status update failed.', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this listing?')) return;
    try {
      await api.delete(`/api/realestate/${id}`);
      setListings(prev => prev.filter(l => l.id !== id));
      setCounts(prev => ({ ...prev, [activeTab]: Math.max(0, prev[activeTab] - 1) }));
      showToast('Listing deleted.');
    } catch { showToast('Delete failed.', 'error'); }
  };

  const formatPrice = (price, currency) => {
    if (!price) return '—';
    if (currency === 'INR') {
      if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
      if (price >= 100000)   return `₹${(price / 100000).toFixed(2)} L`;
    }
    if (currency === 'AED') return `AED ${Number(price).toLocaleString()}`;
    return `$${Number(price).toLocaleString()}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <span className="text-4xl">🏙️</span> Real Estate Management
        </h1>
        <p className="text-gray-500 font-medium mt-1">Moderate India &amp; Dubai property listings.</p>
      </div>

      {/* Tab Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
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
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Filters inside card */}
        <div className="flex flex-wrap gap-3 items-center p-4 bg-gray-50 border-b border-gray-100">
          <div className="flex-1 min-w-[200px] relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search title, city, agent..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchListings()}
              className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">All Countries</option>
            <option value="India">🇮🇳 India</option>
            <option value="UAE">🇦🇪 UAE / Dubai</option>
            <option value="USA">🇺🇸 USA</option>
          </select>
          <button
            onClick={() => { setPage(1); fetchListings(); }}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
          >Search</button>
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
            {activeTab === 'pending' ? '📭' : activeTab === 'approved' ? '🏘️' : '🗑️'}
          </span>
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'pending' ? 'No listings awaiting review' :
             activeTab === 'approved' ? 'No approved listings' : 'No rejected listings'}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {activeTab === 'pending' ? 'All caught up! New submissions will appear here.' : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {/* Property thumbnail + info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        <img
                          src={getFullImageUrl(item.main_image) || '/img/placeholder_property.jpg'}
                          className="w-full h-full object-cover"
                          alt=""
                          onError={e => e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=60'}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 max-w-[220px] truncate text-sm">{item.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.bedrooms}bd · {item.bathrooms}ba · {item.area_sqft} sqft</div>
                        <div className="text-xs text-gray-400">{item.agent_name || item.agent_company}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase whitespace-nowrap">
                      {item.property_type}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800 whitespace-nowrap">{item.city}</div>
                    <div className="text-xs text-gray-400">{item.country}</div>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                    {formatPrice(item.price, item.currency)}
                  </td>

                  {/* Actions — icon buttons + one primary labeled button */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-2 flex-nowrap">
                      {/* Icon-only secondary actions */}
                      <a href={`/real-estate/details/${item.slug}`} target="_blank" rel="noreferrer"
                        title="View listing"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-base">👁️</a>

                      <Link to={`/real-estate/edit/${item.id}`} title="Edit listing"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors text-base">✏️</Link>

                      <button onClick={() => handleDelete(item.id)} title="Delete listing"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors text-base">🗑️</button>

                      {/* Primary labeled action — changes by tab */}
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
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-400 font-medium">Page {meta.current_page} of {meta.last_page} · {meta.total} total</span>
              <div className="flex gap-2">
                <button disabled={meta.current_page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
                  ← Prev
                </button>
                <button disabled={meta.current_page === meta.last_page} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
                  Next →
                </button>
              </div>
            </div>
          )}
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
