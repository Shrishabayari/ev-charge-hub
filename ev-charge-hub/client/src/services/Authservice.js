import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add a request interceptor to automatically handle token refreshes
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and has isExpired: true and we haven't tried refreshing already
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.isExpired === true &&
      error.response.data.requiresRefresh === true &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      try {
        // Get current token from storage
        const token = localStorage.getItem('token');
        
        // If we have a token, try to refresh it
        if (token) {
          const response = await axios.post(`${API_URL}/auth/refresh`, { token });
          
          // Save the new token
          const newToken = response.data.token;
          localStorage.setItem('token', newToken);
          
          // Update the authorization header and retry the original request
          originalRequest.headers['x-auth-token'] = newToken;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        
        // Check if we need to force a login
        if (refreshError.response?.data?.requiresLogin) {
          localStorage.removeItem('token');
          // If you're using React Router, you might use history.push('/login') here
          // or call a function that triggers a redirect
          window.location.href = '/login?session=expired';
        }
      }
    }
    
    // If it's not a token issue or refresh failed, reject with the original error
    return Promise.reject(error);
  }
);

const AuthService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (token) {
      // You could decode the JWT here to get the user info without making an API call
      // This is just a simple implementation
      return { isAuthenticated: true };
    }
    return null;
  },
  
  // Manual token refresh method (can be used when needed)
  refreshToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject('No token found');
    
    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, { token });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      // Clear token if refresh fails
      if (error.response?.data?.requiresLogin) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },
};

export default AuthService;