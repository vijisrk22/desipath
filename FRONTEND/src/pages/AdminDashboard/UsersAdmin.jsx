import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users'); // Assuming this endpoint exists, or I will create it.
      setUsers(res.data || []);
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">User</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Contact Info</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Joined Date</th>
                <th className="px-6 py-4 font-bold text-gray-400 uppercase text-xs tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
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
                  <td className="px-6 py-4 text-right">
                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
