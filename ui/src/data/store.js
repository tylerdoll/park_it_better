import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';
import {fetchVisitors} from './actions';

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

store.dispatch(fetchVisitors());

export default store;
