import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data exists in localStorage using the existing key
    const token = localStorage.getItem('medical_auth_token');
    const storedUserData = localStorage.getItem('user_data');

    if (token && storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUser({
        email: userData.email,
        login: userData.username,
        name: userData.name,
        role: userData.role,
        department: userData.department
      });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser({
      email: userData.email,
      login: userData.username,
      name: userData.name,
      role: userData.role,
      department: userData.department
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medical_auth_token');
    localStorage.removeItem('user_data');
    navigate('/');
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
