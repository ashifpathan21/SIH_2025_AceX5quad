import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  classes: [],
  loading: false,
  error: null,
};

const classSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setClasses, setLoading, setError } = classSlice.actions;
export default classSlice.reducer;
