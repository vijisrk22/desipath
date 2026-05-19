import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

export default function AttorneyAdmin() {
  const [attorneys, setAttorneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '', 'active', 'pending'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchAttorneys();
  }, [page, statusFilter]);

  const fetchAttorneys = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/attorneys`, {
        params: {
          search,
          status: statusFilter,
          page
        }
      });
      if (res.data) {
        setAttorneys(res.data.data || []);
        setTotalPages(res.data.last_page || 1);
        setTotalItems(res.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load attorney listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAttorneys();
  };

  const handleToggleApproval = async (attorney) => {
    try {
      const res = await api.post(`/api/admin/attorneys/${attorney.attorney_id}/toggle-approval`);
      if (res.data.success) {
        toast.success(
          res.data.profile_status === 'active' 
            ? `Approved ${attorney.first_name} ${attorney.last_name}'s listing!` 
            : `Revoked approval for ${attorney.first_name} ${attorney.last_name}'s listing.`
        );
        fetchAttorneys();
      }
    } catch (err) {
      toast.error('Failed to update listing status');
      console.error(err);
    }
  };

  const handleToggleLegalPlanVerification = async (attorney, planName, currentVerified) => {
    try {
      const res = await api.post(`/api/admin/attorneys/${attorney.attorney_id}/verify-legal-plan`, {
        plan_name: planName,
        verify: !currentVerified
      });
      if (res.data.success) {
        toast.success(`Updated verification status for ${planName}.`);
        fetchAttorneys();
      }
    } catch (err) {
      toast.error('Failed to update legal plan verification');
      console.error(err);
    }
  };

  const handleDelete = async (attorney) => {
    if (!window.confirm(`Are you absolutely sure you want to delete ${attorney.first_name} ${attorney.last_name}'s listing? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await api.delete(`/api/attorneys/${attorney.attorney_id}`);
      if (res.data.success) {
        toast.success(`Deleted ${attorney.first_name} ${attorney.last_name}'s listing.`);
        fetchAttorneys();
      }
    } catch (err) {
      toast.error('Failed to delete attorney listing');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm text-slate-800 font-dmsans">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <span>⚖️</span> Desi Attorneys Moderation Portal
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">
            Manage legal practice directory listings, approve postings, edit details, or verify plan badges.
          </p>
        </div>
        <Link 
          to="/desi-attorneys/post"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-5 rounded-full shadow-sm flex items-center gap-1 transition-all"
        >
          <span>➕</span> Add New Attorney Ad
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-6 relative">
          <input 
            type="text"
            placeholder="Search by attorney name, city, or law school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 font-medium"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 font-semibold cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active (Approved)</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm py-2.5 rounded-xl transition-all"
          >
            🔍 Search Directory
          </button>
        </div>
      </form>

      {/* Main Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <CircularProgress size={50} sx={{ color: '#b45309' }} />
          <p className="mt-4 text-slate-500 font-medium">Querying attorney directory...</p>
        </div>
      ) : attorneys.length > 0 ? (
        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">S.No</th>
                <th className="py-3 px-4">Attorney Name</th>
                <th className="py-3 px-4">Practice Areas</th>
                <th className="py-3 px-4">State Licensed</th>
                <th className="py-3 px-4">Legal Plans</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attorneys.map((attorney, index) => {
                const sno = (page - 1) * 20 + index + 1;
                const isApproved = attorney.profile_status === 'active';
                return (
                  <tr key={attorney.attorney_id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="py-4 px-4 font-bold text-slate-400 font-mono">{sno}</td>
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-800">{attorney.first_name} {attorney.last_name}, {attorney.law_degree}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{attorney.law_school || 'Law Graduate'}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-600">
                      {attorney.practice_areas_json?.slice(0, 2).join(', ') || 'N/A'}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-500 font-mono">
                      {attorney.states_licensed_json?.map(s => s.state).join(', ') || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        {attorney.legal_plans_json && attorney.legal_plans_json.length > 0 ? (
                          attorney.legal_plans_json.map((plan, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleToggleLegalPlanVerification(attorney, plan.plan_name, !!plan.verified)}
                              className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase text-left w-fit border hover:opacity-85 ${
                                plan.verified
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {plan.plan_name}: {plan.verified ? 'Verified' : 'Pending'}
                            </button>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                        isApproved 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Approval Action */}
                        <button
                          onClick={() => handleToggleApproval(attorney)}
                          className={`font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                            isApproved
                              ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                              : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          {isApproved ? 'Revoke' : 'Approve'}
                        </button>

                        {/* View Profile */}
                        <a
                          href={`/attorneys/${attorney.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
                        >
                          View
                        </a>

                        {/* Edit Profile */}
                        <Link
                          to={`/desi-attorneys/edit/${attorney.attorney_id}`}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
                        >
                          Edit
                        </Link>

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDelete(attorney)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div className="text-4xl mb-2">⚖️</div>
          <p className="text-slate-400 font-bold text-sm">No attorney listings registered in directory.</p>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 border-t border-slate-100 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-slate-500 font-mono">
            Page {page} of {totalPages} ({totalItems} Listings)
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
