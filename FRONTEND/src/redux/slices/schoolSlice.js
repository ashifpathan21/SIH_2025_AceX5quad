import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  schools: [],
  loading: false,
  error: null,
};

const schoolSlice = createSlice({
  name: "schools",
  initialState,
  reducers: {
    setSchools: (state, action) => {
      state.schools = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSchools, setLoading, setError } = schoolSlice.actions;
export default schoolSlice.reducer;
