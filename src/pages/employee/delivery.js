import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeliveryJobs() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'employee' || user.category?.toLowerCase() !== 'delivery driver') {
      navigate('/login');
    } else {
      const all = JSON.parse(localStorage.getItem('deliveries')) || [];
      const assigned = all.filter(d => d.assignedTo === user.email);
      setDeliveries(assigned);
      setLoading(false);
    }
  }, [navigate]);

  const getNextStatus = (status) => {
    if (status === 'pending') return 'delivering';
    if (status === 'delivering') return 'delivered';
    return 'delivered';
  };

  const updateStatus = (id) => {
    const updated = deliveries.map(d => {
      if (d.id === id && d.status !== 'delivered') {
        return { ...d, status: getNextStatus(d.status) };
      }
      return d;
    });

    setDeliveries(updated);

    const all = JSON.parse(localStorage.getItem('deliveries')) || [];
    const final = all.map(d =>
      d.id === id && d.assignedTo === user.email
        ? { ...d, status: getNextStatus(d.status) }
        : d
    );

    localStorage.setItem('deliveries', JSON.stringify(final));
  };

  // 🧮 Count Summary
  const pendingCount = deliveries.filter(d => d.status === 'pending').length;
  const deliveringCount = deliveries.filter(d => d.status === 'delivering').length;
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white p-6">
      <div className="max-w-6xl mx-auto glass-card p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">🚚 Assigned Deliveries</h2>

        {/* 📊 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-500/20 border border-yellow-400 text-yellow-300 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold">⏳ Pending</h3>
            <p className="text-3xl font-bold mt-2">{pendingCount}</p>
          </div>
          <div className="bg-blue-500/20 border border-blue-400 text-blue-300 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold">🚚 Delivering</h3>
            <p className="text-3xl font-bold mt-2">{deliveringCount}</p>
          </div>
          <div className="bg-green-500/20 border border-green-400 text-green-300 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold">✅ Delivered</h3>
            <p className="text-3xl font-bold mt-2">{deliveredCount}</p>
          </div>
        </div>

        {/* 📦 Delivery Table */}
        {loading ? (
          <p className="text-center text-gray-400">Loading deliveries...</p>
        ) : deliveries.length === 0 ? (
          <p className="text-center text-gray-400">No deliveries assigned to you.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-white text-sm sm:text-base border border-white/10 rounded-lg">
              <thead className="bg-white/10">
                <tr className="text-cyan-300 uppercase text-sm">
                  <th className="px-4 py-2 text-left">Delivery ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map(d => (
                  <tr key={d.id} className="hover:bg-white/10 border-b border-white/10 transition">
                    <td className="py-2 px-4">{d.id}</td>
                    <td className="py-2 px-4">{d.customer}</td>
                    <td className="py-2 px-4">{d.address}</td>
                    <td className="py-2 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${d.status === 'pending' ? 'bg-yellow-500 text-black' :
                          d.status === 'delivering' ? 'bg-blue-500' :
                          'bg-green-600'}
                      `}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {d.status !== 'delivered' ? (
                        <button
                          onClick={() => updateStatus(d.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-white text-sm transition"
                        >
                          Mark as {getNextStatus(d.status)}
                        </button>
                      ) : (
                        <span className="text-green-400 font-semibold text-sm">Delivered</span>
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
