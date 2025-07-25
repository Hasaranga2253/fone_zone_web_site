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
  const [role, setRole] = useState('user');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) return toast.error('❌ Full name is required.');
    if (!username.trim()) return toast.error('❌ Username is required.');
    if (!email || !password) return toast.error('❌ Email and password are required.');
    if (role === 'employee' && !category) return toast.error('❌ Please select an employee category.');

    const newUser = { fullName, username, email, password, dob, gender, role };
    if (role === 'employee') newUser.category = category;

    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (existingUsers.find((user) => user.email === email)) {
      return toast.error('❌ This email is already registered.');
    }

    localStorage.setItem('registeredUsers', JSON.stringify([...existingUsers, newUser]));
    login(newUser);
    toast.success('✅ Registered and logged in!');
    onClose();

    // Redirect
    if (newUser.role === 'employee') {
      const cat = newUser.category?.toLowerCase();
      if (cat.includes('repair')) navigate('/employee/repairs');
      else if (cat.includes('delivery')) navigate('/employee/delivery');
      else if (cat.includes('support')) navigate('/employee/support');
      else navigate('/employee/dashboard');
    } else if (newUser.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md text-white relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-3 text-white/80 hover:text-red-400 text-xl font-bold">
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

          {/* Role Selection */}
          <select
            className="w-full px-4 py-2 rounded bg-white/20 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="employee">Employee</option>
          </select>

          {/* Employee Category */}
          {role === 'employee' && (
            <select
              className="w-full px-4 py-2 rounded bg-white/20 text-white outline-none focus:ring-2 focus:ring-cyan-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Employee Category</option>
              <option value="Repair Technician">Repair Technician</option>
              <option value="Delivery Driver">Delivery Driver</option>
              <option value="Sales Support">Sales Support</option>
            </select>
          )}

        {/* Social Sign-up */}
        <div className="space-y-3 mb-6">
          {/* Google Button */}
          <button className="w-full py-2 flex items-center justify-center gap-3 px-4 bg-white hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow transition">
            <svg viewBox="0 0 24 24" height={25} width={25} xmlns="http://www.w3.org/2000/svg">
              <path d="M12,5c1.6,0,3.1,0.6,4.3,1.5l3.6-3.5C17.8,1.1,15,0,12,0C7.4,0,3.4,2.6,1.4,6.4l4,3.2C6.4,6.9,9,5,12,5z" fill="#F44336"/>
              <path d="M24,12c0-0.9-0.1-1.7-0.3-2.5H12v5h6.5c-0.5,1.4-1.5,2.5-2.6,3.3l4.1,3.2C22,19.1,23.5,16.5,24,13.5z" fill="#2196F3"/>
              <path d="M5,12c0-0.8,0.2-1.6,0.4-2.4l-4-3.2C0.5,8.1,0,10,0,12c0,2,0.5,3.9,1.4,5.5l4-3.2C5.1,13.6,5,12.8,5,12z" fill="#FFC107"/>
              <path d="M12,19c-3,0-5.6-1.9-6.6-4.7l-4,3.2C3.4,21.4,7.4,24,12,24c3,0,5.8-1.1,7.9-3l-4.1-3.2C14.7,18.6,13.4,19,12,19z" fill="#00B060"/>
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Apple Button */}
          <button className="w-full py-2 flex items-center justify-center gap-3 px-4 bg-white hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow transition">
            <svg viewBox="0 0 30 30" height={25} width={25} xmlns="http://www.w3.org/2000/svg">
              <path d="M25.6,9.8c-0.1,0.1-3.1,1.7-3.1,5.3c0.1,4.1,3.7,5.6,3.8,5.6c-0.1,0.1-0.5,2-1.9,3.9C23.2,26.3,22,28,20.1,28c-1.8,0-2.4-1.1-4.5-1.1c-2.2,0-2.9,1.1-4.6,1.1c-1.9,0-3.2-1.8-4.4-3.5c-1.5-2.2-2.8-5.7-2.9-9c0-1.8,0.3-3.5,1.2-5c1.2-2.1,3.4-3.5,5.7-3.5c1.8,0,3.4,1.2,4.5,1.2c1.1,0,3-1.2,5.3-1.2C21.4,7,24,7.3,25.6,9.8z" fill="black"/>
              <path d="M15,6.7c-0.3-1.6,0.6-3.2,1.4-4.2C17.5,1.2,19.2,0.4,20.6,0.4c0.1,1.6-0.5,3.2-1.5,4.3C18.1,5.9,16.5,6.9,15,6.7z" fill="black"/>
            </svg>
            <span>Sign up with Apple</span>
          </button>
        </div>

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
