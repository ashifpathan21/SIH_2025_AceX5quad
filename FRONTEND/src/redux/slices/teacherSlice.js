import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teachers: [],
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    setTeachers: (state, action) => {
      state.teachers = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTeachers, setLoading, setError } = teacherSlice.actions;
export default teacherSlice.reducer;
