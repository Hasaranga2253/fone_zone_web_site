import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function RegisterModal({ onClose, switchToLogin }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) return toast.error('❌ Full name is required.');
    if (!username.trim()) return toast.error('❌ Username is required.');
    if (!email || !password) return toast.error('❌ Email and password are required.');

    const newUser = {
      fullName,
      username,
      email,
      password,
      dob,
      gender,
      role: 'user', // Always register as a regular user
    };

    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (existingUsers.find((user) => user.email === email)) {
      return toast.error('❌ This email is already registered.');
    }

    // Save new user
    localStorage.setItem('registeredUsers', JSON.stringify([...existingUsers, newUser]));

    // Auto-login after registration
    login(newUser);
    toast.success('✅ Registered and logged in!');
    onClose();

    // Redirect after login (auto-detect role in case admin promoted them)
    const updatedUser = { ...newUser }; // Could be promoted later
    if (updatedUser.role === 'employee') {
      const cat = updatedUser.category?.toLowerCase();
      if (cat?.includes('repair')) navigate('/employee/repairs');
      else if (cat?.includes('delivery')) navigate('/employee/delivery');
      else if (cat?.includes('support')) navigate('/employee/support');
      else navigate('/employee/dashboard');
    } else if (updatedUser.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white/80 hover:text-red-400 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* DOB + Gender Row */}
          <div className="flex gap-4">
            <input
              type="date"
              className="w-full px-4 py-2 rounded bg-white/20 text-white outline-none focus:ring-2 focus:ring-cyan-500"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <select
              className="w-full px-4 py-2 rounded bg-white/20 text-white outline-none focus:ring-2 focus:ring-cyan-500"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Removed Role & Category selectors (always user) */}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded text-white font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-4 text-sm text-white/80">
          Already have an account?{' '}
          <span
            className="text-cyan-400 underline cursor-pointer"
            onClick={() => {
              onClose();
              switchToLogin?.();
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
