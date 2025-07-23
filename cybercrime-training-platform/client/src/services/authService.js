import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with user data and tokens
 */
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  
  if (response.data.success) {
    // Store tokens in local storage
    localStorage.setItem('accessToken', response.data.data.tokens.access.token);
    localStorage.setItem('refreshToken', response.data.data.tokens.refresh.token);
  }
  
  return response.data;
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Promise with user data and tokens
 */
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  
  if (response.data.success) {
    // Store tokens in local storage
    localStorage.setItem('accessToken', response.data.data.tokens.access.token);
    localStorage.setItem('refreshToken', response.data.data.tokens.refresh.token);
  }
  
  return response.data;
};

/**
 * Logout a user
 * @returns {Promise} - Promise with logout status
 */
export const logout = async () => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    const response = await axios.post(`${API_URL}/auth/logout`, {}, config);
    
    // Remove tokens from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    return response.data;
  }
  
  return { success: true, message: 'Logged out' };
};

/**
 * Get current user profile
 * @returns {Promise} - Promise with user data
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.get(`${API_URL}/auth/me`, config);
  return response.data;
};

/**
 * Refresh access token using refresh token
 * @returns {Promise} - Promise with new tokens
 */
export const refreshTokens = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }
  
  const response = await axios.post(`${API_URL}/auth/refresh-tokens`, {
    refreshToken,
  });
  
  if (response.data.success) {
    // Store new tokens in local storage
    localStorage.setItem('accessToken', response.data.data.tokens.access.token);
    localStorage.setItem('refreshToken', response.data.data.tokens.refresh.token);
  }
  
  return response.data;
};

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @returns {Promise} - Promise with status
 */
export const changePassword = async (passwordData) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.put(
    `${API_URL}/auth/change-password`,
    passwordData,
    config
  );
  
  return response.data;
};

// Create axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is not 401 or request has already been retried, reject
    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Mark request as retried
    originalRequest._retry = true;
    
    try {
      // Try to refresh tokens
      const refreshResponse = await refreshTokens();
      
      if (refreshResponse.success) {
        // Update authorization header with new token
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        
        // Retry original request
        return axios(originalRequest);
      }
    } catch (refreshError) {
      // If refresh fails, logout user
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Set default authorization header if token exists
const token = localStorage.getItem('accessToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshTokens,
  changePassword,
};

export default authService;