import React from 'react';

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="glass-card-gradient fade-in max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold neon-text mb-4">
          👤 User Dashboard
        </h1>

        {user ? (
          <>
            <p className="text-xl text-white/90 mb-2">
              Welcome, <span className="gradient-text font-semibold">{user.email}</span>
            </p>
            <p className="text-sm text-gray-300">
              Role: <span className="uppercase text-cyan-300 font-bold">{user.role}</span>
            </p>

            <button
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="btn-secondary mt-6"
            >
              🔓 Logout
            </button>
          </>
        ) : (
          <p className="text-yellow-300">
            User data not found. Please{' '}
            <a href="/login" className="underline glow-btn">login</a>.
          </p>
        )}
      </div>
    </div>
  );
}
