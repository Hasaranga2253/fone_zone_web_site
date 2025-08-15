// src/pages/admin/LoginModal.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Prefer env var but default to your exact backend path (capital F!)
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost/Fonezone';

function LoginModal({ onClose, redirectTo = '/', switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Basic client-side validation
    const trimmedEmail = email.trim().toLowerCase();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!validEmail) {
      toast.error('Please enter a valid email.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // critical: send/receive PHP session cookie
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      // Try to parse JSON; tolerate non-JSON responses safely
      let payload = null;
      try {
        payload = await res.json();
      } catch {
        /* ignore */
      }

      // Expected success shape: { status: 'ok', data: { user: {...} } }
      if (res.ok && payload?.status === 'ok' && payload?.data?.user) {
        const user = payload.data.user;
        login(user); // store in React Context only (server keeps session via cookie)
        toast.success('✅ Login successful!');
        onClose?.();

        // Role-based redirects
        if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (user.role === 'employee') {
          const cat = (user.category || '').toLowerCase();
          if (cat === 'repair technician') navigate('/employee/repairs', { replace: true });
          else if (cat === 'delivery driver') navigate('/employee/delivery', { replace: true });
          else if (cat === 'sales support') navigate('/employee/support', { replace: true });
          else navigate('/employee/dashboard', { replace: true });
        } else {
          navigate(redirectTo || '/user/dashboard', { replace: true });
        }
        return;
      }

      // Handle known auth errors
      if (res.status === 401 || res.status === 403) {
        toast.error('Unauthorized. Please check your email and password.');
        return;
      }

      const errMsg =
        (payload && (payload.error || payload.message)) ||
        `❌ Login failed${res.status ? ` (${res.status})` : ''}.`;
      toast.error(errMsg);
    } catch {
      toast.error('❌ Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white/80 hover:text-red-400 text-xl font-bold"
          aria-label="Close Login"
          disabled={loading}
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
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
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-cyan-400"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-white/80">
          Don’t have an account?{' '}
          <span
            className="text-cyan-400 underline cursor-pointer"
            onClick={() => {
              if (loading) return;
              onClose?.();
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
