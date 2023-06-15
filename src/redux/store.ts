import { configureStore, Action } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import authReducer from "./slices/authSlice"
import themeReducer from "./slices/themeSlice";
import notificationReducer from "./slices/notificationSlice";
import projectReducer from "./slices/projectsSlice";
import usersReducer from "./slices/usersSlice";
import bugsReducer from "./slices/bugsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        notification: notificationReducer,
        projects: projectReducer,
        users: usersReducer,
        bugs: bugsReducer
    }
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;