import React, { useEffect, useState } from 'react';

function RepairJobs() {
  const [repairs, setRepairs] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const allRepairs = JSON.parse(localStorage.getItem('repairs')) || [];

    if (user?.role === 'employee') {
      setRepairs(allRepairs);
    } else {
      const userRepairs = allRepairs.filter(r => r.user === user?.email);
      setRepairs(userRepairs);
    }
  }, []);

  const getNextStatus = (status) => {
    if (status === 'pending') return 'processing';
    if (status === 'processing') return 'completed';
    return 'completed';
  };

  const updateStatus = (id) => {
    const updatedRepairs = repairs.map(r => {
      if (r.id === id && r.status !== 'completed') {
        return { ...r, status: getNextStatus(r.status) };
      }
      return r;
    });

    setRepairs(updatedRepairs);
    localStorage.setItem('repairs', JSON.stringify(updatedRepairs));
  };

  return (
    <div className="p-6 bg-white text-black rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">🔧 Repair Jobs</h2>

      {repairs.length === 0 ? (
        <p className="text-center text-gray-500">No repair jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {repairs.map(r => (
            <li key={r.id} className="border p-4 rounded shadow">
              <p><strong>User:</strong> {r.user}</p>
              <p><strong>Device:</strong> {r.device}</p>
              <p><strong>Issue:</strong> {r.issue}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`font-bold capitalize ${
                  r.status === 'pending'
                    ? 'text-yellow-500'
                    : r.status === 'processing'
                    ? 'text-blue-600'
                    : 'text-green-600'
                }`}>
                  {r.status}
                </span>
              </p>

              {user?.role === 'employee' && r.status !== 'completed' && (
                <button
                  onClick={() => updateStatus(r.id)}
                  className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Move to {getNextStatus(r.status)}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RepairJobs;
