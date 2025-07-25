import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RepairStatus() {
  const [repairs, setRepairs] = useState([]);
  const navigate = useNavigate();

  // ❗ Get user only once outside the component lifecycle
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // ⚠️ Protect against missing user
    if (!user) return;

    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
    const userRepairs = allRepairs.filter((r) => r.user === user.email);
    setRepairs(userRepairs);
  }, []); // ✅ run once on mount only

  const getProgress = (status) => {
    switch (status) {
      case 'pending':
        return 33;
      case 'processing':
        return 66;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const handleNewRequest = () => {
    navigate('/user/repair-request');
  };

  // 👮 Guard if user not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1e2f] via-[#2e2e4f] to-black text-white px-4">
        <p className="text-center text-lg text-red-300">🔐 Please log in to view your repair status.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-blue-950 ">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: "url('/images/fallback.jpg')" }}
      />
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10">

        <h2 className="text-center text-cyan-400 mb-8 text-4xl sm:text-5xl font-extrabold tracking-tight  gradient-text fade-in">
           Repair Request Status
        </h2>

        {repairs.length === 0 ? (
          <div className="text-center space-y-5">
            <p className="text-gray-300 text-lg">No repair requests found for your account.</p>
            <button
              onClick={handleNewRequest}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all shadow"
            >
              📲 Book a Repair
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {repairs.map((r) => (
              <div
                key={r.id}
                className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  {/* Repair info */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{r.device}</h3>
                    <p className="text-sm text-gray-300">🛠 Issue: {r.issue}</p>
                    <p className="text-sm mt-2">
                      👨‍🔧 Technician:{' '}
                      <span className={r.assignedTo ? 'text-emerald-400' : 'italic text-gray-400'}>
                        {r.assignedTo || 'Not yet assigned'}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      📅 Submitted: {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full sm:w-1/2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1 px-1">
                      <span>Pending</span>
                      <span>Processing</span>
                      <span>Completed</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          r.status === 'pending'
                            ? 'bg-yellow-400'
                            : r.status === 'processing'
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${getProgress(r.status)}%` }}
                      />
                    </div>
                    <p className="text-xs text-right mt-1 text-white font-semibold capitalize">
                      Status: {r.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
