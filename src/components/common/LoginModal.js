import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function LoginModal({ onClose, redirectTo = '/', switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Inject default admin only once
  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const adminExists = existingUsers.some(
      user => user.email === 'admin@fonezone.com' && user.role === 'admin'
    );
    if (!adminExists) {
      existingUsers.push({
        email: 'admin@fonezone.com',
        password: 'admin123',
        role: 'admin',
      });
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const existingUser = users.find(
      user => user.email === email && user.password === password
    );

    if (!existingUser) {
      toast.error("❌ Incorrect email or password.");
      return;
    }

    login(existingUser);

    // ✅ Set adminLoggedIn flag for admin users
    if (existingUser.role === 'admin') {
      localStorage.setItem('adminLoggedIn', 'true');
    }

    toast.success('✅ Login successful!');
    onClose();

    // 🔁 Redirect to role-specific dashboard or fallback path
    switch (existingUser.role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'employee':
        navigate('/employee/dashboard');
        break;
      default:
        navigate(redirectTo || '/user/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-black relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don’t have an account?{' '}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => {
              onClose();
              switchToRegister && switchToRegister();
            }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
