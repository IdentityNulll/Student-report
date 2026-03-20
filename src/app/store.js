import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import lessonsReducer from "../features/lessons/lessonsSlice";
import attendanceReducer from "../features/attendance/attendanceSlice";
import profileReducer from "../features/profile/profileSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonsReducer,
    attendance: attendanceReducer,
    profile: profileReducer,
  },
});
