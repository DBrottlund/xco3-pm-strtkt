
import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import thunkMiddleware from "redux-thunk";

const store = configureStore({
	reducer: reducer
}, applyMiddleware(thunkMiddleware));

export default store;
