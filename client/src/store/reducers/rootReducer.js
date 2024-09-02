// src/store/reducers/rootReducer.js
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import { persistReducer } from "redux-persist";

const commonConfig = {
  storage,
  stateReconciler: autoMergeLevel2,
};

const authConfig = {
  ...commonConfig,
  key: "auth",
  whitelist: ["isLoggedIn", "token", "user"], // Thêm user vào whitelist
};

const rootReducer = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  user: userReducer,
  // species: speciesReducer,
  // province: provinceReducer,
  // properties: propertiesReducer,
  // genus: genusReducer,
});

export default rootReducer;
