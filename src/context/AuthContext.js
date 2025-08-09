import { createContext, useContext, useState, useEffect } from 'react';

// 1️⃣ Create context
export const AuthContext = createContext();

// 2️⃣ Provider component
export const AuthProvider = ({ children }) => {
  // Load user from localStorage safely at mount
  const [currentUser, setCurrentUser] = useState(() => {
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
    // For admin, mark session separately
    if (user?.role === 'admin') {
      localStorage.setItem('adminLoggedIn', 'true');
    }
  };

  // 🔓 Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('adminLoggedIn');
    // (Optional) clear more keys here if needed
  };

  // 🔁 Sync with localStorage if changed elsewhere (multi-tab support)
  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
        localStorage.removeItem('user');
      }
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  // (Optional) Sync on mount as well
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      setCurrentUser(null);
      localStorage.removeItem('user');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3️⃣ Custom hook for easy usage
export const useAuth = () => useContext(AuthContext);
