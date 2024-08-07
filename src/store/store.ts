import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { AuthReducer } from "../slice/authSlice";
import { userReducer } from "../slice/userSlice";
import { selectReducer } from "../slice/selectSlice";
import { taskApi } from "../api/taskApi";
import { userApi } from "../api/userApi";
import { fileApi } from "../api/fileApi";
import { authApi } from "../api/authApi";
import { AppReducer } from "../slice/appSlice";
import { reportApi } from "../api/reportApi";
const persisConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  AuthReducer,
  userReducer,
  AppReducer,
});

const persistedReducer = persistReducer(persisConfig, reducer);

export const store = configureStore({
  reducer: {
    persistedReducer,
    selectReducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
  }, // Remove the extra 'reducer' field
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      taskApi.middleware,
      userApi.middleware,
      fileApi.middleware,
      authApi.middleware,
      reportApi.middleware,
    ]),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
