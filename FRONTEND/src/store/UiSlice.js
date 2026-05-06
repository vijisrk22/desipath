import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loading: false,
    activeRequests: 0,
  },
  reducers: {
    startLoading: (state) => {
      state.activeRequests += 1;
      state.loading = true;
    },
    stopLoading: (state) => {
      state.activeRequests = Math.max(0, state.activeRequests - 1);
      if (state.activeRequests === 0) {
        state.loading = false;
      }
    },
    resetLoading: (state) => {
      state.activeRequests = 0;
      state.loading = false;
    }
  },
});

export const { startLoading, stopLoading, resetLoading } = uiSlice.actions;
export default uiSlice.reducer;
