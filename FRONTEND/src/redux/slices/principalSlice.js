import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  loading: false,
  error: null,
  data: null 
};

const principalSlice = createSlice({
  name: "principal",
  initialState,
  reducers: {
    setPrincipal: (state, action) => {
      state.profile = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setPrincipal, setLoading, setError , setData } = principalSlice.actions;
export default principalSlice.reducer;
