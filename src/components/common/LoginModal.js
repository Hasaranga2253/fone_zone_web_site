import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginModal({ onClose, redirectTo = '/', switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // LOGIN HANDLER (Hardcoded admin + backend for others)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ---- HARD CODED ADMIN LOGIN ----
    if (email === "admin@fonezone.com" && password === "admin123") {
      const adminUser = {
        id: 1,
        full_name: "Admin",
        username: "admin",
        email: "admin@fonezone.com",
        role: "admin",
        category: null,
        dob: "1990-01-01",
        gender: "male",
      };
      login(adminUser);
      toast.success('✅ Admin login successful!');
      onClose();
      navigate('/admin/dashboard');
      setLoading(false);
      return;
    }

    // ---- Regular user login via PHP backend ----
    try {
      const res = await fetch('http://localhost/fonezone/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        login(data.user); // Set user in React Context ONLY!
        toast.success('✅ Login successful!');
        onClose();
        // Redirect based on role
        if (data.user.role === 'admin') navigate('/admin/dashboard');
        else if (data.user.role === 'employee') {
          const cat = (data.user.category || '').toLowerCase();
          if (cat === 'repair technician') navigate('/employee/repairs');
          else if (cat === 'delivery driver') navigate('/employee/delivery');
          else if (cat === 'sales support') navigate('/employee/support');
          else navigate('/employee/dashboard');
        }
        else navigate(redirectTo || '/user/dashboard');
      } else {
        toast.error(data.error || '❌ Incorrect email or password.');
      }
    } catch (err) {
      toast.error('❌ Login failed. Server error.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white/80 hover:text-red-400 text-xl font-bold"
          aria-label="Close Login"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-cyan-400"
              aria-label="Show/hide password"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded text-white font-semibold transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

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
