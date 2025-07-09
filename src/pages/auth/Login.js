import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  // ✅ Admin Protection: Inject only if not already present
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
      user => user.email === email && user.password === password && user.role === role
    );

    if (!existingUser) {
      alert("Incorrect email, password, or role. Please try again or register.");
      return;
    }

    localStorage.setItem('user', JSON.stringify(existingUser));

    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'employee') {
      navigate('/employee/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow text-black">
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
        <select
          className="w-full border px-3 py-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login as {role}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-500 hover:underline">Register here</a>
      </p>
    </div>
  );
}

export default Login;
