import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // You might want to verify the token with the backend here
          // For simplicity, we'll just decode it, but a server check is better
          // For now, we assume if a token exists, the user is authenticated
          // A better approach is to have a /api/user/me endpoint
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          authService.logout(); // Token is invalid or expired
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const signup = async (userData) => {
    const data = await authService.signup(userData);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  }

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
