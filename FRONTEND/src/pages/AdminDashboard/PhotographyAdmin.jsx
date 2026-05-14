import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { getFullImageUrl } from '../../utils/imageHelper';

const TABS = [
  { key: 'pending',  label: 'Pending Review', emoji: '🕐' },
  { key: 'active',   label: 'Approved & Live', emoji: '✅' },
  { key: 'inactive', label: 'Inactive',         emoji: '❌' },
];

export default function PhotographyAdmin() {
  const [activeTab, setActiveTab] = useState('pending');
  const [listings, setListings]   = useState([]);
  const [counts, setCounts]       = useState({ pending: 0, active: 0, inactive: 0 });
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [search, setSearch]       = useState('');

  const fetchCounts = useCallback(async () => {
    try {
      const [p, a, i] = await Promise.all([
        api.get('/api/photography/search?admin=true&status=pending'),
        api.get('/api/photography/search?admin=true&status=active'),
        api.get('/api/photography/search?admin=true&status=inactive'),
      ]);
      setCounts({
        pending:  p.data.data?.total  ?? (p.data.data?.length  ?? 0),
        active:   a.data.data?.total  ?? (a.data.data?.length  ?? 0),
        inactive: i.data.data?.total  ?? (i.data.data?.length  ?? 0),
      });
    } catch { /* silent */ }
  }, []);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/photography/search?admin=true&status=${activeTab}&q=${search}`);
      if (res.data.success) setListings(res.data.data?.data ?? res.data.data ?? []);
    } catch { showToast('Failed to load listings.', 'error'); }
    finally  { setLoading(false); }
  }, [activeTab, search]);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);
  useEffect(() => { fetchListings(); }, [fetchListings]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const changeStatus = async (item, newStatus) => {
    try {
      const res = await api.post(`/api/photography/toggle-status/${item.id}`);
      if (res.data.success) {
        const newSt = res.data.status;
        setListings(prev => prev.filter(l => l.id !== item.id));
        setCounts(prev => ({
          ...prev,
          [item.status]: Math.max(0, (prev[item.status] ?? 1) - 1),
          [newSt]: (prev[newSt] ?? 0) + 1,
        }));
        showToast(`Listing is now "${newSt}".`);
      }
    } catch { showToast('Failed to update status.', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this listing?')) return;
    try {
      await api.delete(`/api/photography/delete/${id}`);
      setListings(prev => prev.filter(l => l.id !== id));
      setCounts(prev => ({ ...prev, [activeTab]: Math.max(0, prev[activeTab] - 1) }));
      showToast('Listing deleted.');
    } catch { showToast('Delete failed.', 'error'); }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <span className="text-4xl">📸</span> Photography Management
        </h1>
        <p className="text-gray-500 font-medium mt-1">Review and moderate all photographer profiles.</p>
      </div>

      {/* Tab bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors relative ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}>
                {tab.label}
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>{counts[tab.key] ?? 0}</span>
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" placeholder="Search photographers..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
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
            {activeTab === 'pending' ? '📭' : activeTab === 'active' ? '📷' : '🗑️'}
          </span>
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'pending' ? 'No profiles awaiting review' : activeTab === 'active' ? 'No active photographers' : 'No inactive listings'}
          </h2>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400 font-bold">
                  <th className="px-6 py-4">Photographer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                          <img src={getFullImageUrl(item.profile_photo)} className="w-full h-full object-cover" alt=""
                            onError={e => e.target.src = '/img/photography/default_profile.png'} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                          <div className="text-xs text-gray-400">{item.experience_years}y experience</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase whitespace-nowrap">
                        {item.service_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {item.locations?.[0]?.city}, {item.locations?.[0]?.state}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-2 flex-nowrap">
                        <a href={`/services/photography/details/${item.id}`} target="_blank" rel="noreferrer" title="View"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">👁️</a>
                        <a href={`/services/photography/edit/${item.id}`} title="Edit"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors">✏️</a>
                        <button onClick={() => handleDelete(item.id)} title="Delete"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">🗑️</button>

                        {activeTab === 'pending' && (
                          <button onClick={() => changeStatus(item, 'active')}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                            ✓ Approve
                          </button>
                        )}
                        {activeTab === 'active' && (
                          <button onClick={() => changeStatus(item, 'inactive')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                            ↩ Revoke
                          </button>
                        )}
                        {activeTab === 'inactive' && (
                          <button onClick={() => changeStatus(item, 'active')}
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
        </div>
      )}

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
