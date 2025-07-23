import authService from '../../services/authService';

// Action Types
export const AUTH_REGISTER_REQUEST = 'AUTH_REGISTER_REQUEST';
export const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
export const AUTH_REGISTER_FAIL = 'AUTH_REGISTER_FAIL';

export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAIL = 'AUTH_LOGIN_FAIL';

export const AUTH_LOGOUT = 'AUTH_LOGOUT';

export const AUTH_USER_LOADED = 'AUTH_USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';

export const CLEAR_AUTH_ERROR = 'CLEAR_AUTH_ERROR';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Function} - Thunk function
 */
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_REGISTER_REQUEST });

    const response = await authService.register(userData);

    dispatch({
      type: AUTH_REGISTER_SUCCESS,
      payload: response.data.user,
    });

    // Load user data
    dispatch(loadUser());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    
    dispatch({
      type: AUTH_REGISTER_FAIL,
      payload: errorMessage,
    });
  }
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Function} - Thunk function
 */
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOGIN_REQUEST });

    const response = await authService.login(credentials);

    dispatch({
      type: AUTH_LOGIN_SUCCESS,
      payload: response.data.user,
    });

    // Load user data
    dispatch(loadUser());
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    
    dispatch({
      type: AUTH_LOGIN_FAIL,
      payload: errorMessage,
    });
  }
};

/**
 * Logout a user
 * @returns {Function} - Thunk function
 */
export const logout = () => async (dispatch) => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }

  dispatch({ type: AUTH_LOGOUT });
};

/**
 * Load user data
 * @returns {Function} - Thunk function
 */
export const loadUser = () => async (dispatch) => {
  try {
    const response = await authService.getCurrentUser();

    dispatch({
      type: AUTH_USER_LOADED,
      payload: response.data.user,
    });
  } catch (error) {
    // If token is invalid or expired, logout user
    dispatch({ type: AUTH_ERROR });
  }
};

/**
 * Clear authentication errors
 * @returns {Object} - Action object
 */
export const clearAuthError = () => ({
  type: CLEAR_AUTH_ERROR,
});