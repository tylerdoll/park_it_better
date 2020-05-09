import {combineReducers} from 'redux';
import app from './app';
import resident from './resident';
import visitors from './visitors';

export default combineReducers({app, resident, visitors});
