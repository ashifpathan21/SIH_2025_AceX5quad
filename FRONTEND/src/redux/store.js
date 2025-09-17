// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import principalReducer from "./slices/principalSlice";
import schoolReducer from "./slices/schoolSlice";
import classReducer from "./slices/classSlice";
import teacherReducer from "./slices/teacherSlice";
import studentReducer from "./slices/studentSlice";
import foodMenuReducer from "./slices/foodMenuSlice";
import attendanceReducer from "./slices/attendanceSlice";

const store = configureStore({
  reducer: {
    principal: principalReducer,
    schools: schoolReducer,
    classes: classReducer,
    teachers: teacherReducer,
    students: studentReducer,
    foodMenu: foodMenuReducer,
    attendance: attendanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
