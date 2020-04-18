import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';
import {fetchVisitors, fetchResident} from './actions';

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

store.dispatch(fetchVisitors());
store.dispatch(fetchResident());

export default store;
