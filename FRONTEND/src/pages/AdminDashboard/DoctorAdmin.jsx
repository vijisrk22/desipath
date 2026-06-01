import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

export default function DoctorAdmin() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '', 'active', 'pending'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchDoctors();
  }, [page, statusFilter]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/doctors`, {
        params: {
          search,
          status: statusFilter,
          page
        }
      });
      if (res.data) {
        setDoctors(res.data.data || []);
        setTotalPages(res.data.last_page || 1);
        setTotalItems(res.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load doctor listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDoctors();
  };

  const handleToggleApproval = async (doctor) => {
    try {
      const res = await api.post(`/api/admin/doctors/${doctor.doctor_id}/toggle-approval`);
      if (res.data.success) {
        toast.success(
          res.data.profile_status === 'active' 
            ? `Approved Dr. ${doctor.first_name} ${doctor.last_name}'s listing!` 
            : `Revoked approval for Dr. ${doctor.first_name} ${doctor.last_name}'s listing.`
        );
        fetchDoctors();
      }
    } catch (err) {
      toast.error('Failed to update listing status');
      console.error(err);
    }
  };

  const handleDelete = async (doctor) => {
    if (!window.confirm(`Are you absolutely sure you want to delete Dr. ${doctor.first_name} ${doctor.last_name}'s listing? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await api.delete(`/api/doctors/${doctor.doctor_id}`);
      if (res.data.success) {
        toast.success(`Deleted Dr. ${doctor.first_name} ${doctor.last_name}'s listing.`);
        fetchDoctors();
      }
    } catch (err) {
      toast.error('Failed to delete doctor listing');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm text-slate-800">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-dmsans flex items-center gap-2 text-slate-800">
            <span>🩺</span> Desi Doctors Moderation Portal
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">
            Manage practice directory listings, approve postings, edit details, or revoke status.
          </p>
        </div>
        <Link 
          to="/desi-doctors/post"
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2.5 px-5 rounded-full shadow-sm flex items-center gap-1 transition-all"
        >
          <span>➕</span> Add New Doctor Ad
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-6 relative">
          <input 
            type="text"
            placeholder="Search by doctor name, specialty, or clinic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 font-medium"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 font-semibold cursor-pointer"
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
          <CircularProgress size={50} sx={{ color: '#0284c7' }} />
          <p className="mt-4 text-slate-500 font-medium">Querying doctor directory...</p>
        </div>
      ) : doctors.length > 0 ? (
        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">S.No</th>
                <th className="py-3 px-4">Doctor Name</th>
                <th className="py-3 px-4">Primary Specialty</th>
                <th className="py-3 px-4">Zipcode</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, index) => {
                const sno = (page - 1) * 20 + index + 1;
                const isApproved = doc.profile_status === 'active';
                return (
                  <tr key={doc.doctor_id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="py-4 px-4 font-bold text-slate-400 font-mono">{sno}</td>
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-800">Dr. {doc.first_name} {doc.last_name}, {doc.credential}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{doc.practice_name || 'Solo Practice'}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-600">{doc.primary_specialty}</td>
                    <td className="py-4 px-4 font-bold text-slate-500 font-mono">{doc.primary_address_zip || 'N/A'}</td>
                    <td className="py-4 px-4 font-bold text-slate-500">{doc.phone || 'N/A'}</td>
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
                          onClick={() => handleToggleApproval(doc)}
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
                          href={`/doctors/${doc.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-sky-50 text-sky-700 border border-sky-100 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-all"
                        >
                          View
                        </a>

                        {/* Edit Link */}
                        <Link
                          to={`/desi-doctors/edit/${doc.doctor_id}`}
                          className="bg-amber-50 text-amber-700 border border-amber-100 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-all"
                        >
                          Edit
                        </Link>

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDelete(doc)}
                          className="bg-red-50 text-red-700 border border-red-100 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all"
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
          <div className="text-5xl mb-3">🩺</div>
          <h3 className="text-lg font-bold text-slate-700">No Doctor Listings Found</h3>
          <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or changing status filter to locate practice registrations.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Page {page} of {totalPages} ({totalItems} total doctors)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-1.5 px-3 rounded-lg transition-all disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-1.5 px-3 rounded-lg transition-all disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
