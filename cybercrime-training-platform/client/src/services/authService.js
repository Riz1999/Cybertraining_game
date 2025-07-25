import axios from 'axios';

// Use the main server on port 5000
const API_URL = 'http://localhost:5000/api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with user data and tokens
 */
export const register = async (userData) => {
  try {
    // Try multiple approaches to connect to the server
    console.log('Attempting to register user with userData:', userData);
    
    // Try using fetch API instead of axios
    const directUrl = 'http://localhost:5000/api/auth/register';
    console.log('Attempting fetch to:', directUrl);
    
    const fetchResponse = await fetch(directUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!fetchResponse.ok) {
      throw new Error(`Server responded with status: ${fetchResponse.status}`);
    }
    
    const responseData = await fetchResponse.json();
    console.log('Registration response:', responseData);
    
    if (responseData.success) {
      // Store tokens in local storage
      localStorage.setItem('accessToken', responseData.data.tokens.access.token);
      localStorage.setItem('refreshToken', responseData.data.tokens.refresh.token);
    }
    
    return {
      data: {
        user: responseData.data.user
      }
    };
  } catch (error) {
    // Log detailed error information
    console.error('Registration error details:', {
      message: error.message
    });
    
    // Try alternative URLs
    try {
      console.log('Trying alternative URL with axios');
      const response = await axios.post('/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Registration response from alternative URL:', response);
      
      if (response.data.success) {
        // Store tokens in local storage
        localStorage.setItem('accessToken', response.data.data.tokens.access.token);
        localStorage.setItem('refreshToken', response.data.data.tokens.refresh.token);
      }
      
      return {
        data: {
          user: response.data.data.user
        }
      };
    } catch (secondError) {
      console.error('Second attempt failed:', secondError);
      throw new Error('Network error. Please check your connection and try again. Make sure the server is running on port 5000 and accessible from the client.');
    }
  }
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Promise with user data and tokens
 */
export const login = async (credentials) => {
  try {
    // Try multiple approaches to connect to the server
    console.log('Attempting to login with credentials:', credentials);
    
    // Try using fetch API instead of axios
    const directUrl = 'http://localhost:5000/api/auth/login';
    console.log('Attempting fetch to:', directUrl);
    
    const fetchResponse = await fetch(directUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (!fetchResponse.ok) {
      throw new Error(`Server responded with status: ${fetchResponse.status}`);
    }
    
    const responseData = await fetchResponse.json();
    console.log('Login response:', responseData);
    
    if (responseData.success) {
      // Store tokens in local storage
      localStorage.setItem('accessToken', responseData.data.tokens.access.token);
      localStorage.setItem('refreshToken', responseData.data.tokens.refresh.token);
    }
    
    return {
      data: {
        user: responseData.data.user
      }
    };
  } catch (error) {
    // Log detailed error information
    console.error('Login error details:', {
      message: error.message
    });
    
    // Try alternative URLs
    try {
      console.log('Trying alternative URL with axios');
      const response = await axios.post('/api/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Login response from alternative URL:', response);
      
      if (response.data.success) {
        // Store tokens in local storage
        localStorage.setItem('accessToken', response.data.data.tokens.access.token);
        localStorage.setItem('refreshToken', response.data.data.tokens.refresh.token);
      }
      
      return {
        data: {
          user: response.data.data.user
        }
      };
    } catch (secondError) {
      console.error('Second attempt failed:', secondError);
      throw new Error('Network error. Please check your connection and try again. Make sure the server is running on port 5000 and accessible from the client.');
    }
  }
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
  try {
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
    
    return {
      data: {
        user: response.data.data.user
      }
    };
  } catch (error) {
    // Handle network errors or server not responding
    if (!error.response) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Pass through the server error
    throw error;
  }
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
    
    // Check if error response exists before accessing status
    if (!error.response) {
      return Promise.reject(error);
    }
    
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

/**
 * Test API connectivity
 * @returns {Promise} - Promise with test result
 */
export const testApiConnection = async () => {
  try {
    // Try multiple approaches
    console.log('Testing API connectivity...');
    
    // Try direct URL with fetch
    try {
      const fetchResponse = await fetch('http://localhost:5000/api/test');
      if (fetchResponse.ok) {
        const data = await fetchResponse.json();
        console.log('Direct fetch test successful:', data);
        return { success: true, method: 'direct fetch', data };
      }
    } catch (fetchError) {
      console.error('Direct fetch test failed:', fetchError);
    }
    
    // Try proxy URL with fetch
    try {
      const proxyFetchResponse = await fetch('/api/test');
      if (proxyFetchResponse.ok) {
        const data = await proxyFetchResponse.json();
        console.log('Proxy fetch test successful:', data);
        return { success: true, method: 'proxy fetch', data };
      }
    } catch (proxyFetchError) {
      console.error('Proxy fetch test failed:', proxyFetchError);
    }
    
    // Try direct URL with axios
    try {
      const axiosResponse = await axios.get('http://localhost:5000/api/test');
      console.log('Direct axios test successful:', axiosResponse.data);
      return { success: true, method: 'direct axios', data: axiosResponse.data };
    } catch (axiosError) {
      console.error('Direct axios test failed:', axiosError);
    }
    
    // Try proxy URL with axios
    try {
      const proxyAxiosResponse = await axios.get('/api/test');
      console.log('Proxy axios test successful:', proxyAxiosResponse.data);
      return { success: true, method: 'proxy axios', data: proxyAxiosResponse.data };
    } catch (proxyAxiosError) {
      console.error('Proxy axios test failed:', proxyAxiosError);
    }
    
    // If all tests fail
    return { success: false, message: 'All connection tests failed' };
  } catch (error) {
    console.error('API test error:', error);
    return { success: false, error: error.message };
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshTokens,
  changePassword,
  testApiConnection,
};

export default authService;