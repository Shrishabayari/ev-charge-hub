// Updated AuthContext.js - Modified to work with the new centralized refresh token endpoint
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // Add this dependency: npm install jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(null);
  
  // Token refresh function
  const refreshToken = useCallback(async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return false;
      
      // Use the centralized token refresh endpoint
      const res = await axios.post('/api/refresh-token', {
        token: currentToken
      });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return true;
      }
      return false;
    } catch (err) {
      console.error('Token refresh failed:', err);
      return false;
    }
  }, []);
  
  // Check token expiration time
  const isTokenExpiring = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      // Refresh when token has less than 1 day left (in seconds)
      return decoded.exp - (Date.now() / 1000) < 86400;
    } catch (err) {
      return false;
    }
  }, []);

  // Setup axios interceptor for token expiration
  useEffect(() => {
    // Add request interceptor to check token before requests
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        // Skip token check for refresh token requests to avoid infinite loops
        if (config.url === '/api/refresh-token') {
          return config;
        }
        
        // If token is expiring soon but still valid, try to refresh it
        if (isTokenExpiring() && isAuthenticated) {
          const refreshed = await refreshToken();
          if (refreshed) {
            const newToken = localStorage.getItem('token');
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Add response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Avoid infinite loops - don't retry refresh-token requests
        if (originalRequest.url === '/api/refresh-token') {
          return Promise.reject(error);
        }
        
        // If error is due to expired token and we haven't tried refreshing yet
        if (error.response && 
            error.response.status === 401 && 
            error.response.data.expired &&
            !originalRequest._retry) {
          
          originalRequest._retry = true;
          
          // Try to refresh the token
          const refreshed = await refreshToken();
          
          if (refreshed) {
            // Retry the original request with new token
            const newToken = localStorage.getItem('token');
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } else {
            // If refresh failed, logout user
            logout();
            setError('Your session has expired. Please log in again.');
            
            // Redirect to appropriate login page
            window.location.href = userType === 'admin' ? '/admin/login' : '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Clean up interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [isAuthenticated, userType, refreshToken, isTokenExpiring]);

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
        // Check if token is expiring and refresh if needed
        if (isTokenExpiring()) {
          const refreshed = await refreshToken();
          if (!refreshed) throw new Error('Token refresh failed');
        }
        
        // Set default headers for all requests
        const currentToken = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
        
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
  }, [refreshToken, isTokenExpiring]);

  // Login function
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
      
      setUser(res.data.user || { email });
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
        logout,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};