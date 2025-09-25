import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthorized = (requiredPage) => {
    if (!user) return false;
    
    // Admin has access to all pages
    if (user.role === 'admin') return true;
    
    // Check if user has access to specific page
    return user.pages && user.pages.includes(requiredPage);
  };

  const getUserPages = () => {
    if (!user) return [];
    
    if (user.role === 'admin') {
      return ['dashboard', 'planning', 'engine', 'cleaning', 'certification', 'branding', 'maintenance', 'service'];
    }
    
    return user.pages || [];
  };

  const value = {
    user,
    login,
    logout,
    isAuthorized,
    getUserPages,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;