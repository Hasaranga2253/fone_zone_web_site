import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function NewRepairRequest() {
  const [device, setDevice] = useState('');
  const [issue, setIssue] = useState('');
  const [existingRequest, setExistingRequest] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return;
    const allRequests = JSON.parse(localStorage.getItem('repairs')) || [];
    const userPending = allRequests.find(
      (r) => r.user === user.email && r.status === 'pending'
    );
    if (userPending) setExistingRequest(userPending);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('🔒 Please login to submit a repair request.');
      return;
    }

    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    const technicians = allUsers.filter(
      (u) => u.role === 'employee' && u.category?.toLowerCase() === 'repair technician'
    );

    const assignedTo = technicians.length > 0
      ? technicians[Math.floor(Math.random() * technicians.length)].email
      : null;

    const newRepair = {
      id: Date.now(),
      user: user.email,
      username: user.username,
      device,
      issue,
      assignedTo,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('repairs', JSON.stringify([...allRepairs, newRepair]));

    toast.success(
      `✅ Repair request submitted${assignedTo ? ` — Assigned to ${assignedTo}` : '! Awaiting technician'}`,
      { duration: 4000 }
    );

    navigate('/user/repair-status');
  };

  const handleCancel = () => {
    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
    const updated = allRepairs.filter(r => r.id !== existingRequest.id);
    localStorage.setItem('repairs', JSON.stringify(updated));
    setExistingRequest(null);
    toast('❌ Repair request canceled.', { icon: '🗑' });
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-blue-950">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: "url('/images/fallback.jpg')" }}
      />
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10">
        <h2 className=" text-center text-cyan-400 mb-8 text-4xl sm:text-5xl font-extrabold tracking-tight  gradient-text fade-in"> Book a Repair</h2>

        {existingRequest ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">You already have a pending request:</p>
            <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-1 text-sm">
              <p><strong>📱 Device:</strong> {existingRequest.device}</p>
              <p><strong>📝 Issue:</strong> {existingRequest.issue}</p>
              <p><strong>⚙️ Status:</strong> <span className="text-yellow-400">{existingRequest.status}</span></p>
              <p><strong>👨‍🔧 Technician:</strong> {existingRequest.assignedTo || 'Not yet assigned'}</p>
            </div>
            <button
              onClick={handleCancel}
              className="w-full py-2 rounded-full bg-red-600 hover:bg-red-700 font-semibold transition"
            >
              ❌ Cancel Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Device Name"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-300"
              required
            />
            <textarea
              placeholder="Describe the issue..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-300"
              required
            />
            <button
              type="submit"
              className="w-full py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 font-semibold transition"
            >
              Submit Repair Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
