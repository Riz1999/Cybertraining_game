import {
  ACTIVITY_HISTORY_REQUEST,
  ACTIVITY_HISTORY_SUCCESS,
  ACTIVITY_HISTORY_FAIL,
  PROGRESS_HISTORY_REQUEST,
  PROGRESS_HISTORY_SUCCESS,
  PROGRESS_HISTORY_FAIL,
} from '../actions/activityActions';

const initialState = {
  activities: [],
  activitiesLoading: false,
  activitiesError: null,
  progressHistory: [],
  progressHistoryLoading: false,
  progressHistoryError: null,
};

export const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIVITY_HISTORY_REQUEST:
      return {
        ...state,
        activitiesLoading: true,
      };
    case ACTIVITY_HISTORY_SUCCESS:
      return {
        ...state,
        activitiesLoading: false,
        activities: action.payload,
        activitiesError: null,
      };
    case ACTIVITY_HISTORY_FAIL:
      return {
        ...state,
        activitiesLoading: false,
        activitiesError: action.payload,
      };
    case PROGRESS_HISTORY_REQUEST:
      return {
        ...state,
        progressHistoryLoading: true,
      };
    case PROGRESS_HISTORY_SUCCESS:
      return {
        ...state,
        progressHistoryLoading: false,
        progressHistory: action.payload,
        progressHistoryError: null,
      };
    case PROGRESS_HISTORY_FAIL:
      return {
        ...state,
        progressHistoryLoading: false,
        progressHistoryError: action.payload,
      };
    default:
      return state;
  }
};

export default activityReducer;