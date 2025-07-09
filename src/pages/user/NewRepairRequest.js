import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewRepairRequest() {
  const [device, setDevice] = useState('');
  const [issue, setIssue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return alert('Login required');

    const repairs = JSON.parse(localStorage.getItem('repairs')) || [];

    const newRepair = {
      id: Date.now(),
      user: user.email,
      device,
      issue,
      status: 'Pending',
    };

    localStorage.setItem('repairs', JSON.stringify([...repairs, newRepair]));

    alert('🔧 Repair request submitted!');
    navigate('/user/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 text-black rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">New Repair Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Device Name"
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Describe the issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Submit Repair Request
        </button>
      </form>
    </div>
  );
}

export default NewRepairRequest;
