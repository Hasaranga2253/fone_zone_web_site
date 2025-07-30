import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Eye icons

function LoginModal({ onClose, redirectTo = '/', switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle for login
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle for reset new
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for reset confirm

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('user'));
    if (current?.role === 'employee') {
      const cat = current.category?.toLowerCase();
      if (cat === 'repair technician') navigate('/employee/repairs');
      else if (cat === 'delivery driver') navigate('/employee/delivery');
      else if (cat === 'sales support') navigate('/employee/support');
      else navigate('/employee/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const adminExists = existingUsers.some(
      (user) => user.email === 'admin@fonezone.com' && user.role === 'admin'
    );
    if (!adminExists) {
      existingUsers.push({
        email: 'admin@fonezone.com',
        password: 'admin123',
        role: 'admin',
        username: 'Hasaranga',
      });
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      toast.error('❌ Incorrect email or password.');
      return;
    }

    login(foundUser);
    if (foundUser.role === 'admin') {
      localStorage.setItem('adminLoggedIn', 'true');
    }

    toast.success('✅ Login successful!');
    onClose();
    redirectUser(foundUser);
  };

  const redirectUser = (user) => {
    if (user.role === 'employee') {
      const cat = user.category?.toLowerCase();
      if (cat === 'repair technician') navigate('/employee/repairs');
      else if (cat === 'delivery driver') navigate('/employee/delivery');
      else if (cat === 'sales support') navigate('/employee/support');
      else navigate('/employee/dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate(redirectTo || '/user/dashboard');
    }
  };

  const handlePasswordReset = () => {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userIndex = users.findIndex((u) => u.email === resetEmail);

    if (userIndex === -1) {
      toast.error('❌ No account found with that email.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error('❌ Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('❌ Passwords do not match.');
      return;
    }

    users[userIndex].password = newPassword;
    const updatedUser = users[userIndex];
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    login(updatedUser);
    if (updatedUser.role === 'admin') {
      localStorage.setItem('adminLoggedIn', 'true');
    }

    toast.success('✅ Password updated and logged in!');
    onClose();
    redirectUser(updatedUser);
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

        <h2 className="text-3xl font-bold mb-6 text-center">
          {showReset ? 'Reset Password' : 'Login'}
        </h2>

        {!showReset ? (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Login Password Field with Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-cyan-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded text-white font-semibold transition"
              >
                Login
              </button>

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                {/* Google */}
                <button className="w-full py-2 flex items-center justify-center gap-3 px-4 bg-white hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow transition">
                  <svg viewBox="0 0 24 24" height={25} width={25} xmlns="http://www.w3.org/2000/svg">
                    <path d="M12,5c1.6,0,3.1,0.6,4.3,1.5l3.6-3.5C17.8,1.1,15,0,12,0C7.4,0,3.4,2.6,1.4,6.4l4,3.2C6.4,6.9,9,5,12,5z" fill="#F44336"/>
                    <path d="M24,12c0-0.9-0.1-1.7-0.3-2.5H12v5h6.5c-0.5,1.4-1.5,2.5-2.6,3.3l4.1,3.2C22,19.1,23.5,16.5,24,13.5z" fill="#2196F3"/>
                    <path d="M5,12c0-0.8,0.2-1.6,0.4-2.4l-4-3.2C0.5,8.1,0,10,0,12c0,2,0.5,3.9,1.4,5.5l4-3.2C5.1,13.6,5,12.8,5,12z" fill="#FFC107"/>
                    <path d="M12,19c-3,0-5.6-1.9-6.6-4.7l-4,3.2C3.4,21.4,7.4,24,12,24c3,0,5.8-1.1,7.9-3l-4.1-3.2C14.7,18.6,13.4,19,12,19z" fill="#00B060"/>
                  </svg>
                  <span>Login with Google</span>
                </button>

                {/* Apple */}
                <button className="w-full py-2 flex items-center justify-center gap-3 px-4 bg-white hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow transition">
                  <svg viewBox="0 0 30 30" height={25} width={25} xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.6,9.8c-0.1,0.1-3.1,1.7-3.1,5.3c0.1,4.1,3.7,5.6,3.8,5.6c-0.1,0.1-0.5,2-1.9,3.9C23.2,26.3,22,28,20.1,28c-1.8,0-2.4-1.1-4.5-1.1c-2.2,0-2.9,1.1-4.6,1.1c-1.9,0-3.2-1.8-4.4-3.5c-1.5-2.2-2.8-5.7-2.9-9c0-1.8,0.3-3.5,1.2-5c1.2-2.1,3.4-3.5,5.7-3.5c1.8,0,3.4,1.2,4.5,1.2c1.1,0,3-1.2,5.3-1.2C21.4,7,24,7.3,25.6,9.8z" fill="black"/>
                    <path d="M15,6.7c-0.3-1.6,0.6-3.2,1.4-4.2C17.5,1.2,19.2,0.4,20.6,0.4c0.1,1.6-0.5,3.2-1.5,4.3C18.1,5.9,16.5,6.9,15,6.7z" fill="black"/>
                  </svg>
                  <span>Login with Apple</span>
                </button>
              </div>
            </form>

            <p
              className="text-center mt-3 text-sm text-cyan-400 underline cursor-pointer"
              onClick={() => setShowReset(true)}
            >
              Forgot Password?
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm text-white/80">
              Enter your email and new password
            </p>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />

            {/* New Password Field */}
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New Password"
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-cyan-400"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-cyan-400"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePasswordReset}
                className="w-full py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold transition"
              >
                Save & Login
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="w-full py-2 bg-gray-500 hover:bg-gray-600 rounded text-white font-semibold transition"
              >
                Back
              </button>
            </div>
          </div>
        )}

        <p className="text-center mt-4 text-sm text-white/80">
          Don’t have an account?{' '}
          <span
            className="text-cyan-400 underline cursor-pointer"
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
