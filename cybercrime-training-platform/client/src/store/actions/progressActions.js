import axios from 'axios';

// Action Types
export const PROGRESS_REQUEST = 'PROGRESS_REQUEST';
export const PROGRESS_SUCCESS = 'PROGRESS_SUCCESS';
export const PROGRESS_FAIL = 'PROGRESS_FAIL';
export const PROGRESS_UPDATE_REQUEST = 'PROGRESS_UPDATE_REQUEST';
export const PROGRESS_UPDATE_SUCCESS = 'PROGRESS_UPDATE_SUCCESS';
export const PROGRESS_UPDATE_FAIL = 'PROGRESS_UPDATE_FAIL';
export const STATISTICS_REQUEST = 'STATISTICS_REQUEST';
export const STATISTICS_SUCCESS = 'STATISTICS_SUCCESS';
export const STATISTICS_FAIL = 'STATISTICS_FAIL';
export const TIME_SPENT_UPDATE_REQUEST = 'TIME_SPENT_UPDATE_REQUEST';
export const TIME_SPENT_UPDATE_SUCCESS = 'TIME_SPENT_UPDATE_SUCCESS';
export const TIME_SPENT_UPDATE_FAIL = 'TIME_SPENT_UPDATE_FAIL';
export const XP_EARNED = 'XP_EARNED';
export const BADGE_EARNED = 'BADGE_EARNED';
export const LEVEL_UP = 'LEVEL_UP';
export const XP_NOTIFICATION_CLEAR = 'XP_NOTIFICATION_CLEAR';
export const BADGE_NOTIFICATION_CLEAR = 'BADGE_NOTIFICATION_CLEAR';
export const LEVEL_UP_NOTIFICATION_CLEAR = 'LEVEL_UP_NOTIFICATION_CLEAR';
export const LOGIN_STREAK_REQUEST = 'LOGIN_STREAK_REQUEST';
export const LOGIN_STREAK_SUCCESS = 'LOGIN_STREAK_SUCCESS';
export const LOGIN_STREAK_FAIL = 'LOGIN_STREAK_FAIL';
export const WEAK_AREAS_REQUEST = 'WEAK_AREAS_REQUEST';
export const WEAK_AREAS_SUCCESS = 'WEAK_AREAS_SUCCESS';
export const WEAK_AREAS_FAIL = 'WEAK_AREAS_FAIL';
export const CERTIFICATION_ELIGIBILITY_REQUEST = 'CERTIFICATION_ELIGIBILITY_REQUEST';
export const CERTIFICATION_ELIGIBILITY_SUCCESS = 'CERTIFICATION_ELIGIBILITY_SUCCESS';
export const CERTIFICATION_ELIGIBILITY_FAIL = 'CERTIFICATION_ELIGIBILITY_FAIL';

// Get user progress
export const getProgress = (moduleId = null) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROGRESS_REQUEST });

    // Get token from state
    const { auth: { user } } = getState();

    // Set headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    // Set query params
    const params = moduleId ? { moduleId } : {};

    // Make API call
    const { data } = await axios.get('/api/progress', { ...config, params });

    dispatch({
      type: PROGRESS_SUCCESS,
      payload: data.data.progress,
    });
  } catch (error) {
    dispatch({
      type: PROGRESS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Update user progress
export const updateProgress = (progressData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROGRESS_UPDATE_REQUEST });

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
    const { data } = await axios.post('/api/progress', progressData, config);

    dispatch({
      type: PROGRESS_UPDATE_SUCCESS,
      payload: data.data.progress,
    });

    // Handle XP earned
    if (data.data.xp && data.data.xp.earned > 0) {
      dispatch({
        type: XP_EARNED,
        payload: data.data.xp,
      });

      // Handle level up
      if (data.data.xp.leveledUp) {
        dispatch({
          type: LEVEL_UP,
          payload: data.data.xp.level,
        });
      }
    }

    // Handle badge earned
    if (data.data.badge) {
      dispatch({
        type: BADGE_EARNED,
        payload: data.data.badge,
      });
    }

    return data.data;
  } catch (error) {
    dispatch({
      type: PROGRESS_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    throw error;
  }
};

// Get user statistics
export const getStatistics = () => async (dispatch, getState) => {
  try {
    dispatch({ type: STATISTICS_REQUEST });

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
    const { data } = await axios.get('/api/progress/statistics', config);

    dispatch({
      type: STATISTICS_SUCCESS,
      payload: data.data.statistics,
    });
  } catch (error) {
    dispatch({
      type: STATISTICS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Update time spent on module
export const updateTimeSpent = (moduleId, timeSpent) => async (dispatch, getState) => {
  try {
    dispatch({ type: TIME_SPENT_UPDATE_REQUEST });

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
    const { data } = await axios.post('/api/progress/time-spent', { moduleId, timeSpent }, config);

    dispatch({
      type: TIME_SPENT_UPDATE_SUCCESS,
      payload: data.data.progress,
    });
  } catch (error) {
    dispatch({
      type: TIME_SPENT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Update login streak
export const updateLoginStreak = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LOGIN_STREAK_REQUEST });

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
    const { data } = await axios.post('/api/progress/login-streak', {}, config);

    dispatch({
      type: LOGIN_STREAK_SUCCESS,
      payload: data.data,
    });

    // If XP was earned, dispatch XP notification
    if (data.data.xpEarned > 0) {
      dispatch({
        type: XP_EARNED,
        payload: {
          earned: data.data.xpEarned,
        },
      });
    }

    return data.data;
  } catch (error) {
    dispatch({
      type: LOGIN_STREAK_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get user's weak areas
export const getWeakAreas = () => async (dispatch, getState) => {
  try {
    dispatch({ type: WEAK_AREAS_REQUEST });

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
    const { data } = await axios.get('/api/progress/weak-areas', config);

    dispatch({
      type: WEAK_AREAS_SUCCESS,
      payload: data.data.weakAreas,
    });

    return data.data.weakAreas;
  } catch (error) {
    dispatch({
      type: WEAK_AREAS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Check certification eligibility
export const checkCertificationEligibility = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CERTIFICATION_ELIGIBILITY_REQUEST });

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
    const { data } = await axios.get('/api/progress/certification-eligibility', config);

    dispatch({
      type: CERTIFICATION_ELIGIBILITY_SUCCESS,
      payload: data.data.eligibility,
    });

    return data.data.eligibility;
  } catch (error) {
    dispatch({
      type: CERTIFICATION_ELIGIBILITY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Clear notification actions
export const clearXPNotification = () => ({ type: XP_NOTIFICATION_CLEAR });
export const clearBadgeNotification = () => ({ type: BADGE_NOTIFICATION_CLEAR });
export const clearLevelUpNotification = () => ({ type: LEVEL_UP_NOTIFICATION_CLEAR });