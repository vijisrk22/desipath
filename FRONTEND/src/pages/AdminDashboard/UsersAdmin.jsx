import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 100,
    total: 0
  });

  useEffect(() => {
    fetchUsers(1, searchQuery);
  }, [searchQuery]);

  const fetchUsers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/api/users?page=${page}&search=${search}`);
      setUsers(res.data.data || []);
      setPagination({
        currentPage: res.data.current_page || 1,
        lastPage: res.data.last_page || 1,
        perPage: res.data.per_page || 100,
        total: res.data.total || 0
      });
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Registered Users</h1>
          <p className="text-gray-500 font-medium mt-1">Full directory of members signed up on Desipath.</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); setSearchQuery(searchInput); }} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-200">
          <span className="text-6xl block mb-4">🏠</span>
          <h2 className="text-2xl font-bold text-gray-800">No Users Yet</h2>
          <p className="text-gray-500">The user directory is currently empty.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider w-16">S.No</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">User</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Joined Date</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Last Login</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => {
                  const serialNo = (pagination.currentPage - 1) * pagination.perPage + index + 1;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-400">
                        {serialNo}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-700">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.phone || 'No phone provided'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-semibold">
                        {user.last_login_at ? (
                          new Date(user.last_login_at).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        ) : (
                          <span className="text-gray-400 italic font-normal">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.lastPage > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-sm gap-4">
              <div className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-800">{(pagination.currentPage - 1) * pagination.perPage + 1}</span> to{' '}
                <span className="font-bold text-gray-800">
                  {Math.min(pagination.currentPage * pagination.perPage, pagination.total)}
                </span>{' '}
                of <span className="font-bold text-gray-800">{pagination.total}</span> users
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => fetchUsers(pagination.currentPage - 1, searchQuery)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-gray-50 rounded-xl transition-all border border-gray-200"
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchUsers(page, searchQuery)}
                    className={`w-9 h-9 flex items-center justify-center text-sm font-bold rounded-xl transition-all ${
                      pagination.currentPage === page
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                        : 'text-gray-600 hover:bg-gray-50 border border-gray-200 bg-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => fetchUsers(pagination.currentPage + 1, searchQuery)}
                  disabled={pagination.currentPage === pagination.lastPage}
                  className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-gray-50 rounded-xl transition-all border border-gray-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
