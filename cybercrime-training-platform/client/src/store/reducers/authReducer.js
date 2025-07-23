import {
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAIL,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAIL,
  AUTH_LOGOUT,
  AUTH_USER_LOADED,
  AUTH_ERROR,
  CLEAR_AUTH_ERROR,
} from '../actions/authActions';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

/**
 * Auth reducer
 * @param {Object} state - Current state
 * @param {Object} action - Action object
 * @returns {Object} - New state
 */
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_REGISTER_REQUEST:
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_REGISTER_SUCCESS:
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case AUTH_USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };

    case AUTH_REGISTER_FAIL:
    case AUTH_LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case AUTH_ERROR:
    case AUTH_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: null,
      };

    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null,
      };

    case 'BADGE_EARNED':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          badgesEarned: [
            ...(state.user.badgesEarned || []),
            {
              ...action.payload,
              earnedAt: new Date().toISOString()
            }
          ]
        } : state.user,
      };

    default:
      return state;
  }
};

export default authReducer;