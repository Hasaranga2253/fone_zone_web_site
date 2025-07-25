import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Repairs() {
  const [repairs, setRepairs] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];

    if (user?.role === 'employee' && user?.category?.toLowerCase() === 'repair technician') {
      const visibleRepairs = allRepairs.filter(
        (r) =>
          r.assignedTo === user.email ||
          (!r.assignedTo && r.status === 'pending')
      );
      setRepairs(visibleRepairs);
    } else {
      setRepairs([]);
    }
  }, [user?.email]);

  const getNextStatus = (status) => {
    if (status === 'pending') return 'processing';
    if (status === 'processing') return 'completed';
    return 'completed';
  };

  const assignToMe = (id) => {
    const updated = repairs.map((r) => {
      if (r.id === id && !r.assignedTo) {
        return { ...r, assignedTo: user.email, status: 'processing' };
      }
      return r;
    });
    setRepairs(updated);

    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
    const final = allRepairs.map((r) =>
      r.id === id && !r.assignedTo
        ? { ...r, assignedTo: user.email, status: 'processing' }
        : r
    );
    localStorage.setItem('repairs', JSON.stringify(final));
    toast.success('✅ Assigned to you and started processing');
  };

  const updateStatus = (id) => {
    const updated = repairs.map((r) => {
      if (r.id === id && r.status !== 'completed') {
        const next = getNextStatus(r.status);
        return { ...r, status: next };
      }
      return r;
    });
    setRepairs(updated);

    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
    const final = allRepairs.map((r) =>
      r.id === id && r.assignedTo === user.email
        ? { ...r, status: getNextStatus(r.status) }
        : r
    );
    localStorage.setItem('repairs', JSON.stringify(final));
    toast.success(`🔄 Status updated to ${getNextStatus(
      repairs.find((r) => r.id === id)?.status
    )}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white px-6 py-12 font-sans">
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-cyan-400 mb-8">
           Repair Technician Panel
        </h2>

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
                      {!r.assignedTo ? (
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
