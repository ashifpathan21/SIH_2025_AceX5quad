import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menu: [],
  loading: false,
  error: null,
};

const foodMenuSlice = createSlice({
  name: "foodMenu",
  initialState,
  reducers: {
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setMenu, setLoading, setError } = foodMenuSlice.actions;
export default foodMenuSlice.reducer;
