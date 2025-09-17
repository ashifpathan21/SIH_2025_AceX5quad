import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  records: [],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setAttendance: (state, action) => {
      state.records = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAttendance, setLoading, setError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
