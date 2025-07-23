import axios from 'axios';

// Action Types
export const PROFILE_REQUEST = 'PROFILE_REQUEST';
export const PROFILE_SUCCESS = 'PROFILE_SUCCESS';
export const PROFILE_FAIL = 'PROFILE_FAIL';
export const PROFILE_UPDATE_REQUEST = 'PROFILE_UPDATE_REQUEST';
export const PROFILE_UPDATE_SUCCESS = 'PROFILE_UPDATE_SUCCESS';
export const PROFILE_UPDATE_FAIL = 'PROFILE_UPDATE_FAIL';
export const PROFILE_UPDATE_RESET = 'PROFILE_UPDATE_RESET';
export const PREFERENCES_UPDATE_REQUEST = 'PREFERENCES_UPDATE_REQUEST';
export const PREFERENCES_UPDATE_SUCCESS = 'PREFERENCES_UPDATE_SUCCESS';
export const PREFERENCES_UPDATE_FAIL = 'PREFERENCES_UPDATE_FAIL';
export const PASSWORD_CHANGE_REQUEST = 'PASSWORD_CHANGE_REQUEST';
export const PASSWORD_CHANGE_SUCCESS = 'PASSWORD_CHANGE_SUCCESS';
export const PASSWORD_CHANGE_FAIL = 'PASSWORD_CHANGE_FAIL';
export const PASSWORD_CHANGE_RESET = 'PASSWORD_CHANGE_RESET';

// Get user profile
export const getProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PROFILE_REQUEST });

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
    const { data } = await axios.get('/api/users/profile', config);

    dispatch({
      type: PROFILE_SUCCESS,
      payload: data.data.profile,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Update user profile
export const updateProfile = (profileData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROFILE_UPDATE_REQUEST });

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
    const { data } = await axios.put('/api/users/profile', profileData, config);

    dispatch({
      type: PROFILE_UPDATE_SUCCESS,
      payload: data.data.profile,
    });

    // Update profile in state
    dispatch({
      type: PROFILE_SUCCESS,
      payload: data.data.profile,
    });

    // Reset update status after 3 seconds
    setTimeout(() => {
      dispatch({ type: PROFILE_UPDATE_RESET });
    }, 3000);
  } catch (error) {
    dispatch({
      type: PROFILE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Update user preferences
export const updatePreferences = (preferences) => async (dispatch, getState) => {
  try {
    dispatch({ type: PREFERENCES_UPDATE_REQUEST });

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
    const { data } = await axios.put('/api/users/preferences', { preferences }, config);

    dispatch({
      type: PREFERENCES_UPDATE_SUCCESS,
      payload: data.data.preferences,
    });

    // Update profile in state
    dispatch({
      type: PROFILE_SUCCESS,
      payload: {
        ...getState().profile.profile,
        preferences: data.data.preferences,
      },
    });

    // Reset update status after 3 seconds
    setTimeout(() => {
      dispatch({ type: PROFILE_UPDATE_RESET });
    }, 3000);
  } catch (error) {
    dispatch({
      type: PREFERENCES_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Change password
export const changePassword = (passwordData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PASSWORD_CHANGE_REQUEST });

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
    await axios.put('/api/auth/change-password', passwordData, config);

    dispatch({
      type: PASSWORD_CHANGE_SUCCESS,
    });

    // Reset password change status after 3 seconds
    setTimeout(() => {
      dispatch({ type: PASSWORD_CHANGE_RESET });
    }, 3000);
  } catch (error) {
    dispatch({
      type: PASSWORD_CHANGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};