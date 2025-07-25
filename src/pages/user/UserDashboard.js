import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const [pendingRepair, setPendingRepair] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return;

    const allRequests = JSON.parse(localStorage.getItem('repairRequests')) || [];
    const userRequests = allRequests.filter(r => r.userId === user.email);
    const latestPending = userRequests.find(r => r.status !== 'completed');
    setPendingRepair(latestPending);
  }, [user]);

  const getProgress = (status) => {
    switch (status) {
      case 'pending': return 33;
      case 'processing': return 66;
      case 'completed': return 100;
      default: return 0;
    }
  };

  return (
     <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-blue-950 ">
      {/* Background fallback image */}
      <div
       className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: "url('/images/fallback.jpg')" }}
      ></div>
    
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-10 text-center">
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 gradient-text fade-in">👤 User Dashboard</h1>

        {user ? (
          <>
            <p className="text-xl text-white/90 mb-2">
              Welcome <span className="font-semibold text-cyan-400">{user.username}</span>
            </p>
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-6">
              Role: <span className="font-bold text-white">{user.role}</span>
            </p>

            <p className="text-white text-base mb-6">
              ✅ You are successfully logged in. Feel free to explore all our services including repair tracking, shopping, and more!
            </p>

            {/* 🔧 Live Repair Request Preview */}
            {pendingRepair && (
              <div className="bg-white/10 border border-white/20 p-4 rounded-lg text-sm mb-6">
                <p className="mb-2 font-semibold text-cyan-300">📱 Current Repair Request</p>
                <p>Device: <span className="text-white">{pendingRepair.device}</span></p>
                <p>Issue: <span className="text-white">{pendingRepair.issue}</span></p>
                <p>Technician:{" "}
                  <span className={pendingRepair.assignedTo ? 'text-emerald-400' : 'italic text-gray-400'}>
                    {pendingRepair.assignedTo || 'Not yet assigned'}
                  </span>
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Pending</span>
                    <span>Processing</span>
                    <span>Completed</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        pendingRepair.status === 'pending'
                          ? 'bg-yellow-500'
                          : pendingRepair.status === 'processing'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${getProgress(pendingRepair.status)}%` }}
                    />
                  </div>
                  <p className="text-xs text-right mt-1 text-white font-semibold capitalize">
                    Status: {pendingRepair.status}
                  </p>
                </div>
              </div>
            )}

            {/* 🧭 Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-md transition-all"
              >
                🛒 Explore Shop
              </button>
              <button
                onClick={() => navigate('/user/repair-status')}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-md transition-all"
              >
                🛠 Track Repairs
              </button>
              <button
                onClick={() => navigate('/user/repair-request')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full shadow-md transition-all"
              >
                📲 Book Repair
              </button>
            </div>
          </>
        ) : (
          <p className="text-yellow-300 mt-4">
            User data not found. Please{' '}
            <a href="/login" className="underline text-blue-400 hover:text-blue-500">login</a> to continue.
          </p>
        )}
      </div>
    </div>
  );
}
