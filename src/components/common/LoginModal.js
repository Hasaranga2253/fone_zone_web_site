// src/pages/admin/LoginModal.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PropTypes from 'prop-types';

// ⚠️ IMPORTANT: Capital F eka hari! Env var thiyenawanam eka use karanawa, naththam default eka gahanawa
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost/Fonezone';

function LoginModal({ onClose, redirectTo = '/', switchToRegister }) {
  // 🧠 Local state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔒 Focus management refs (UX tika hari karanna)
  const rootRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const submitBtnRef = useRef(null);

  // ✅ Email validate karanna simple regex ekak (magey ayye, meka super strict nemei, but OK)
  const isValidEmail = useCallback((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), []);

  // 🧯 AbortController ekak use karala network timeout ekak denna
  const fetchWithTimeout = useCallback(async (url, options = {}, timeoutMs = 15000) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(t);
    }
  }, []);

  // 🚪 ESC press unama close karanna; Tab trap karanna
  useEffect(() => {
    // Focus modal on mount
    // Meka naththam mobile eke keyboard open wenne ne
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 0);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (!loading) onClose?.();
      }
      if (e.key === 'Tab') {
        // Simple focus trap (front-end friendly)
        const focusable = rootRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [loading, onClose]);

  // 🧭 Role-based redirect eka ekathu function ekak widiyata
  const doRoleRedirect = useCallback((user) => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    if (user?.role === 'employee') {
      const cat = (user?.category || '').toLowerCase().trim();
      if (cat === 'repair technician') navigate('/employee/repairs', { replace: true });
      else if (cat === 'delivery driver') navigate('/employee/delivery', { replace: true });
      else if (cat === 'sales support') navigate('/employee/support', { replace: true });
      else navigate('/employee/dashboard', { replace: true });
      return;
    }
    navigate(redirectTo || '/user/dashboard', { replace: true });
  }, [navigate, redirectTo]);

  const handleLogin = useCallback(async (e) => {
    e?.preventDefault?.();
    if (loading) return; // Double-click walin API danna epa

    const trimmedEmail = email.trim().toLowerCase();

    // 🧼 Client-side checks: tika hari karaganna issarahinma
    if (!isValidEmail(trimmedEmail)) {
      toast.error('Please enter a valid email. (eka wadiya harida balannako)');
      firstFocusableRef.current?.focus();
      return;
    }
    if (password.length < 8) {
      toast.error('Password at least 8 chars one, neh.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithTimeout(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // PHP side ekata ajax hint ekak
        },
        credentials: 'include', // 🍪 PHP session cookie in/out
        body: JSON.stringify({ email: trimmedEmail, password }),
      }, 15000);

      // 🔎 Safe JSON parse: non-JSON awoth crash wenna epa
      let payload = null;
      try {
        payload = await res.json();
      } catch {
        // ok, server text witarak denna puluwan
      }

      // 🎯 Expecting: { status: 'ok', data: { user: {...} } }
      if (res.ok && payload?.status === 'ok' && payload?.data?.user) {
        const user = payload.data.user;
        login(user); // Context ekata daganna (server side session already cookie eka tiyenne)
        toast.success('✅ Login successful!');
        onClose?.();
        doRoleRedirect(user);
        return;
      }

      // 🔐 Common auth cases
      if (res.status === 401 || res.status === 403) {
        toast.error('Unauthorized. Email / password eka balanna.');
        submitBtnRef.current?.focus();
        return;
      }

      const errMsg = (payload && (payload.error || payload.message)) || `❌ Login failed${res.status ? ` (${res.status})` : ''}.`;
      toast.error(errMsg);
    } catch (err) {
      if (err?.name === 'AbortError') {
        toast.error('⏳ Network slow wage. Again try karannako.');
      } else {
        toast.error('❌ Login failed. Connection eka balannako.');
      }
    } finally {
      setLoading(false);
    }
  }, [doRoleRedirect, email, fetchWithTimeout, isValidEmail, login, onClose, password, loading]);

  // ⌨️ Enter press unama submit wenna - form eke default behaivourma thiyenawa, but mobile walata stabilize karanawa
  const onKeyPressPassword = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* glass-card: UI smooth look ekak */}
      <div className="glass-card w-full max-w-md text-white relative shadow-2xl rounded-2xl">
        {/* Close Button */}
        <button
          ref={lastFocusableRef}
          onClick={() => !loading && onClose?.()}
          className="absolute top-2 right-3 text-white/80 hover:text-red-400 text-xl font-bold"
          aria-label="Close Login"
          disabled={loading}
        >
          &times;
        </button>

        <h2 id="login-modal-title" className="text-3xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <input
            ref={firstFocusableRef}
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
            inputMode="email"
            aria-invalid={email && !isValidEmail(email) ? 'true' : 'false'}
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
              onKeyDown={onKeyPressPassword}
              required
              disabled={loading}
              minLength={8}
              aria-describedby="password-help"
            />
            <span id="password-help" className="sr-only">Minimum 8 characters</span>
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-cyan-400"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            ref={submitBtnRef}
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
            role="button"
            tabIndex={0}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

LoginModal.propTypes = {
  onClose: PropTypes.func,
  redirectTo: PropTypes.string,
  switchToRegister: PropTypes.func,
};

export default LoginModal;
