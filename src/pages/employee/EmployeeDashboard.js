import React from 'react';

export default function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-teal-500 text-white">
      <div className="bg-white bg-opacity-10 p-8 rounded-xl shadow-lg text-center backdrop-blur-sm max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">🔧 Employee Dashboard</h1>
        {user ? (
          <>
            <p className="text-lg mb-2">Welcome, <span className="font-semibold">{user.email}</span></p>
            <p className="text-sm opacity-80">Role: {user.role}</p>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <p>No user found. <a href="/login" className="underline text-yellow-300">Login</a></p>
        )}
      </div>
    </div>
  );
}
