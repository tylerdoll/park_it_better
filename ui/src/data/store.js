import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

import rootReducer from "./reducers";
import { fetchResident } from "./actions/resident";
import { fetchVisitors } from "./actions/visitors";
import { fetchHistory } from "./actions/history";

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

store.dispatch(fetchVisitors());
store.dispatch(fetchResident());
store.dispatch(fetchHistory());

export default store;
