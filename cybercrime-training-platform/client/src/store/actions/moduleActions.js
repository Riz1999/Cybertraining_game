import axios from 'axios';

// Action Types
export const MODULES_REQUEST = 'MODULES_REQUEST';
export const MODULES_SUCCESS = 'MODULES_SUCCESS';
export const MODULES_FAIL = 'MODULES_FAIL';
export const MODULE_DETAIL_REQUEST = 'MODULE_DETAIL_REQUEST';
export const MODULE_DETAIL_SUCCESS = 'MODULE_DETAIL_SUCCESS';
export const MODULE_DETAIL_FAIL = 'MODULE_DETAIL_FAIL';
export const AVAILABLE_MODULES_REQUEST = 'AVAILABLE_MODULES_REQUEST';
export const AVAILABLE_MODULES_SUCCESS = 'AVAILABLE_MODULES_SUCCESS';
export const AVAILABLE_MODULES_FAIL = 'AVAILABLE_MODULES_FAIL';
export const RECOMMENDED_MODULE_REQUEST = 'RECOMMENDED_MODULE_REQUEST';
export const RECOMMENDED_MODULE_SUCCESS = 'RECOMMENDED_MODULE_SUCCESS';
export const RECOMMENDED_MODULE_FAIL = 'RECOMMENDED_MODULE_FAIL';
export const CHECK_PREREQUISITES_REQUEST = 'CHECK_PREREQUISITES_REQUEST';
export const CHECK_PREREQUISITES_SUCCESS = 'CHECK_PREREQUISITES_SUCCESS';
export const CHECK_PREREQUISITES_FAIL = 'CHECK_PREREQUISITES_FAIL';
export const MODULE_UNLOCK_NOTIFICATION = 'MODULE_UNLOCK_NOTIFICATION';
export const MODULE_UNLOCK_NOTIFICATION_CLEAR = 'MODULE_UNLOCK_NOTIFICATION_CLEAR';
export const SET_CURRENT_ACTIVITY = 'SET_CURRENT_ACTIVITY';

// Get all modules
export const getModules = (query = {}) => async (dispatch) => {
  try {
    dispatch({ type: MODULES_REQUEST });

    // Build query string
    const queryString = Object.keys(query)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
      .join('&');

    // Make API call
    const { data } = await axios.get(`/api/modules${queryString ? `?${queryString}` : ''}`);

    dispatch({
      type: MODULES_SUCCESS,
      payload: data.data.modules,
    });

    return data.data.modules;
  } catch (error) {
    console.error('Error fetching modules:', error);
    
    // Return empty array as fallback to prevent app crashes
    dispatch({
      type: MODULES_SUCCESS,
      payload: [],
    });
    
    dispatch({
      type: MODULES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Unable to fetch modules. Using offline mode.',
    });
    
    return [];
  }
};

// Get module by ID
export const getModuleById = (id) => async (dispatch) => {
  try {
    dispatch({ type: MODULE_DETAIL_REQUEST });

    // Make API call
    const { data } = await axios.get(`/api/modules/${id}`);

    dispatch({
      type: MODULE_DETAIL_SUCCESS,
      payload: data.data.module,
    });

    return data.data.module;
  } catch (error) {
    console.error('Error fetching module:', error);
    
    // Return null as fallback
    dispatch({
      type: MODULE_DETAIL_SUCCESS,
      payload: null,
    });
    
    dispatch({
      type: MODULE_DETAIL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Unable to fetch module details. Using offline mode.',
    });
    
    return null;
  }
};

// Get available modules for user
export const getAvailableModules = () => async (dispatch, getState) => {
  try {
    dispatch({ type: AVAILABLE_MODULES_REQUEST });

    // Get token from state
    const { auth: { user } } = getState();

    // Check if user exists and has token
    if (!user || !user.token) {
      dispatch({
        type: AVAILABLE_MODULES_SUCCESS,
        payload: [],
      });
      return [];
    }

    // Set headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    // Make API call
    const { data } = await axios.get('/api/modules/user/available', config);

    dispatch({
      type: AVAILABLE_MODULES_SUCCESS,
      payload: data.data.modules,
    });

    return data.data.modules;
  } catch (error) {
    console.error('Error fetching available modules:', error);
    
    // Return empty array as fallback
    dispatch({
      type: AVAILABLE_MODULES_SUCCESS,
      payload: [],
    });
    
    dispatch({
      type: AVAILABLE_MODULES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Unable to fetch available modules.',
    });
    
    return [];
  }
};

// Get next recommended module for user
export const getNextRecommendedModule = () => async (dispatch, getState) => {
  try {
    dispatch({ type: RECOMMENDED_MODULE_REQUEST });

    // Get token from state
    const { auth: { user } } = getState();

    // Set headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    // Make API call
    const { data } = await axios.get('/api/modules/user/recommended', config);

    dispatch({
      type: RECOMMENDED_MODULE_SUCCESS,
      payload: data.data.module,
    });

    return data.data.module;
  } catch (error) {
    dispatch({
      type: RECOMMENDED_MODULE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Check module prerequisites
export const checkPrerequisites = (moduleId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHECK_PREREQUISITES_REQUEST });

    // Get token from state
    const { auth: { user } } = getState();

    // Set headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    // Make API call
    const { data } = await axios.get(`/api/modules/${moduleId}/prerequisites`, config);

    dispatch({
      type: CHECK_PREREQUISITES_SUCCESS,
      payload: data.data,
    });

    return data.data;
  } catch (error) {
    dispatch({
      type: CHECK_PREREQUISITES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Set module unlock notification
export const setModuleUnlockNotification = (module) => ({
  type: MODULE_UNLOCK_NOTIFICATION,
  payload: module,
});

// Clear module unlock notification
export const clearModuleUnlockNotification = () => ({
  type: MODULE_UNLOCK_NOTIFICATION_CLEAR,
});

// Set current activity
export const setCurrentActivity = (activityId) => ({
  type: SET_CURRENT_ACTIVITY,
  payload: activityId,
});