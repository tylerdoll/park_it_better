import { combineReducers } from "redux";
import app from "./app";
import resident from "./resident";
import visitors from "./visitors";
import permitHistory from "./history";

export default combineReducers({ app, resident, visitors, permitHistory });
