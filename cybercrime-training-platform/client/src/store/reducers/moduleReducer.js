import {
  MODULES_REQUEST,
  MODULES_SUCCESS,
  MODULES_FAIL,
  MODULE_DETAIL_REQUEST,
  MODULE_DETAIL_SUCCESS,
  MODULE_DETAIL_FAIL,
  AVAILABLE_MODULES_REQUEST,
  AVAILABLE_MODULES_SUCCESS,
  AVAILABLE_MODULES_FAIL,
  RECOMMENDED_MODULE_REQUEST,
  RECOMMENDED_MODULE_SUCCESS,
  RECOMMENDED_MODULE_FAIL,
  CHECK_PREREQUISITES_REQUEST,
  CHECK_PREREQUISITES_SUCCESS,
  CHECK_PREREQUISITES_FAIL,
  MODULE_UNLOCK_NOTIFICATION,
  MODULE_UNLOCK_NOTIFICATION_CLEAR,
  SET_CURRENT_ACTIVITY,
} from '../actions/moduleActions';

const initialState = {
  modules: [],
  loading: false,
  error: null,
  currentModule: null,
  moduleLoading: false,
  moduleError: null,
  availableModules: [],
  availableModulesLoading: false,
  availableModulesError: null,
  recommendedModule: null,
  recommendedModuleLoading: false,
  recommendedModuleError: null,
  prerequisites: null,
  prerequisitesLoading: false,
  prerequisitesError: null,
  unlockedModule: null,
  currentActivityId: null,
};

export const moduleReducer = (state = initialState, action) => {
  switch (action.type) {
    case MODULES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case MODULES_SUCCESS:
      return {
        ...state,
        loading: false,
        modules: action.payload,
        error: null,
      };
    case MODULES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case MODULE_DETAIL_REQUEST:
      return {
        ...state,
        moduleLoading: true,
      };
    case MODULE_DETAIL_SUCCESS:
      return {
        ...state,
        moduleLoading: false,
        currentModule: action.payload,
        moduleError: null,
        // Set current activity to first activity if not already set
        currentActivityId: state.currentActivityId || (action.payload.activities && action.payload.activities.length > 0 
          ? action.payload.activities[0].id 
          : null),
      };
    case MODULE_DETAIL_FAIL:
      return {
        ...state,
        moduleLoading: false,
        moduleError: action.payload,
      };
    case AVAILABLE_MODULES_REQUEST:
      return {
        ...state,
        availableModulesLoading: true,
      };
    case AVAILABLE_MODULES_SUCCESS:
      return {
        ...state,
        availableModulesLoading: false,
        availableModules: action.payload,
        availableModulesError: null,
      };
    case AVAILABLE_MODULES_FAIL:
      return {
        ...state,
        availableModulesLoading: false,
        availableModulesError: action.payload,
      };
    case RECOMMENDED_MODULE_REQUEST:
      return {
        ...state,
        recommendedModuleLoading: true,
      };
    case RECOMMENDED_MODULE_SUCCESS:
      return {
        ...state,
        recommendedModuleLoading: false,
        recommendedModule: action.payload,
        recommendedModuleError: null,
      };
    case RECOMMENDED_MODULE_FAIL:
      return {
        ...state,
        recommendedModuleLoading: false,
        recommendedModuleError: action.payload,
      };
    case CHECK_PREREQUISITES_REQUEST:
      return {
        ...state,
        prerequisitesLoading: true,
      };
    case CHECK_PREREQUISITES_SUCCESS:
      return {
        ...state,
        prerequisitesLoading: false,
        prerequisites: action.payload,
        prerequisitesError: null,
      };
    case CHECK_PREREQUISITES_FAIL:
      return {
        ...state,
        prerequisitesLoading: false,
        prerequisitesError: action.payload,
      };
    case MODULE_UNLOCK_NOTIFICATION:
      return {
        ...state,
        unlockedModule: action.payload,
      };
    case MODULE_UNLOCK_NOTIFICATION_CLEAR:
      return {
        ...state,
        unlockedModule: null,
      };
    case SET_CURRENT_ACTIVITY:
      return {
        ...state,
        currentActivityId: action.payload,
      };
    default:
      return state;
  }
};

export default moduleReducer;