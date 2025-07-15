import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="glass-card-gradient fade-in max-w-xl w-full text-center py-10 px-8 rounded-lg">
        <h1 className="text-4xl font-extrabold neon-text mb-4">
          👤 User Dashboard
        </h1>

        {user ? (
          <>
            <p className="text-xl text-white/90 mb-2">
              Welcome, <span className="gradient-text font-semibold">{user.username}</span>
            </p>
            <p className="text-sm text-gray-300 mb-4">
              Role: <span className="uppercase text-cyan-300 font-bold">{user.role}</span>
            </p>

            <p className="text-lg text-white/90 mb-4">
              You are successfully logged in. Please continue to explore our services!
            </p>

            <button
              onClick={() => navigate('/home')}
              className="btn-primary mt-6"
            >
              Go to Home
            </button>
          </>
        ) : (
          <p className="text-yellow-300">
            User data not found. Please{' '}
            <a href="/login" className="underline glow-btn">login</a> to continue.
          </p>
        )}
      </div>
    </div>
  );
}
