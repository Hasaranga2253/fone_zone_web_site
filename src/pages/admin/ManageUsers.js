import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function ManageUsers() {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    const filtered = allUsers.filter(user => user.email !== 'admin@fonezone.com');

    setEmployees(filtered.filter(u => u.role === 'employee'));
    setUsers(filtered.filter(u => u.role === 'user'));
  }, []);

  const handleDelete = (email, role) => {
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const updated = allUsers.filter(user => user.email !== email);
    localStorage.setItem('registeredUsers', JSON.stringify(updated));

    if (role === 'employee') {
      setEmployees(prev => prev.filter(u => u.email !== email));
    } else {
      setUsers(prev => prev.filter(u => u.email !== email));
    }
  };

  const handlePromote = (email, category) => {
    if (!category) return;

    const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const updatedUsers = allUsers.map(u =>
      u.email === email ? { ...u, role: 'employee', category } : u
    );

    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    const filtered = updatedUsers.filter(user => user.email !== 'admin@fonezone.com');
    setEmployees(filtered.filter(u => u.role === 'employee'));
    setUsers(filtered.filter(u => u.role === 'user'));
  };

  const renderEmployeeTable = () => (
    <div className="glass-card p-6 max-w-5xl mx-auto mb-10">
      <h3 className="text-2xl font-bold text-center mb-4">Employee Accounts</h3>
      {employees.length === 0 ? (
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
                  <td className="px-4 py-2">{emp.username || emp.email.split('@')[0]}</td>
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
                      onClick={() => handleDelete(emp.email, emp.role)}
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
      {users.length === 0 ? (
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
                  <td className="px-4 py-2">{user.username || user.email.split('@')[0]}</td>
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
                      onClick={() => handleDelete(user.email, user.role)}
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
      {/* Navigate to Dashboard */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg hover:opacity-90 transition"
        >
          <FaArrowLeft /> Admin Dashboard
        </button>
      </div>

      <h2 className="text-4xl font-bold text-center gradient-text mb-10 sm:text-5xl tracking-tight gradient-text fade-in">
        Manage Registered Users
      </h2>

      {renderEmployeeTable()}
      {renderUserTable()}
    </div>
  );
}
