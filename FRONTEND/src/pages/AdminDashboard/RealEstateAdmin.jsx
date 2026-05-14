import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getFullImageUrl } from '../../utils/imageHelper';

const STATUS_COLORS = {
  approved: 'bg-green-50 text-green-700 border-green-200',
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

export default function RealEstateAdmin() {
  const [listings, setListings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const [search, setSearch]       = useState('');
  const [country, setCountry]     = useState('');
  const [status, setStatus]       = useState('');
  const [page, setPage]           = useState(1);
  const [meta, setMeta]           = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page });
      if (search)  params.append('search', search);
      if (country) params.append('country', country);
      if (status)  params.append('status', status);

      const res = await api.get(`/api/realestate-admin?${params.toString()}`);
      const data = res.data;
      setListings(data.data ?? []);
      setMeta({ current_page: data.current_page, last_page: data.last_page, total: data.total });
    } catch (err) {
      showToast('Failed to load listings.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, country, status, page]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this listing?')) return;
    try {
      await api.delete(`/api/realestate/${id}`);
      setListings(prev => prev.filter(l => l.id !== id));
      showToast('Listing deleted.', 'success');
    } catch {
      showToast('Delete failed.', 'error');
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const res = await api.post(`/api/realestate/${item.id}/toggle-status`);
      if (res.data.success) {
        setListings(prev => prev.map(l => l.id === item.id ? { ...l, status: res.data.status } : l));
        showToast(`Status changed to "${res.data.status}"`, 'success');
      }
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchListings(); };

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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">🏙️</span> Real Estate Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage all India &amp; Dubai property listings.
            {meta && <span className="ml-2 text-blue-600 font-bold">{meta.total} total</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40">🔍</span>
          <input
            type="text"
            placeholder="Search title, city, agent..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <select
          value={country}
          onChange={e => { setCountry(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="">All Countries</option>
          <option value="India">🇮🇳 India</option>
          <option value="UAE">🇦🇪 UAE / Dubai</option>
          <option value="USA">🇺🇸 USA</option>
        </select>

        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-200">
          <span className="text-6xl block mb-4">🏜️</span>
          <h2 className="text-2xl font-bold text-gray-800">No Listings Found</h2>
          <p className="text-gray-400 mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Property</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Type</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Location</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Price</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {/* Property */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-100 shrink-0">
                        <img
                          src={getFullImageUrl(item.main_image) || '/img/placeholder_property.jpg'}
                          className="w-full h-full object-cover"
                          alt=""
                          onError={e => e.target.src = '/img/placeholder_property.jpg'}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 max-w-[200px] truncate">{item.title}</div>
                        <div className="text-xs text-gray-400 font-medium mt-0.5">
                          {item.bedrooms}bd · {item.bathrooms}ba · {item.area_sqft} sqft
                        </div>
                        <div className="text-xs text-gray-400">{item.agent_name || item.agent_company}</div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">
                      {item.property_type}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    <div>{item.city}</div>
                    <div className="text-xs text-gray-400">{item.country}</div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    {formatPrice(item.price, item.currency)}
                  </td>

                  {/* Status toggle */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${STATUS_COLORS[item.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
                      title={item.status === 'approved' ? 'Click to revoke approval' : 'Click to approve'}
                    >
                      {item.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <a
                        href={`/real-estate/details/${item.slug}`}
                        target="_blank" rel="noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View listing"
                      >👁️</a>
                      <Link
                        to={`/real-estate/edit/${item.id}`}
                        className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                        title="Edit listing"
                      >✏️</Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete listing"
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-400">Page {meta.current_page} of {meta.last_page}</span>
              <div className="flex gap-2">
                <button
                  disabled={meta.current_page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >← Prev</button>
                <button
                  disabled={meta.current_page === meta.last_page}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >Next →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toast */}
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
