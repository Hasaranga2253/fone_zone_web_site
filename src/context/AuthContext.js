import { createContext, useContext, useState, useEffect } from 'react';

// 1️⃣ Create context
export const AuthContext = createContext();

// 2️⃣ Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Load user from localStorage safely
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  // 🔐 Login function
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));

    // Only for admin: mark admin session
    if (user.role === 'admin') {
      localStorage.setItem('adminLoggedIn', 'true');
    }
  };

  // 🔓 Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('adminLoggedIn');
  };

  // 🔁 Sync with localStorage on mount (optional rehydration)
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3️⃣ Custom hook for convenience
export const useAuth = () => useContext(AuthContext);
