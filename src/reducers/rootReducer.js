import { combineReducers } from "redux";
import appStateReducer from "./appStateReducer";
import { routerReducer } from "react-router-redux";

const rootReducer = combineReducers({
  appStateReducer,
  routing: routerReducer,
});

export default rootReducer;
