import React, { useEffect, useState } from 'react';

function RepairStatus() {
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
    const userRepairs = allRepairs.filter(r => r.user === currentUser?.email);
    setRepairs(userRepairs);
  }, []);

  return (
    <div className="p-6 bg-white text-black rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">📋 Repair Status</h2>
      {repairs.length === 0 ? (
        <p className="text-center text-gray-500">No repair requests found.</p>
      ) : (
        <ul className="space-y-4">
          {repairs.map(r => (
            <li key={r.id} className="border p-4 rounded shadow">
              <p><strong>Device:</strong> {r.device}</p>
              <p><strong>Issue:</strong> {r.issue}</p>
              <p><strong>Status:</strong> <span className="text-indigo-700">{r.status}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RepairStatus;
