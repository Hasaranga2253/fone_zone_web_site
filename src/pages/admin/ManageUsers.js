// src/pages/admin/ManageUsers.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost/Fonezone';

export default function ManageUsers() {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Always send cookies; safely parse JSON; redirect on 401/403
  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { credentials: 'include', ...options });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* non-JSON / empty */
    }
    if (res.status === 401 || res.status === 403) {
      const err = new Error('unauthorized');
      err.code = res.status;
      err.data = data;
      throw err;
    }
    return { res, data };
  };

  // Normalize backend responses
  const extractUsers = (data) => {
    if (data?.data?.users && Array.isArray(data.data.users)) return data.data.users; // { status:'ok', data:{users:[]}}
    if (data?.success && Array.isArray(data.users)) return data.users;               // { success:true, users:[] }
    if (Array.isArray(data)) return data;                                            // raw array
    return [];
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await apiFetch(`${API_BASE}/manageusers.php?action=get`);
      const list = extractUsers(data).filter(
        (u) => (u?.email || '').toLowerCase() !== 'admin@fonezone.com'
      );
      setEmployees(list.filter((u) => (u.role || '').toLowerCase() === 'employee'));
      setUsers(list.filter((u) => (u.role || '').toLowerCase() === 'user'));
    } catch (err) {
      if (err?.code === 401 || err?.code === 403) {
        navigate('/unauthorized', { replace: true });
      } else {
        setEmployees([]);
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (email) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await apiFetch(`${API_BASE}/manageusers.php?action=delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      fetchUsers();
    } catch (err) {
      if (err?.code === 401 || err?.code === 403) {
        navigate('/unauthorized', { replace: true });
      } else {
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handlePromote = async (email, category) => {
    if (!category) return;
    try {
      await apiFetch(`${API_BASE}/manageusers.php?action=promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, category }),
      });
      fetchUsers();
    } catch (err) {
      if (err?.code === 401 || err?.code === 403) {
        navigate('/unauthorized', { replace: true });
      } else {
        alert('Failed to promote user. Please try again.');
      }
    }
  };

  const renderEmployeeTable = () => (
    <div className="glass-card p-6 max-w-5xl mx-auto mb-10">
      <h3 className="text-2xl font-bold text-center mb-4">Employee Accounts</h3>
      {loading ? (
        <p className="text-center text-gray-300">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-center text-gray-300">No employees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-white text-sm sm:text-base">
            <thead>
              <tr className="text-cyan-300 border-b border-white/20">
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={index} className="hover:bg-white/10 transition text-center">
                  <td className="px-4 py-2">{emp.username || (emp.email || '').split('@')[0]}</td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">
                    <span className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {emp.category || <span className="text-gray-400 italic">N/A</span>}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(emp.email)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded shadow"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderUserTable = () => (
    <div className="glass-card p-6 max-w-5xl mx-auto mb-10">
      <h3 className="text-2xl font-bold text-center mb-4">User Accounts</h3>
      {loading ? (
        <p className="text-center text-gray-300">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-300">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-white text-sm sm:text-base">
            <thead>
              <tr className="text-cyan-300 border-b border-white/20">
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-white/10 transition text-center">
                  <td className="px-4 py-2">{user.username || (user.email || '').split('@')[0]}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className="bg-cyan-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <select
                      onChange={(e) => {
                        handlePromote(user.email, e.target.value);
                        e.target.value = '';
                      }}
                      className="bg-gray-700 text-white px-2 py-1 rounded"
                      defaultValue=""
                    >
                      <option value="" disabled>Promote to Employee</option>
                      <option value="Repair Technician">Repair Technician</option>
                      <option value="Sales Support">Sales Support</option>
                      <option value="Delivery Driver">Delivery Driver</option>
                    </select>

                    <button
                      onClick={() => handleDelete(user.email)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded shadow"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg hover:opacity-90 transition"
        >
          <FaArrowLeft /> Admin Dashboard
        </button>
      </div>
      <h2 className="text-4xl font-bold text-center gradient-text mb-10 sm:text-5xl tracking-tight fade-in">
        Manage Registered Users
      </h2>
      {renderEmployeeTable()}
      {renderUserTable()}
    </div>
  );
}
