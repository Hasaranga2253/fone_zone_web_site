// src/pages/user/UserDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTools, FaShoppingCart, FaUser, FaCog, FaPlus } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';

const API_BASE = (process.env.REACT_APP_USER_DASH_API || 'http://localhost/Fonezone/userdashboard').replace(/\/+$/, '');

// ---- helpers (same visuals you had)
const getProgress = (s) => (s === 'pending' ? 33 : s === 'processing' ? 66 : s === 'completed' ? 100 : 0);
const getStatusColor = (s) =>
  s === 'pending' ? 'bg-yellow-500' : s === 'processing' ? 'bg-blue-500' : s === 'completed' ? 'bg-green-500' : 'bg-gray-500';
const getStatusText = (s) =>
  s === 'pending' ? 'Pending Assignment' : s === 'processing' ? 'In Progress' : s === 'completed' ? 'Completed' : 'Status Unknown';

// ---- header
const DashboardHeader = ({ user }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-3">{user.username}'s Dashboard</h1>
      <p className="text-gray-400 text-sm">Welcome back to your repair management portal</p>
    </div>
  </div>
);

// ---- tabs
const NavigationTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex border-b border-gray-700 mb-6">
    {['dashboard', 'repairs', 'new-repair'].map((tab) => (
      <button
        key={tab}
        className={`px-4 py-2 font-medium ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
        onClick={() => setActiveTab(tab)}
      >
        {tab === 'dashboard' ? 'Dashboard' : tab === 'repairs' ? 'My Repairs' : 'New Repair'}
      </button>
    ))}
  </div>
);

// ---- dashboard tab
const DashboardTab = ({ user, pendingRepair, repairs, setActiveTab, navigate }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Account Overview */}
    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaUser className="text-blue-400" /> Account Overview
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-700 pb-3">
            <span className="text-gray-400">Member Since</span>
            <span className="font-medium">August 2025</span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-3">
            <span className="text-gray-400">Total Repairs</span>
            <span className="font-medium">{repairs.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Completed Repairs</span>
            <span className="font-medium">{repairs.filter((r) => r.status === 'completed').length}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaCog className="text-blue-400" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab('new-repair')}
            className="p-4 bg-gray-700/50 hover:bg-blue-600/20 border border-gray-600 hover:border-blue-500 rounded-lg flex flex-col items-center"
          >
            <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <FaTools className="text-blue-400" />
            </div>
            <span>Book Repair</span>
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="p-4 bg-gray-700/50 hover:bg-green-600/20 border border-gray-600 hover:border-green-500 rounded-lg flex flex-col items-center"
          >
            <div className="bg-green-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <FaShoppingCart className="text-green-400" />
            </div>
            <span>Shop Now</span>
          </button>
        </div>
      </div>

      {/* Repair Status */}
      <div className="md:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaTools className="text-blue-400" /> Repair Status
          </h2>
          {pendingRepair && (
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(pendingRepair.status)}`}>
              {getStatusText(pendingRepair.status)}
            </span>
          )}
        </div>
        {pendingRepair ? (
          <div>
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 mb-4">
              <h3 className="font-bold">{pendingRepair.device}</h3>
              <p className="text-gray-300 text-sm">{pendingRepair.issue}</p>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${getStatusColor(pendingRepair.status)}`} style={{ width: `${getProgress(pendingRepair.status)}%` }} />
            </div>
            <button
              onClick={() => setActiveTab('repairs')}
              className="w-full mt-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-500 hover:to-cyan-500"
            >
              View Repair Details
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-center">
            <FaTools className="text-4xl text-gray-400 mb-4" />
            <h3 className="font-bold mb-2">No Active Repairs</h3>
            <p className="text-gray-400 mb-4">You have no pending requests.</p>
            <button
              onClick={() => setActiveTab('new-repair')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-500 hover:to-cyan-500"
            >
              Request Repair
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ---- repairs tab
const RepairsTab = ({ repairs, setActiveTab, handleCancelRepair }) => (
  <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <FaTools className="text-blue-400" /> My Repair Requests
      </h2>
      <button
        onClick={() => setActiveTab('new-repair')}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center gap-2 text-sm"
      >
        <FaPlus /> New Request
      </button>
    </div>
    {repairs.length === 0 ? (
      <div className="text-center text-gray-400">No repair requests yet.</div>
    ) : (
      repairs.map((r) => (
        <div key={r.id} className="bg-gray-700/30 rounded-lg p-4 mb-4 border border-gray-600">
          <h3 className="font-bold">{r.device}</h3>
          <p className="text-gray-300 text-sm">{r.issue}</p>
          <div className="mt-2">
            {r.status === 'pending' && (
              <button
                onClick={() => handleCancelRepair(r.id)}
                className="px-3 py-1 text-xs bg-red-600/30 hover:bg-red-600/40 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))
    )}
  </div>
);

// ---- new repair tab
const NewRepairTab = ({ existingRequest, handleSubmitRepair, setActiveTab, handleCancelRepair, submitting }) => {
  const [device, setDevice] = useState('');
  const [issue, setIssue] = useState('');
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmitRepair(device.trim(), issue.trim(), () => {
      setDevice('');
      setIssue('');
      setActiveTab('dashboard');
    });
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FaTools className="text-blue-400" />
        {existingRequest ? 'Existing Repair Request' : 'Create New Repair Request'}
      </h2>

      {existingRequest ? (
        <div>
          <h3 className="font-semibold">{existingRequest.device}</h3>
          <p className="text-gray-300">{existingRequest.issue}</p>
          <button
            onClick={() => handleCancelRepair(existingRequest.id)}
            className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Cancel Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            placeholder="Device name"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
            required
          />
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Describe the issue"
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white resize-none min-h-80"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-bold hover:from-blue-500 hover:to-cyan-500 ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      )}
    </div>
  );
};

// ---- main
export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingRepair, setPendingRepair] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [existingRequest, setExistingRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // your stored login
  const pollRef = useRef(null);
  const abortRef = useRef(null);

  const loadRepairs = async (showToast = false) => {
    if (!user?.email) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch(`${API_BASE}/get_user_repairs.php?user_email=${encodeURIComponent(user.email)}`, {
        signal: ac.signal,
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setRepairs(data.repairs);
        const pending = data.repairs.find((r) => r.status !== 'completed' && r.status !== 'cancelled');
        setPendingRepair(pending || null);
        setExistingRequest(data.repairs.find((r) => r.status === 'pending') || null);
        if (showToast) toast.success('Repairs refreshed');
      } else {
        if (showToast) toast.error(data.message || 'Failed to load repairs');
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        if (showToast) toast.error('Network error while loading repairs');
        // console.error(e);
      }
    }
  };

  // initial + live polling
  useEffect(() => {
    loadRepairs();
    pollRef.current = setInterval(() => loadRepairs(false), 5000);
    return () => {
      clearInterval(pollRef.current);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const handleSubmitRepair = async (device, issue, onDone) => {
    if (!user || !device || !issue) return;
    setSubmitting(true);
    const t = toast.loading('Submitting repair request…');

    try {
      const res = await fetch(`${API_BASE}/create_repair.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: user.email, username: user.username, device, issue }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        toast.success('Repair request created!', { id: t });
        await loadRepairs();
        onDone?.();
      } else {
        toast.error(data.message || 'Could not create request', { id: t });
      }
    } catch (e) {
      toast.error('Network error while creating request', { id: t });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRepair = async (id) => {
    const t = toast.loading('Cancelling request…');
    try {
      const res = await fetch(`${API_BASE}/cancel_repair.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repair_id: id, user_email: user.email }),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        toast.success('Request cancelled.', { id: t });
        await loadRepairs();
      } else {
        toast.error(data.message || 'Could not cancel request', { id: t });
      }
    } catch (e) {
      toast.error('Network error while cancelling', { id: t });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white fade-in">
      <Toaster position="top-right" />
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-center py-16 border-b border-gray-700 w-full" />
      <main className="flex-grow p-4 sm:p-6">
        <DashboardHeader user={user} />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'dashboard' && (
          <DashboardTab
            user={user}
            pendingRepair={pendingRepair}
            repairs={repairs}
            setActiveTab={setActiveTab}
            navigate={navigate}
          />
        )}

        {activeTab === 'repairs' && (
          <RepairsTab repairs={repairs} setActiveTab={setActiveTab} handleCancelRepair={handleCancelRepair} />
        )}

        {activeTab === 'new-repair' && (
          <NewRepairTab
            existingRequest={existingRequest}
            handleSubmitRepair={handleSubmitRepair}
            setActiveTab={setActiveTab}
            handleCancelRepair={handleCancelRepair}
            submitting={submitting}
          />
        )}
      </main>
    </div>
  );
}
