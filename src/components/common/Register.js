import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function RegisterModal({ onClose, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();

    const newUser = { email, password, role };
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    const isEmailUsed = existingUsers.find((user) => user.email === email);
    if (isEmailUsed) {
      toast.error('❌ This email is already registered.');
      return;
    }

    // Save and auto-login
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    login(newUser);
    toast.success('✅ Registered and logged in!');
    onClose();

    // Navigate based on role
    switch (newUser.role) {
      case 'employee':
        navigate('/employee/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/user/dashboard');
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
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
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
          <select
            className="w-full border px-3 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="employee">Employee</option>
          </select>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => {
              onClose();
              switchToLogin && switchToLogin();
            }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterModal;
