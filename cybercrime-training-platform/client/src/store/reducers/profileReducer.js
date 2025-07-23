import {
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  PROFILE_FAIL,
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  PROFILE_UPDATE_RESET,
  PREFERENCES_UPDATE_REQUEST,
  PREFERENCES_UPDATE_SUCCESS,
  PREFERENCES_UPDATE_FAIL,
  PASSWORD_CHANGE_REQUEST,
  PASSWORD_CHANGE_SUCCESS,
  PASSWORD_CHANGE_FAIL,
  PASSWORD_CHANGE_RESET,
} from '../actions/profileActions';

const initialState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateSuccess: false,
  updateError: null,
  passwordChangeLoading: false,
  passwordChangeSuccess: false,
  passwordChangeError: null,
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: null,
      };
    case PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case PROFILE_UPDATE_REQUEST:
    case PREFERENCES_UPDATE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateSuccess: false,
        updateError: null,
      };
    case PROFILE_UPDATE_SUCCESS:
    case PREFERENCES_UPDATE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: true,
        updateError: null,
      };
    case PROFILE_UPDATE_FAIL:
    case PREFERENCES_UPDATE_FAIL:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: false,
        updateError: action.payload,
      };
    case PROFILE_UPDATE_RESET:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: false,
        updateError: null,
      };
    case PASSWORD_CHANGE_REQUEST:
      return {
        ...state,
        passwordChangeLoading: true,
        passwordChangeSuccess: false,
        passwordChangeError: null,
      };
    case PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        passwordChangeLoading: false,
        passwordChangeSuccess: true,
        passwordChangeError: null,
      };
    case PASSWORD_CHANGE_FAIL:
      return {
        ...state,
        passwordChangeLoading: false,
        passwordChangeSuccess: false,
        passwordChangeError: action.payload,
      };
    case PASSWORD_CHANGE_RESET:
      return {
        ...state,
        passwordChangeLoading: false,
        passwordChangeSuccess: false,
        passwordChangeError: null,
      };
    default:
      return state;
  }
};

export default profileReducer;