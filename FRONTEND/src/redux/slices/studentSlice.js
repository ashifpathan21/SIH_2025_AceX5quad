import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setStudents, setLoading, setError } = studentSlice.actions;
export default studentSlice.reducer;
