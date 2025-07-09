import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const newUser = { email, password, role };

    // Get existing users
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // ❌ Prevent duplicate emails
    const isEmailUsed = existingUsers.find(user => user.email === email);
    if (isEmailUsed) {
      alert('❌ This email is already registered.');
      return;
    }

    // ✅ Save new user (only user or employee)
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    alert('✅ Registered successfully! Please log in.');
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow text-black">
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
          {/* Admin not allowed to register from here */}
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
        <a href="/login" className="text-blue-600 underline">Login here</a>
      </p>
    </div>
  );
}

export default Register;
