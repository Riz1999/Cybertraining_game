import {
  PROGRESS_REQUEST,
  PROGRESS_SUCCESS,
  PROGRESS_FAIL,
  PROGRESS_UPDATE_REQUEST,
  PROGRESS_UPDATE_SUCCESS,
  PROGRESS_UPDATE_FAIL,
  STATISTICS_REQUEST,
  STATISTICS_SUCCESS,
  STATISTICS_FAIL,
  TIME_SPENT_UPDATE_REQUEST,
  TIME_SPENT_UPDATE_SUCCESS,
  TIME_SPENT_UPDATE_FAIL,
  XP_EARNED,
  BADGE_EARNED,
  LEVEL_UP,
  XP_NOTIFICATION_CLEAR,
  BADGE_NOTIFICATION_CLEAR,
  LEVEL_UP_NOTIFICATION_CLEAR,
  LOGIN_STREAK_REQUEST,
  LOGIN_STREAK_SUCCESS,
  LOGIN_STREAK_FAIL,
  WEAK_AREAS_REQUEST,
  WEAK_AREAS_SUCCESS,
  WEAK_AREAS_FAIL,
  CERTIFICATION_ELIGIBILITY_REQUEST,
  CERTIFICATION_ELIGIBILITY_SUCCESS,
  CERTIFICATION_ELIGIBILITY_FAIL,
} from '../actions/progressActions';

const initialState = {
  progress: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  statistics: null,
  statisticsLoading: false,
  statisticsError: null,
  timeSpentLoading: false,
  timeSpentError: null,
  xpNotification: null,
  badgeNotification: null,
  levelUpNotification: null,
  streakData: null,
  streakLoading: false,
  streakError: null,
  weakAreas: null,
  weakAreasLoading: false,
  weakAreasError: null,
  certificationEligibility: null,
  certificationEligibilityLoading: false,
  certificationEligibilityError: null,
};

export const progressReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROGRESS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PROGRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        progress: action.payload,
        error: null,
      };
    case PROGRESS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case PROGRESS_UPDATE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null,
      };
    case PROGRESS_UPDATE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        progress: action.payload,
        updateError: null,
      };
    case PROGRESS_UPDATE_FAIL:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload,
      };
    case STATISTICS_REQUEST:
      return {
        ...state,
        statisticsLoading: true,
        statisticsError: null,
      };
    case STATISTICS_SUCCESS:
      return {
        ...state,
        statisticsLoading: false,
        statistics: action.payload,
        statisticsError: null,
      };
    case STATISTICS_FAIL:
      return {
        ...state,
        statisticsLoading: false,
        statisticsError: action.payload,
      };
    case TIME_SPENT_UPDATE_REQUEST:
      return {
        ...state,
        timeSpentLoading: true,
        timeSpentError: null,
      };
    case TIME_SPENT_UPDATE_SUCCESS:
      return {
        ...state,
        timeSpentLoading: false,
        progress: action.payload,
        timeSpentError: null,
      };
    case TIME_SPENT_UPDATE_FAIL:
      return {
        ...state,
        timeSpentLoading: false,
        timeSpentError: action.payload,
      };
    case XP_EARNED:
      return {
        ...state,
        xpNotification: action.payload,
      };
    case BADGE_EARNED:
      return {
        ...state,
        badgeNotification: action.payload,
      };
    case LEVEL_UP:
      return {
        ...state,
        levelUpNotification: action.payload,
      };
    case XP_NOTIFICATION_CLEAR:
      return {
        ...state,
        xpNotification: null,
      };
    case BADGE_NOTIFICATION_CLEAR:
      return {
        ...state,
        badgeNotification: null,
      };
    case LEVEL_UP_NOTIFICATION_CLEAR:
      return {
        ...state,
        levelUpNotification: null,
      };
    case LOGIN_STREAK_REQUEST:
      return {
        ...state,
        streakLoading: true,
        streakError: null,
      };
    case LOGIN_STREAK_SUCCESS:
      return {
        ...state,
        streakLoading: false,
        streakData: action.payload.streakData,
        streakError: null,
      };
    case LOGIN_STREAK_FAIL:
      return {
        ...state,
        streakLoading: false,
        streakError: action.payload,
      };
    case WEAK_AREAS_REQUEST:
      return {
        ...state,
        weakAreasLoading: true,
        weakAreasError: null,
      };
    case WEAK_AREAS_SUCCESS:
      return {
        ...state,
        weakAreasLoading: false,
        weakAreas: action.payload,
        weakAreasError: null,
      };
    case WEAK_AREAS_FAIL:
      return {
        ...state,
        weakAreasLoading: false,
        weakAreasError: action.payload,
      };
    case CERTIFICATION_ELIGIBILITY_REQUEST:
      return {
        ...state,
        certificationEligibilityLoading: true,
        certificationEligibilityError: null,
      };
    case CERTIFICATION_ELIGIBILITY_SUCCESS:
      return {
        ...state,
        certificationEligibilityLoading: false,
        certificationEligibility: action.payload,
        certificationEligibilityError: null,
      };
    case CERTIFICATION_ELIGIBILITY_FAIL:
      return {
        ...state,
        certificationEligibilityLoading: false,
        certificationEligibilityError: action.payload,
      };
    default:
      return state;
  }
};

export default progressReducer;