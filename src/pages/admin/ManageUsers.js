import React, { useEffect, useState } from 'react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    setUsers(data);
  }, []);

  const handleDelete = (emailToDelete) => {
    if (emailToDelete === 'admin@fonezone.com') {
      alert("🚫 You can't delete the default admin!");
      return;
    }

    const filtered = users.filter(user => user.email !== emailToDelete);
    setUsers(filtered);
    localStorage.setItem('registeredUsers', JSON.stringify(filtered));
  };

  return (
    <div className="p-6 bg-white text-black rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">👥 Manage Registered Users</h2>

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No registered users found.</p>
      ) : (
        <table className="w-full table-auto border-collapse mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2 capitalize">{user.role}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
