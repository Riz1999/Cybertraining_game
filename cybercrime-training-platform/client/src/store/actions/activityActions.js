import axios from 'axios';

// Action Types
export const ACTIVITY_HISTORY_REQUEST = 'ACTIVITY_HISTORY_REQUEST';
export const ACTIVITY_HISTORY_SUCCESS = 'ACTIVITY_HISTORY_SUCCESS';
export const ACTIVITY_HISTORY_FAIL = 'ACTIVITY_HISTORY_FAIL';
export const PROGRESS_HISTORY_REQUEST = 'PROGRESS_HISTORY_REQUEST';
export const PROGRESS_HISTORY_SUCCESS = 'PROGRESS_HISTORY_SUCCESS';
export const PROGRESS_HISTORY_FAIL = 'PROGRESS_HISTORY_FAIL';

// Get user activity history
export const getActivityHistory = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ACTIVITY_HISTORY_REQUEST });

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
    const { data } = await axios.get('/api/activities/history', config);

    dispatch({
      type: ACTIVITY_HISTORY_SUCCESS,
      payload: data.data.activities,
    });

    return data.data.activities;
  } catch (error) {
    dispatch({
      type: ACTIVITY_HISTORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get user progress history
export const getProgressHistory = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PROGRESS_HISTORY_REQUEST });

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
    const { data } = await axios.get('/api/progress/history', config);

    dispatch({
      type: PROGRESS_HISTORY_SUCCESS,
      payload: data.data.progressHistory,
    });

    return data.data.progressHistory;
  } catch (error) {
    dispatch({
      type: PROGRESS_HISTORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};