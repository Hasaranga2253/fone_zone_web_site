import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function RegisterModal({ onClose, switchToLogin }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Submit registration to backend
  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!fullName.trim()) return toast.error('❌ Full name is required.');
    if (!username.trim()) return toast.error('❌ Username is required.');
    if (!email.trim()) return toast.error('❌ Email is required.');
    if (!password.trim()) return toast.error('❌ Password is required.');
    if (password.length < 6) return toast.error('❌ Password must be at least 6 characters.');
    if (password !== confirmPassword) return toast.error('❌ Passwords do not match.');

    setLoading(true);
    try {
      const res = await fetch('http://localhost/fonezone/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          username,
          email,
          password,
          dob,
          gender,
          role: 'user', // Always 'user' on registration
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('🎉 Registration successful! Please login.');
        onClose();
        switchToLogin && switchToLogin();
      } else {
        toast.error(data.error || '❌ Registration failed.');
      }
    } catch (err) {
      toast.error('❌ Server error. Please try again later.');
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
          aria-label="Close Register"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Full Name"
            className="form-input"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            className="form-input"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="form-input"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          {/* Password Field with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Password"
              className="form-input pr-10"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              tabIndex={-1}
              aria-label="Toggle password"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            className="form-input"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />

          {/* DOB & Gender */}
          <div className="flex gap-4">
            <input
              type="date"
              name="dob"
              id="dob"
              className="form-input"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={loading}
            />
            <select
              name="gender"
              id="gender"
              className="form-input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={loading}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

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
