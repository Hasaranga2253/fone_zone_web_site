// src/pages/user/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTools, FaShoppingCart, FaUser, FaCog, FaBell, FaPlus
} from 'react-icons/fa';

// Helper functions
const getProgress = (status) => {
  switch (status) {
    case 'pending': return 33;
    case 'processing': return 66;
    case 'completed': return 100;
    default: return 0;
  }
};
const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'processing': return 'bg-blue-500';
    case 'completed': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};
const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Pending Assignment';
    case 'processing': return 'In Progress';
    case 'completed': return 'Completed';
    default: return 'Status Unknown';
  }
};

// Header
const DashboardHeader = ({ user }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-3">
          {user.username}'s Dashboard
      </h1>
      <p className="text-gray-400 text-sm">
        Welcome back to your repair management portal
      </p>
    </div>
  </div>
);

// Navigation Tabs
const NavigationTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex border-b border-gray-700 mb-6">
    {['dashboard', 'repairs', 'new-repair'].map((tab) => (
      <button
        key={tab}
        className={`px-4 py-2 font-medium ${
          activeTab === tab
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-gray-400'
        }`}
        onClick={() => setActiveTab(tab)}
      >
        {tab === 'dashboard' && 'Dashboard'}
        {tab === 'repairs' && 'My Repairs'}
        {tab === 'new-repair' && 'New Repair'}
      </button>
    ))}
  </div>
);

// Dashboard Tab (main content area)
const DashboardTab = ({ user, pendingRepair, repairs, setActiveTab, navigate }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Account Overview */}
    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaUser className="text-blue-400" /> Account Overview
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-700 pb-3">
            <span className="text-gray-400">Member Since</span>
            <span className="font-medium">Jan 2023</span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-3">
            <span className="text-gray-400">Total Repairs</span>
            <span className="font-medium">{repairs.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Completed Repairs</span>
            <span className="font-medium">
              {repairs.filter(r => r.status === 'completed').length}
            </span>
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
            {/* Device Card */}
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 mb-4">
              <h3 className="font-bold">{pendingRepair.device}</h3>
              <p className="text-gray-300 text-sm">{pendingRepair.issue}</p>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatusColor(pendingRepair.status)}`}
                style={{ width: `${getProgress(pendingRepair.status)}%` }}
              />
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

// RepairsTab Component
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
      repairs.map((repair) => (
        <div key={repair.id} className="bg-gray-700/30 rounded-lg p-4 mb-4 border border-gray-600">
          <h3 className="font-bold">{repair.device}</h3>
          <p className="text-gray-300 text-sm">{repair.issue}</p>
          <div className="mt-2">
            <button
              onClick={() => handleCancelRepair(repair.id)}
              className="px-3 py-1 text-xs bg-red-600/30 hover:bg-red-600/40 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

// NewRepairTab Component
const NewRepairTab = ({ existingRequest, handleSubmitRepair, setActiveTab, handleCancelRepair }) => {
  const [device, setDevice] = useState('');
  const [issue, setIssue] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmitRepair(device, issue);
  };

  return (
    
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 max-w-2xl mx-auto">
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
            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-bold hover:from-blue-500 hover:to-cyan-500"
          >
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};

// Main Export
export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingRepair, setPendingRepair] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [existingRequest, setExistingRequest] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return;

    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
    const userRepairs = allRepairs.filter(r => r.user === user.email);
    const pending = userRepairs.find(r => r.status !== 'completed');

    setPendingRepair(pending);
    setRepairs(userRepairs);
    setExistingRequest(userRepairs.find(r => r.status === 'pending'));
  }, [user]);

  const handleSubmitRepair = (device, issue) => {
    if (!user) return;

    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const technicians = allUsers.filter(
      u => u.role === 'employee' && u.category?.toLowerCase() === 'repair technician'
    );

    const newRepair = {
      id: Date.now(),
      user: user.email,
      username: user.username,
      device,
      issue,
      assignedTo: technicians.length > 0
        ? technicians[Math.floor(Math.random() * technicians.length)].email
        : null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('repairs', JSON.stringify([...allRepairs, newRepair]));
    setRepairs([...repairs, newRepair]);
    setExistingRequest(newRepair);
  };

  const handleCancelRepair = (id) => {
    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
    const updated = allRepairs.filter(r => r.id !== id);

    localStorage.setItem('repairs', JSON.stringify(updated));
    setRepairs(repairs.filter(r => r.id !== id));
    setExistingRequest(null);
  };

  return (
    
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white fade-in">
     <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-center py-16 border-b border-gray-700 w-full">
      </section>
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
          <RepairsTab
            repairs={repairs}
            setActiveTab={setActiveTab}
            handleCancelRepair={handleCancelRepair}
          />
        )}

        {activeTab === 'new-repair' && (
          <NewRepairTab
            existingRequest={existingRequest}
            handleSubmitRepair={handleSubmitRepair}
            setActiveTab={setActiveTab}
            handleCancelRepair={handleCancelRepair}
          />
        )}
      </main>

    </div>
  );
}
