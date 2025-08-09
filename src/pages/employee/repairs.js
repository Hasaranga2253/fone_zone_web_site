// src/pages/employee/Repairs.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = (process.env.REACT_APP_REPAIR_TECH_API || 'http://localhost/Fonezone/repairtech').replace(/\/+$/, '');

export default function Repairs() {
  const [repairs, setRepairs] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // employee object you already store

  const loadRepairs = async () => {
    if (!(user?.role === 'employee' && user?.category?.toLowerCase() === 'repair technician')) {
      setRepairs([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/list_repairs.php?tech_email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.status === 'ok') setRepairs(data.repairs || []);
      else toast.error(data.error || 'Failed to load repairs');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load repairs');
    }
  };

  useEffect(() => {
    loadRepairs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const getNextStatus = (status) =>
    status === 'pending' ? 'processing' : status === 'processing' ? 'completed' : 'completed';

  const assignToMe = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/assign_to_me.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repair_id: id, tech_email: user.email }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        toast.success('✅ Assigned to you and started processing');
        await loadRepairs();
      } else {
        toast.error(data.error || 'Assignment failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Assignment failed');
    }
  };

  const updateStatus = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/advance_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repair_id: id, tech_email: user.email }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        const current = repairs.find((r) => r.id === id)?.status;
        toast.success(`🔄 Status updated to ${data.next || getNextStatus(current)}`);
        await loadRepairs();
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white px-6 py-12 font-sans">
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
        {/* Title row with Back button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-cyan-400">Repair Technician Panel</h2>
          <button
            onClick={() => navigate('/employee/dashboard')}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-full shadow-lg transition duration-300"
          >
            ← Back to Dashboard
          </button>
        </div>

        {repairs.length === 0 ? (
          <p className="text-center text-gray-400">No repair jobs available or assigned.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base border border-white/10 rounded overflow-hidden">
              <thead>
                <tr className="text-cyan-300 bg-white/10 border-b border-white/20">
                  <th className="px-4 py-2 text-left">📱 Device</th>
                  <th className="px-4 py-2 text-left">📝 Issue</th>
                  <th className="px-4 py-2 text-left">👤 User</th>
                  <th className="px-4 py-2 text-center">⚙️ Status</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((r) => (
                  <tr key={r.id} className="hover:bg-white/10 transition-all border-b border-white/5">
                    <td className="px-4 py-2">{r.device}</td>
                    <td className="px-4 py-2">{r.issue}</td>
                    <td className="px-4 py-2">{r.username}</td>
                    <td className="px-4 py-2 text-center capitalize">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-bold ${
                          r.status === 'pending'
                            ? 'bg-yellow-400 text-black'
                            : r.status === 'processing'
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {!r.assigned_to ? (
                        <button
                          onClick={() => assignToMe(r.id)}
                          className="bg-purple-600 hover:bg-purple-700 px-3 py-1 text-white text-sm rounded-full"
                        >
                          Assign to Me
                        </button>
                      ) : r.status !== 'completed' ? (
                        <button
                          onClick={() => updateStatus(r.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 text-white text-sm rounded-full"
                        >
                          Mark as {getNextStatus(r.status)}
                        </button>
                      ) : (
                        <span className="text-green-300 font-semibold text-sm">✅ Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
