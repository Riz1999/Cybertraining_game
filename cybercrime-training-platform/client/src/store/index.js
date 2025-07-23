import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import profileReducer from './reducers/profileReducer';
import progressReducer from './reducers/progressReducer';
import activityReducer from './reducers/activityReducer';
import moduleReducer from './reducers/moduleReducer';
import authReducer from './reducers/authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  modules: moduleReducer,
  progress: progressReducer,
  profile: profileReducer,
  activity: activityReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;