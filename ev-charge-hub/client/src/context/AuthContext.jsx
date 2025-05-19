// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(null); // Add user type state (admin/user)

  // Setup axios interceptor for token expiration
  useEffect(() => {
    // Add response interceptor to handle token expiration
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // Check if error is due to expired token
        if (error.response && 
            error.response.status === 401 && 
            error.response.data.expired) {
          
          // Automatically logout user
          logout();
          
          // Set error message for expired token
          setError('Your session has expired. Please log in again.');
          
          // Redirect to appropriate login page
          window.location.href = userType === 'admin' ? '/admin/login' : '/user/login';
        }
        
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [userType]); // Re-run when userType changes

  // Load user from token on initial render
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Set user type from localStorage
      if (storedUserType) {
        setUserType(storedUserType);
      }

      try {
        // Set default headers for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Use the correct endpoint based on user type
        const endpoint = storedUserType === 'admin' ? '/api/admin/profile' : '/api/users/profile';
        const res = await axios.get(endpoint);
        
        setUser(res.data);
        setIsAuthenticated(true);
        setError(null);
      } catch (err) {
        console.error('Error loading user:', err);
        logout();
        setError('Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // User login
  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/users/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userType', 'user');
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      setUserType('user');
      setError(null);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin login
  const loginAdmin = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/admin/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userType', 'admin');
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setUser(res.data.user || { email }); // Some admin endpoints might not return full user data
      setIsAuthenticated(true);
      setUserType('admin');
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/users/register', userData);
      
      // If registration returns a token, store it
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userType', 'user');
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        setUser(res.data.user);
        setIsAuthenticated(true);
        setUserType('user');
      }
      
      setError(null);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register admin
  const registerAdmin = async (adminData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/admin/register', adminData);
      
      // Admin registration might not automatically log in
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Admin registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        userType,
        loginUser,
        loginAdmin,
        register,
        registerAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};